import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import openai  # pip install openai
from openai import OpenAI
import json
import re
import numpy as np
from flask_cors import CORS, cross_origin

from textblob import TextBlob
from reviews import bp as reviews_bp
from dotenv import load_dotenv

# load environment variables
load_dotenv()

# OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# ==============================
# Flask setup
# ==============================
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(reviews_bp)

 


# Database setup (SQLite)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# ==============================
# User model
# ==============================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

# ==============================
# Load Dataset (parquet only)
# ==============================
DATA_PARQUET = os.path.join(os.path.dirname(__file__), "..", "data", "comparison_dataset.parquet")
DATA_PARQUET = os.path.abspath(DATA_PARQUET)

df = None

def load_df():
    global df
    if os.path.exists(DATA_PARQUET):
        try:
            df = pd.read_parquet(DATA_PARQUET)
            print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
            print("📌 First few columns:", df.columns.tolist()[:10])
            print("📌 First 3 rows:\n", df.head(3))
        except Exception as e:
            print(f"❌ Failed to load dataset: {e}")
    else:
        print(f"❌ Dataset file not found at: {DATA_PARQUET}")

# Load dataset on startup
load_df()

# ==============================
# Helper
# ==============================
def to_float(x, default=0.0):
    try:
        return float(x)
    except (TypeError, ValueError):
        return default


@app.route("/")
def home():
    return "✅ Flask is running!"

# ==============================
# Auth Routes (No JWT)
# ==============================
@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        if not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Incorrect password"}), 401

        # Success
        return jsonify({
            "message": f"Login successful! Welcome {user.username}",
            "username": user.username
        }), 200

    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500


# ---------------------------
# CATEGORY MAPPING
# ---------------------------
CATEGORY_MAP = {
    # Furniture / Home & Decor
    "furniture": "Furniture",
    "sofa": "Furniture",
    "showpieces": "Home & Decor",
    "decorative item": "Home & Decor",
    "decor": "Home & Decor",

    # Home & Kitchen
    "cookware": "Home & Kitchen",
    "cooker": "Home & Kitchen",
    "mixer":"Home & Kitchen",

    # Electronics
    "mobile": "Mobiles and Accesories",
    "smartphone": "Mobiles and Accesories",
    "android": "Mobiles and Accesories",
    "iphone": "Mobiles and Accesories",
    "laptop": "Laptops and Accesories",
    
    "computer": "Computers",
    "desktop": "Computers",
    
    "tv": "Electronics",
    "television": "Electronics",
    "refrijerator":"Electronics",
    "washing macine":"Electronics",
    "microwave":"Electronics",
    "batery":"Electronics",
    "bulb": "Electronics",
    "headphone": "Electronics",
    "earphone": "Electronics",
    "speaker": "Electronics",
    "smartwatch": "Wearables",
    "fitness band": "Wearables",

    # Clothing
    "lehenga": "Clothing",
    "kurta": "Clothing",
    "leggings": "Clothing",
    "t-shirt": "Clothing",
    "shirt": "Clothing",
    "dress": "Clothing",
    "jeans": "Clothing",
    "trousers": "Clothing",

    # Footwear
    "footwear": "Footwear",
    "footware": "Footwear",
    "shoes": "Footwear",
    "sneakers": "Footwear",
    "sandals": "Footwear",
    "heels": "Footwear",
    "boots": "Footwear",

    # Jewelry
    "bangles":"Jewellery",
    "necklace":"Jewellery",
    "rings":"Jewellery",
    "braclate":"Jewellery",
    "earings":"Jewellery",
    "nosering":"Jewellery",
    "anklets":"Jewellery",

    # Beauty & Skincare
    "beauty": "Beauty & Skincare",
    "skin care": "Beauty & Skincare",
    "skincare": "Beauty & Skincare",
    "makeup": "Beauty & Skincare",
    "personal care": "Beauty & Skincare",
    "cosmetic": "Beauty & Skincare",
    "facewash": "Beauty & Skincare",
    "lotion": "Beauty & Skincare",
    "conditioner": "Beauty & Skincare",
    "perfume": "Beauty & Skincare",

    # Baby & Kids
    "diaper": "Baby Care",
    "clothes":"Baby Care",

    # Others / fallback
    "stationery":"Stationery",
}

# ---------------------------
# CATEGORY CLEAN FUNCTION
# ---------------------------
def extract_main_category(cat):
    if not isinstance(cat, str):
        return "Others"
    text = cat.lower()
    for sep in [" & ", "/", ">", "›"]:
        text = text.replace(sep, " ")
    text = text.strip()
    for key in CATEGORY_MAP:
        if key in text:
            return CATEGORY_MAP[key]
    return "Others"

# ---------------------------
# LOAD PRODUCTS DATA
# ---------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARQUET_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "outputs", "products.parquet"))

try:
    df = pd.read_parquet(PARQUET_PATH)
except FileNotFoundError:
    df = pd.DataFrame(columns=["product_name", "product_category", "platform", "price"])
    print(f"Parquet file not found at {PARQUET_PATH}. Using empty DataFrame.")

# Fill missing product_name
df["product_name"] = df["product_name"].fillna("")

# ---------------------------
# REMOVE UNWANTED PRODUCTS
# ---------------------------
# Remove products containing 'costume' or 'costumes'
df = df[~df["product_name"].str.lower().str.contains(r"costume[s]?", na=False)]
# Remove products containing 'doll' or 'dolls'
df = df[~df["product_name"].str.lower().str.contains(r"doll[s]?", na=False)]

# Apply category mapping
df["product_category_clean"] = df["product_category"].astype(str).apply(extract_main_category)

# Add short_name column (if not present)
if "short_name" not in df.columns:
    df["short_name"] = df["product_name"]

# ---------------------------
# /api/categories
# ---------------------------
@app.route("/api/categories", methods=["GET"])
def get_categories():
    global df
    res = df.copy()

    # Ensure 'added_at' exists
    if "added_at" in res.columns:
        res["added_at"] = pd.to_datetime(res["added_at"], errors="coerce")
    else:
        res["added_at"] = pd.Timestamp.min

    # Ensure 'is_real_time' exists
    if "is_real_time" not in res.columns:
        res["is_real_time"] = False

    # Priority timestamp: real-time products get max timestamp
    res["priority_ts"] = res["added_at"]
    res.loc[res["is_real_time"], "priority_ts"] = pd.Timestamp.max

    # Group by category → latest priority
    category_priority = (
        res.groupby("product_category_clean")["priority_ts"]
        .max()
        .reset_index()
    )

    category_priority = category_priority[category_priority["priority_ts"].notna()]
    category_priority = category_priority.sort_values(by="priority_ts", ascending=False)
    categories = category_priority["product_category_clean"].tolist()
    return jsonify(categories)

# ---------------------------
# /api/products
# ---------------------------
@app.route("/api/products", methods=["GET"])
def get_products():
    category = request.args.get("category")
    search_text = request.args.get("search")

    res = df.copy()

    res["product_category_clean"] = res["product_category_clean"].fillna("")
    res["product_name"] = res["product_name"].fillna("")
    res["short_name"] = res.get("short_name", res["product_name"])
    if "brand" not in res.columns:
        res["brand"] = None

    # Normalize product_name
    res["product_name_norm"] = res["product_name"].str.lower().str.strip()

    # 1️⃣ Filter by category
    if category:
        res = res[res["product_category_clean"].str.lower() == category.lower()]

    # 2️⃣ Exact-word search on short_name
    if search_text:
        search_text = search_text.lower().strip()
        res = res[
            res["short_name"].str.lower().str.split().apply(lambda words: search_text in words)
        ]

    # 3️⃣ Remove duplicates (same product_name + brand)
    res["duplicate_count"] = res.groupby(["product_name", "brand"])["platform"].transform("count")

    # 4️⃣ Prioritize real-time and duplicates across platforms
    if "is_real_time" not in res.columns:
        res["is_real_time"] = False

    res["original_order"] = res.index
    res = res.sort_values(
        by=["is_real_time", "duplicate_count", "original_order"],
        ascending=[False, False, True]
    )

    # Drop duplicates
    res = res.drop_duplicates(subset=["product_name", "brand"], keep="first")

    # Clean response
    res = res.drop(columns=["product_name_norm", "original_order", "duplicate_count"])

    return jsonify(res.to_dict(orient="records"))




import math


# --------------------------------------------------
# JSON SANITIZER (PREVENTS NaN / Inf ERRORS)
# --------------------------------------------------
def sanitize_json(obj):
    """Recursively replace NaN / Inf with None for JSON"""
    if isinstance(obj, dict):
        return {k: sanitize_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_json(i) for i in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    else:
        return obj

# -----------------------------
# CATEGORY-AWARE FILTER
# -----------------------------
def matches_category(query, row):
    """Return True if the product matches query and is not noise"""
    if not query:
        return True  # if no query, keep all

    # Collect all text fields
    text_fields = [
        # row.get("product_name", ""),
        # row.get("description", ""),
        row.get("short_name", ""),
        row.get("product_category_clean", "")
    ]
    text = " ".join([str(f).lower() for f in text_fields])
    query = query.lower().strip()

    # synonyms per category
    synonyms = {
        "shoes": ["shoe", "shoes", "sneaker", "sneakers", "boot", "boots", "sandals", "heels", "loafer", "slipper", "flip flop"],
        "laptop": ["laptop", "notebook", "macbook", "chromebook"],
        "mobile": ["mobile", "phone", "smartphone", "cellphone", "iphone", "android"],
        "kurta": ["kurta", "kurta set", "ethnic wear"],
        "facewash": ["face wash", "cleanser", "facial wash"]
    }

    # Add the query itself
    terms = [query]
    if query in synonyms:
        terms += synonyms[query]

    # check if any term is present in text
    if not any(term in text for term in terms):
        return False

    # remove obvious noise
    banned = ["toy", "doll", "costume", "game", "figure", "disney", "marvel", "lol", "surprise"]
    if any(b in text for b in banned):
        return False

    return True


# -----------------------------
# VOICE COMMAND ENDPOINT
# -----------------------------
@app.route("/ai/voice-command", methods=["POST"])
def voice_command():
    global df

    data = request.get_json(silent=True) or {}
    user_text = data.get("text", "").strip()

    if not user_text:
        return jsonify({"error": "No text provided"}), 400

    lower_text = user_text.lower()

    # -----------------------------
    # 1️⃣ NAVIGATION HANDLER
    # -----------------------------
    navigation_keywords = {
        "home": ["home", "homepage", "main page"],
        "search": ["search", "find"],
        "compare": ["compare", "comparison"],
        "cart": ["cart", "shopping cart", "my cart"],
        "wishlist": ["wishlist", "my wishlist"],
        "deals": ["deals", "offers", "discounts"],
        "logout": ["logout", "sign out"]
    }

    for page, keywords in navigation_keywords.items():
        if any(k in lower_text for k in keywords):
            return jsonify({
                "action": "navigate",
                "page": page
            })

    # -----------------------------
    # 2️⃣ SEARCH HANDLER
    # -----------------------------
    if df is None or df.empty:
        return jsonify({"error": "Dataset not loaded"}), 500

    # -----------------------------
    # 3️⃣ AI → STRUCTURED JSON
    # -----------------------------
    prompt = f"""
    Convert this shopping voice command to valid JSON only.

    Fields:
    - action: search
    - query: product keyword
    - brand: brand if mentioned
    - price_min: number
    - price_max: number
    - rating: minimum rating
    - sort_by: relevance | price_asc | price_desc | rating_desc
    - page: page number

    User command: "{user_text}"
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content.strip()
        content = content[content.find("{"):content.rfind("}") + 1]
        ai_data = json.loads(content)

    except Exception as e:
        return jsonify({"error": "AI parsing failed", "details": str(e)}), 500

    # -----------------------------
    # 4️⃣ SAFE VALUES
    # -----------------------------
    def safe_float(v, default):
        try:
            return float(v)
        except:
            return default

    query = (ai_data.get("query") or "").strip()
    brand = (ai_data.get("brand") or "").strip()
    price_min = safe_float(ai_data.get("price_min"), 0)
    price_max = safe_float(ai_data.get("price_max"), 1e9)
    rating_min = safe_float(ai_data.get("rating"), 0)
    sort_by = ai_data.get("sort_by") or "relevance"
    page = int(ai_data.get("page") or 1)

    # -----------------------------
    # 5️⃣ AUTO BRAND DETECTION
    # -----------------------------
    if not brand and "brand" in df.columns:
        for b in df["brand"].dropna().unique():
            if isinstance(b, str) and b.lower() in lower_text:
                brand = b
                break

    # -----------------------------
    # 6️⃣ FILTER PRODUCTS
    # -----------------------------
    res = df.copy()

    # Remove obvious noise products
    res = res[~res["product_name"].str.lower().str.contains(r"costume|doll|toy|mask", na=False)]

    # Remove duplicates
    res = res.drop_duplicates(subset=["product_name", "brand"], keep="first")

    price_col = "effective_price" if "effective_price" in res.columns else "price"

    # Brand filter
    if brand:
        res = res[res["brand"].str.lower().str.contains(brand.lower(), na=False)]

    # Query / category-aware filter
    if query:
        res = res[res.apply(lambda row: matches_category(query, row), axis=1)]

    # Price filter
    res = res[(res[price_col] >= price_min) & (res[price_col] <= price_max)]

    # Rating filter
    if "rating" in res.columns:
        res = res[res["rating"] >= rating_min]

    # -----------------------------
    # 7️⃣ SORTING
    # -----------------------------
    if sort_by == "price_asc":
        res = res.sort_values(price_col, ascending=True)
    elif sort_by == "price_desc":
        res = res.sort_values(price_col, ascending=False)
    elif sort_by == "rating_desc" and "rating" in res.columns:
        res = res.sort_values("rating", ascending=False)
    elif "added_at" in res.columns:
        res = res.sort_values("added_at", ascending=False)

    # -----------------------------
    # 8️⃣ PAGINATION
    # -----------------------------
    page_size = 40
    start = (page - 1) * page_size
    end = start + page_size
    products = res.iloc[start:end].to_dict(orient="records")

    # -----------------------------
    # 9️⃣ FINAL RESPONSE
    # -----------------------------
    return jsonify(sanitize_json({
        "action": "search",
        "query": query,
        "brand": brand,
        "price_min": price_min,
        "price_max": price_max,
        "rating": rating_min,
        "sort_by": sort_by,
        "page": page,
        "total_results": len(res),
        "products": products
    }))





from rapidfuzz import fuzz
import pandas as pd
import numpy as np
import re
from flask import request, jsonify

@app.route("/api/search")
def search():
    global df
    if df is None or df.empty:
        return jsonify({"error": "Dataset not loaded."}), 400

    # -----------------------------
    # GET QUERY PARAMETERS
    # -----------------------------
    q = request.args.get("q", "").strip().lower()
    category = request.args.get("category")
    sort = request.args.get("sort")
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)
    min_rating = request.args.get("min_rating", type=float)
    brand_filter = request.args.get("brand", "").strip().lower()

    res = df.copy()

    # -----------------------------
    # CLEAN NUMERIC COLUMNS
    # -----------------------------
    def clean_number(x):
        try:
            if pd.isna(x):
                return None
            if isinstance(x, str):
                x = x.replace(",", "").replace("₹", "").strip()
                if x.endswith("%"):
                    return float(x.replace("%", "").strip())
            return float(x)
        except:
            return None

    for col in ["price", "final_price", "discount", "rating"]:
        if col in res.columns:
            res[col] = res[col].apply(clean_number)
    if "final_price" in res.columns and "price" in res.columns:
        res["final_price"] = res["final_price"].fillna(res["price"])
    res = res.replace({np.nan: None})

    # -----------------------------
    # TEXT NORMALIZATION
    # -----------------------------
    def normalize(text):
        if not isinstance(text, str):
            return ""
        text = text.lower()
        text = re.sub(r"[^\w\s]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def singularize(word):
        if word.endswith("s") and len(word) > 3:
            return word[:-1]
        return word

    # -----------------------------
    # CATEGORY FILTER (CLEARABLE)
    # -----------------------------
    if category and category.lower() not in ["", "all"]:
        if "product_category_clean" in res.columns:
            res = res[res["product_category_clean"].str.lower() == category.lower()]

    # -----------------------------
    # SEARCH + BLOCKLIST + FUZZY
    # -----------------------------
    if q:
        q_norm = normalize(q)
        q_singular = singularize(q_norm)
        synonyms = {
            "shoes": ["shoe", "footwear", "sneaker", "sandals", "loafers", "heels", "boots"],
            "laptop": ["notebook", "ultrabook"],
            "mobile": ["smartphone", "cellphone", "iphone"],
            "skincare": ["skin care", "beauty", "lotion", "facewash", "makeup"]
        }
        search_terms = set([q_norm, q_singular]) | set(synonyms.get(q_norm, [])) | set(synonyms.get(q_singular, []))

        blocklist = [
            "costume","toy","mask","decoration","hat","dress","wallet","lings",
            "keyring","funshades","helmet","keychain","costume sunglasses",
            "skirt","board games","woodland","bagpack","gloveset","batman cape",
            "legwarmers","bunnyjumper","childrn","t dhirt"
        ]
        blocklist = [normalize(b) for b in blocklist]

        def has_match(text):
            text = normalize(text)
            return any(t in text for t in search_terms)

        def not_blocklisted(text):
            text = normalize(text)
            return all(b not in text for b in blocklist)

        combined_text = res["product_name"].fillna("").str.lower() + " " + res.get("short_name", "").fillna("").str.lower()
        mask = combined_text.apply(lambda x: has_match(x) and not_blocklisted(x))
        filtered = res[mask]

        # Fuzzy fallback if nothing found
        if filtered.empty:
            def fuzzy_match(text):
                text = normalize(text)
                return any(fuzz.partial_ratio(term, text) > 80 for term in search_terms)
            mask = combined_text.apply(fuzzy_match)
            filtered = res[mask]

        res = filtered

    # -----------------------------
    # PRICE FILTER (CLEARABLE)
    # -----------------------------
    if min_price is not None:
        res = res[res["final_price"] >= min_price]
    if max_price is not None:
        res = res[res["final_price"] <= max_price]

    # -----------------------------
    # RATING FILTER (CLEARABLE)
    # -----------------------------
    if min_rating is not None and "rating" in res.columns:
        res = res[res["rating"] >= min_rating]

    # -----------------------------
    # BRAND FILTER (CLEARABLE)
    # -----------------------------
    if brand_filter and brand_filter not in ["", "all"]:
        if "brand" in res.columns:
            res = res[res["brand"].fillna("").str.lower().str.contains(brand_filter)]

    # -----------------------------
    # REAL-TIME FLAG
    # -----------------------------
    if "is_real_time" not in res.columns:
        res["is_real_time"] = False

    # -----------------------------
    # SPLIT REAL-TIME & OTHER PRODUCTS
    # -----------------------------
    real_time_products = res[res["is_real_time"] == True]
    other_products = res[res["is_real_time"] == False]

    # Real-time products first
    res = pd.concat([real_time_products, other_products]).drop_duplicates(subset=["product_name", "brand"], keep="first")

    # -----------------------------
    # CROSS-PLATFORM PRIORITY
    # -----------------------------
    def prioritize_cross_platform(res):
        res["product_name_norm"] = res["product_name"].apply(lambda x: str(x).strip().lower())
        cross_platform_counts = (
            res.groupby(["product_name_norm", "brand"])["platform"]
            .nunique()
            .reset_index()
            .rename(columns={"platform": "platform_count"})
        )
        res = res.merge(cross_platform_counts, on=["product_name_norm", "brand"], how="left")
        if "added_at" in res.columns:
            res["added_at"] = pd.to_datetime(res["added_at"], errors="coerce")
        else:
            res["added_at"] = pd.Timestamp.min
        # Sort: real-time first, then cross-platform count, then latest added
        res = res.sort_values(
            by=["is_real_time", "platform_count", "added_at"],
            ascending=[False, False, False]
        )
        res = res.drop_duplicates(subset=["product_name_norm", "brand"], keep="first")
        res = res.drop(columns=["product_name_norm", "platform_count"], errors="ignore")
        return res

    res = prioritize_cross_platform(res)

    # -----------------------------
    # OPTIONAL SORT
    # -----------------------------
    if sort == "price_asc":
        res = res.sort_values(by="final_price", ascending=True)
    elif sort == "price_desc":
        res = res.sort_values(by="final_price", ascending=False)
    elif sort == "rating_desc":
        res = res.sort_values(by="rating", ascending=False)

    # -----------------------------
    # FINAL OUTPUT
    # -----------------------------
    final_cols = [
        "product_name", "brand", "image", "short_name",
        "final_price", "price", "discount", "rating", "description",
        "product_category_clean", "added_at", "is_real_time"
    ]
    final_output = res[[c for c in final_cols if c in res.columns]].copy()
    final_output = final_output.replace({np.nan: None})

    return jsonify(final_output.to_dict(orient="records"))



BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARQUET_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "outputs", "products.parquet"))

# ---------------- Helpers ----------------
def normalize_text(s):
    """Lowercase, remove punctuation, extra spaces"""
    if pd.isna(s) or s is None:
        return ""
    s = str(s).lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

def parse_discount(d):
    """Convert discount like '46%' to float 46.0, handle NaN or invalid"""
    if pd.isna(d) or not d:
        return 0.0
    if isinstance(d, str):
        d = d.replace("%", "").strip()
    try:
        return float(d)
    except ValueError:
        return 0.0

# ---------------- Compare Endpoint ----------------
@app.route("/compare", methods=["GET"])
def compare_products():
    try:
        product_name = request.args.get("product_name", "").strip()
        brand = request.args.get("brand", "").strip()

        if not product_name or not brand:
            return jsonify({"error": "Both 'product_name' and 'brand' are required"}), 400

        if not os.path.exists(PARQUET_PATH):
            return jsonify({"error": f"Dataset not found at {PARQUET_PATH}"}), 500

        df = pd.read_parquet(PARQUET_PATH)

        # Normalize
        df["name_norm"] = df["product_name"].apply(normalize_text)
        df["brand_norm"] = df["brand"].apply(normalize_text)

        product_key = normalize_text(product_name)
        brand_key = normalize_text(brand)

        matched = df[(df["name_norm"] == product_key) & (df["brand_norm"] == brand_key)]

        if matched.empty:
            return jsonify({"error": "No matching product found across platforms"}), 404

        # Ensure numeric prices
        matched["price"] = pd.to_numeric(matched["price"], errors="coerce")
        matched["final_price"] = pd.to_numeric(matched["final_price"], errors="coerce")
        matched["effective_price"] = matched["final_price"].fillna(matched["price"])

        # Find cheapest
        cheapest_idx = matched["effective_price"].idxmin()
        cheapest = matched.loc[cheapest_idx]

        # Compute product average price across all platforms
        product_avg_price = matched["effective_price"].mean()

        output = {
            "product_name": matched.iloc[0]["product_name"],
            "brand": matched.iloc[0]["brand"],
            "cheapest_platform": cheapest["platform"],
            "cheapest_price": float(cheapest["effective_price"]),
            "platforms": []
        }

        for _, row in matched.iterrows():
            # AI-style Price Alert without category
            price_alert = ""
            if row["effective_price"] > product_avg_price * 1.2:
                price_alert = "💡 Expensive: 20% above average across platforms"
            elif row["effective_price"] < product_avg_price * 0.8:
                price_alert = "💡 Good Deal: Cheaper than average across platforms"

            output["platforms"].append({
                "platform": row["platform"],
                "price": float(row["price"]) if not pd.isna(row["price"]) else None,
                "final_price": float(row["final_price"]) if not pd.isna(row["final_price"]) else None,
                "effective_price": float(row["effective_price"]) if not pd.isna(row["effective_price"]) else None,
                "product_id": str(row.get("product_id", "")),
                "url": row.get("product_url", ""),
                "image": row.get("image", ""),
                "description": row.get("description", ""),
                "rating": float(row["rating"]) if not pd.isna(row.get("rating")) else None,
                "discount": parse_discount(row.get("discount")),
                "price_alert": price_alert
            })

        return jsonify({"results": output})

    except Exception as e:
        return jsonify({"error": str(e)}), 500




import numpy as np
from flask import jsonify

def to_float(x, default=0.0):
    try:
        if pd.isna(x):
            return default
        if isinstance(x, str):
            x = x.replace("%", "").replace(",", "").strip()
        return float(x)
    except:
        return default


@app.route("/top-deals")
def top_deals():
    global df

    if df is None or df.empty:
        return jsonify({"count": 0, "items": []})

    res = df.copy()

    # ---------------- Column normalization ----------------
    rename_map = {}
    for col in ["productName", "ProductName", "Product_Name", "name"]:
        if col in res.columns:
            rename_map[col] = "product_name"
    for col in ["Brand", "brand_name", "manufacturer"]:
        if col in res.columns:
            rename_map[col] = "brand"
    for col in ["CATEGORY", "main_category", "category"]:
        if col in res.columns:
            rename_map[col] = "category"
    res = res.rename(columns=rename_map)

    # ---------------- Ensure product_name & brand ----------------
    res["product_name"] = res.get("product_name", "").fillna("").apply(lambda x: str(x).strip() or "Unknown Product")
    res["brand"] = res.get("brand", "").fillna("").apply(lambda x: str(x).strip() or "Unknown Brand")

    # ---------------- Discount processing ----------------
    discount_col = "discount" if "discount" in res.columns else "discount_percent" if "discount_percent" in res.columns else None
    category_col = "category" if "category" in res.columns else None

    if not discount_col:
        return jsonify({"count": 0, "items": []})

    res[discount_col] = res[discount_col].apply(lambda x: to_float(x, 0))
    # Keep only 45–80% discounts for display
    filtered = res[(res[discount_col] >= 45) & (res[discount_col] <= 80)]
    if filtered.empty:
        # fallback top 10 by discount
        filtered = res.sort_values(by=discount_col, ascending=False).head(10)
    filtered[discount_col] = filtered[discount_col].apply(lambda x: int(round(x / 5) * 5))

    # ---------------- Shuffle and sort ----------------
    filtered = filtered.sample(frac=1)
    if "added_time" in filtered.columns:
        filtered = filtered.sort_values(by="added_time", ascending=False)

    # ---------------- Pick limited per category ----------------
    final_items = []
    if category_col:
        for _, group in filtered.groupby(category_col):
            final_items.extend(group.head(2).to_dict("records"))
    else:
        final_items = filtered.head(20).to_dict("records")

    # ---------------- Ensure product_name & brand exist for comparison ----------------
    for item in final_items:
        if not item.get("product_name"):
            item["product_name"] = "Unknown Product"
        if not item.get("brand"):
            item["brand"] = "Unknown Brand"

    # ---------------- Fields for frontend ----------------
    fields = ["product_id", "product_name", "brand", category_col, "platform", "price", "final_price",
              discount_col, "rating", "product_url", "image"]
    fields = [f for f in fields if f and f in filtered.columns]

    output = [{k: item.get(k, "") for k in fields} for item in final_items]

    return jsonify({
        "count": len(output),
        "items": output
    })


# Initialize DB
# ==============================
with app.app_context():
    db.create_all()

# ==============================
# Run App
# ==============================
if __name__ == "__main__":
    # Dataset already loaded at import, so no need to call load_df() again
    app.run(debug=True)


