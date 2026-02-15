# backend/utils/sentiment_analyzer.py
import ast
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def _safe_parse_reviews_field(raw):
    """
    Try multiple ways to split/parse the reviews field:
      - JSON-like list: '["r1","r2"]'
      - Separator '||'
      - Newline separated
      - Comma separated as fallback (but only if that seems right)
    Returns list of stripped reviews (non-empty).
    """
    if raw is None:
        return []

    raw = str(raw).strip()

    # Try JSON / Python list literal
    if raw.startswith("[") and raw.endswith("]"):
        try:
            parsed = ast.literal_eval(raw)
            if isinstance(parsed, (list, tuple)):
                return [str(x).strip() for x in parsed if str(x).strip()]
        except Exception:
            pass

    # Common custom separator used earlier
    if "||" in raw:
        parts = [p.strip() for p in raw.split("||") if p.strip()]
        if parts:
            return parts

    # If reviews separated by newline characters
    if "\n" in raw:
        parts = [p.strip() for p in raw.splitlines() if p.strip()]
        if parts:
            return parts

    # If many reviews contain '."' or '" - ' patterns, try splitting by '","' (CSV-escaped)
    if '","' in raw:
        parts = [p.strip().strip('"') for p in raw.split('","') if p.strip()]
        if parts:
            return parts

    # Fallback: split by pipe | or semicolon ; if present
    for sep in ["|", ";"]:
        if sep in raw:
            parts = [p.strip() for p in raw.split(sep) if p.strip()]
            if parts:
                return parts

    # Final fallback: treat whole field as one review
    return [raw] if raw else []

def analyze_reviews_list(reviews_list):
    """
    Input: list of review strings
    Output: dict with positive/neutral/negative counts and percents
    """
    if not reviews_list:
        return {"positive": 0, "neutral": 0, "negative": 0, "total": 0}

    pos = neu = neg = 0
    for r in reviews_list:
        vs = analyzer.polarity_scores(r)
        score = vs.get("compound", 0.0)
        # VADER compound scale: >0.05 positive, < -0.05 negative, otherwise neutral
        if score > 0.05:
            pos += 1
        elif score < -0.05:
            neg += 1
        else:
            neu += 1

    total = pos + neu + neg or 1
    return {
        "positive": round((pos / total) * 100),
        "neutral": round((neu / total) * 100),
        "negative": round((neg / total) * 100),
        "total": total,
        "counts": {"positive": pos, "neutral": neu, "negative": neg}
    }

def analyze_field(raw_reviews_field):
    """
    Wrapper: takes the raw CSV cell content, returns percent dict.
    """
    reviews = _safe_parse_reviews_field(raw_reviews_field)
    return analyze_reviews_list(reviews)
