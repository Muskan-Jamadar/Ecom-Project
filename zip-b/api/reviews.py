# # backend/api/reviews.py
# from flask import Blueprint, jsonify
# import os
# import pandas as pd
# from pathlib import Path

# import sys
# import os

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# from utils.sentiment_analyzer import analyze_field

# bp = Blueprint("reviews", __name__, url_prefix="/api")

# DATA_DIR = Path(__file__).resolve().parents[1] / "data"  # backend/data

# @bp.route("/analyze-reviews", methods=["GET"])
# def analyze_reviews_csv():
#     """
#     Reads all CSV files in backend/data and returns a list of products with sentiment analysis.
#     For each product row we expect a column named 'product_name' (if present) and
#     a column named 'reviews_with_sentiments' (exact name required).
#     """
#     results = []

#     # find csv files in backend/data
#     csv_files = list(DATA_DIR.glob("*.csv"))
#     if not csv_files:
#         return jsonify({"error": f"No CSV files found in {DATA_DIR}", "data": []}), 404

#     for csv_path in csv_files:
#         try:
#             df = pd.read_csv(csv_path, dtype=str, keep_default_na=False, na_values=[""])
#         except Exception as e:
#             # if a CSV fails to load, skip it but include the error
#             results.append({
#                 "file": csv_path.name,
#                 "error_loading": str(e)
#             })
#             continue

#         # For each row, analyze reviews
#         rows = []
#         for _, row in df.iterrows():
#             raw_review_field = row.get("reviews_with_sentiments", "")
#             sentiment = analyze_field(raw_review_field)

#             product_name = row.get("product_name") or row.get("title") or row.get("name") or ""
#             rows.append({
#                 "product_name": product_name,
#                 "raw_reviews": raw_review_field,
#                 "sentimentAnalysis": sentiment,
#                 # include any other useful columns if you want (optional)
#             })

#         results.append({
#             "file": csv_path.name,
#             "count": len(rows),
#             "rows": rows
#         })

#     return jsonify(results)


# backend/api/reviews.py


# backend/api/reviews.py
from flask import Blueprint, Response
import os
import pandas as pd
from pathlib import Path
import sys
import math
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from utils.sentiment_analyzer import analyze_field

bp = Blueprint("reviews", __name__, url_prefix="/api")

DATA_DIR = Path(__file__).resolve().parents[1] / "data"  # backend/data


# ------------------ Helpers ------------------

def safe_number(x):
    """Convert value to int, replace None, NaN, Infinity with 0"""
    if x is None:
        return 0
    try:
        x_float = float(x)
        if math.isnan(x_float) or math.isinf(x_float):
            return 0
        return int(x_float)
    except:
        return 0


def sanitize(x):
    """Recursively replace any NaN/Infinity with 0"""
    if isinstance(x, dict):
        return {k: sanitize(v) for k, v in x.items()}
    elif isinstance(x, list):
        return [sanitize(i) for i in x]
    elif isinstance(x, float) and (math.isnan(x) or math.isinf(x)):
        return 0
    else:
        return x


def normalize_platform(p):
    """Ensure consistent platform naming"""
    if not p:
        return ""
    p = p.lower().strip()
    if "flipkart" in p:
        return "flipkart"
    if "amazon" in p:
        return "amazon"
    if "croma" in p:
        return "croma"
    if "reliance" in p:
        return "reliance"
    return p


# ------------------ Endpoint ------------------

@bp.route("/analyze-reviews", methods=["GET"])
def analyze_reviews_csv():
    results = []

    csv_files = list(DATA_DIR.glob("*.csv"))
    if not csv_files:
        return Response(
            json.dumps({"error": f"No CSV files found in {DATA_DIR}", "data": []}),
            mimetype="application/json"
        )

    for csv_path in csv_files:
        try:
            df = pd.read_csv(csv_path, dtype=str, keep_default_na=False, na_values=[""])
        except Exception as e:
            results.append({
                "file": csv_path.name,
                "error_loading": str(e)
            })
            continue

        rows = []

        for _, row in df.iterrows():
            raw_review_field = row.get("reviews_with_sentiments", "")
            raw_sentiment = analyze_field(raw_review_field) or {}

            product_name = (
                row.get("product_name")
                or row.get("title")
                or row.get("name")
                or ""
            ).strip()

            platform = normalize_platform(row.get("platform", ""))

            # ⛔ Skip invalid rows (prevents empty platform bug)
            if not product_name or not platform:
                continue

            rows.append({
                "product_name": product_name,
                "platform": platform,
                "raw_reviews": raw_review_field,
                "sentimentAnalysis": {
                    "positive": safe_number(raw_sentiment.get("positive")),
                    "neutral": safe_number(raw_sentiment.get("neutral")),
                    "negative": safe_number(raw_sentiment.get("negative")),
                }
            })

        results.append({
            "file": csv_path.name,
            "count": len(rows),
            "rows": rows
        })

    json_data = json.dumps(sanitize(results))
    return Response(json_data, mimetype="application/json")

# from flask import Blueprint, Response, request
# import os
# import pandas as pd
# from pathlib import Path
# import sys
# import math
# import json
# import openai  # Make sure openai>=2.x is installed

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
# from utils.sentiment_analyzer import analyze_field  # keep if you still want basic sentiment counts

# bp = Blueprint("reviews", __name__, url_prefix="/api")

# DATA_DIR = Path(__file__).resolve().parents[1] / "data"  # backend/data

# # Set your OpenAI API key from environment
# openai.api_key = os.environ.get("OPENAI_API_KEY", "")

# def safe_number(x):
#     """Convert value to int, replace None, NaN, Infinity with 0"""
#     if x is None:
#         return 0
#     try:
#         x_float = float(x)
#         if math.isnan(x_float) or math.isinf(x_float):
#             return 0
#         return int(x_float)
#     except:
#         return 0

# def sanitize(x):
#     """Recursively replace any NaN/Infinity with 0"""
#     if isinstance(x, dict):
#         return {k: sanitize(v) for k, v in x.items()}
#     elif isinstance(x, list):
#         return [sanitize(i) for i in x]
#     elif isinstance(x, float) and (math.isnan(x) or math.isinf(x)):
#         return 0
#     else:
#         return x

# def generate_ai_summary_from_reviews(product_name, raw_reviews):
#     """
#     Generate AI summary directly from 'reviews_with_sentiments' field.
#     """
#     try:
#         if not raw_reviews.strip():
#             return "No reviews available to generate AI summary."

#         # Prompt for AI
#         prompt = f"""
#         You are an expert product reviewer.
#         Generate a concise, user-friendly summary for the product "{product_name}".
#         Base your summary directly on the following reviews:
#         {raw_reviews}

#         Include key positives, negatives, and recommendations for potential buyers.
#         """

#         # Call OpenAI API (v2.x)
#         response = openai.chat.completions.create(
#             model="gpt-3.5-turbo",  # use gpt-4 if you have access
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.7,
#             max_tokens=250
#         )

#         return response.choices[0].message.content

#     except Exception as e:
#         return f"AI summary failed: {str(e)}"

# @bp.route("/analyze-reviews", methods=["GET"])
# def analyze_reviews_csv():
#     """
#     Reads all CSV files in backend/data and returns a list of products with sentiment analysis.
#     Uses 'reviews_with_sentiments' column for AI summary.
#     """
#     product_name_filter = request.args.get("product_name", "").lower()
#     results = []

#     csv_files = list(DATA_DIR.glob("*.csv"))
#     if not csv_files:
#         return Response(json.dumps({"error": f"No CSV files found in {DATA_DIR}", "data": []}),
#                         mimetype='application/json')

#     for csv_path in csv_files:
#         try:
#             df = pd.read_csv(csv_path, dtype=str, keep_default_na=False, na_values=[""])
#         except Exception as e:
#             results.append({
#                 "file": csv_path.name,
#                 "error_loading": str(e)
#             })
#             continue

#         rows = []
#         for _, row in df.iterrows():
#             product_name = row.get("product_name") or row.get("title") or row.get("name") or ""
#             if product_name_filter and product_name_filter not in product_name.lower():
#                 continue

#             raw_review_field = row.get("reviews_with_sentiments", "")
#             raw_sentiment = analyze_field(raw_review_field) or {}

#             positive = safe_number(raw_sentiment.get("positive"))
#             neutral = safe_number(raw_sentiment.get("neutral"))
#             negative = safe_number(raw_sentiment.get("negative"))

#             rows.append({
#                 "product_name": product_name,
#                 "platform": row.get("platform", ""),
#                 "raw_reviews": raw_review_field,
#                 "sentimentAnalysis": {
#                     "positive": positive,
#                     "neutral": neutral,
#                     "negative": negative
#                 }
#             })

#         if rows:
#             # Generate AI summary directly from raw reviews
#             ai_summary = generate_ai_summary_from_reviews(
#                 rows[0]["product_name"],
#                 rows[0]["raw_reviews"]
#             )

#             results.append({
#                 "file": csv_path.name,
#                 "count": len(rows),
#                 "rows": rows,
#                 "ai_summary": ai_summary
#             })

#     return Response(json.dumps(sanitize(results)), mimetype='application/json')
