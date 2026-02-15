import os
import pandas as pd

# -----------------------------
# Paths
# -----------------------------
DATA_DIR = "../data"
OUTPUT_DIR = "../outputs"

PARQUET_OUT = os.path.join(OUTPUT_DIR, "products.parquet")
JSON_OUT = os.path.join(OUTPUT_DIR, "products.json")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# -----------------------------
# Helper functions
# -----------------------------
def load_and_clean_csv(file_path, platform_name):
    try:
        df = pd.read_csv(file_path, encoding='utf-8-sig')
    except UnicodeDecodeError:
        df = pd.read_csv(file_path, encoding='latin1')
    except Exception as e:
        print(f"❌ Error reading {file_path}: {e}")
        return None

    # Normalize column names
    df.columns = [c.strip().lower() for c in df.columns]

    rename_map = {
        "productname": "product_name",
        "product title": "product_name",
        "product": "product_name",
        "brandname": "brand",
        "mrp": "price",
        "sellingprice": "price",
        "sale_price": "price",
        "currentprice": "price",
        "productid": "product_id",
        "id": "product_id",
        "uniq id": "uniq_id",
        "unique id": "unique_id",
        "category": "product_category"
    }
    df.rename(columns=rename_map, inplace=True)

    # Normalize IDs → string
    for col in ["unique_id", "uniq_id", "product_id"]:
        if col in df.columns:
            df[col] = df[col].astype(str)

    # Required columns
    for col in ["product_name", "brand", "price"]:
        if col not in df.columns:
            print(f"⚠ Missing required column '{col}' in {file_path}")
            return None

    df["platform"] = platform_name

    # Clean price
    def clean_price(val):
        if pd.isna(val):
            return None
        val = str(val).replace("₹", "").replace(",", "").strip()
        try:
            return float(val)
        except:
            return None
    df["price"] = df["price"].apply(clean_price)

    if df["price"].isna().all():
        print(f"⚠ All prices invalid in {file_path}")
        return None

    return df


# -----------------------------
# Main dataset builder
# -----------------------------
def build_dataset():
    all_data = []
    print("🔍 Loading CSVs from:", DATA_DIR)

    for file in os.listdir(DATA_DIR):
        if file.endswith(".csv"):
            platform = file.replace(".csv", "")
            file_path = os.path.join(DATA_DIR, file)
            print(f"📂 Processing {file} (Platform: {platform})")

            df = load_and_clean_csv(file_path, platform)
            if df is not None:
                all_data.append(df)

    if not all_data:
        print("❌ No valid CSV files found!")
        return

    final_df = pd.concat(all_data, ignore_index=True)

    # Drop rows missing essential data
    final_df.dropna(subset=["product_name", "brand", "price"], inplace=True)

    # Normalize for matching
    final_df["product_name"] = final_df["product_name"].str.strip().str.lower()
    final_df["brand"] = final_df["brand"].str.strip().str.lower()

    # product_category_clean
    if "product_category" in final_df.columns:
        final_df["product_category_clean"] = final_df["product_category"].str.strip().str.lower()
    else:
        final_df["product_category_clean"] = "unknown"

    # Remove reviews columns if present
    if "reviews" in final_df.columns:
        final_df.drop(columns=["reviews"], inplace=True)
    if "reviews_list" in final_df.columns:
        final_df.drop(columns=["reviews_list"], inplace=True)
    if "positive_pct" in final_df.columns:
        final_df.drop(columns=["positive_pct", "neutral_pct", "negative_pct"], inplace=True)

    print("📊 Final dataset size:", len(final_df))

    # -----------------------------
    # Save outputs
    # -----------------------------
    print(f"💾 Saving Parquet → {PARQUET_OUT}")
    final_df.to_parquet(PARQUET_OUT, index=False)

    print(f"💾 Saving JSON → {JSON_OUT}")
    final_df.to_json(JSON_OUT, orient="records", indent=2)

    print("✅ Dataset build complete!")


# -----------------------------
# Run script
# -----------------------------
if __name__ == "__main__":
    build_dataset()
