#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prepare 1,000 clean rows from 'Amazon Kindle Books Dataset 2023 (130K Books)'.
Outputs: kaggle_kindle_1000.csv with columns [제목, 발행년도, 작가, 출판사, 별점].
"""

import os, re, sys, glob
import pandas as pd

INPUT_PATH = os.environ.get("KINDLE_CSV_PATH")  # optional; auto-detect if not set
MAX_ROWS = int(os.environ.get("MAX_ROWS", "1000"))
OUTPUT_CSV = os.environ.get("OUTPUT_CSV", "kaggle_kindle_1000.csv")

YEAR_RE = re.compile(r"(19|20)\d{2}")

CANDIDATE_COLS = {
    "title": ["title","Title","book_title","Book Title","Book_Title"],
    "author": ["author","Author","authors","Authors","book_author","Writer"],
    "publisher": ["Publisher","publisher","Imprint","label","Label"],
    "rating": ["Stars","Average rating","average_rating","rating","Rating","star_rating","stars"],
    "pubdate": ["Publication date","publication_date","Release Date","Released","Published","Date Published","publicationDate"]
}

def find_col(cols, candidates):
    lower = {c.lower(): c for c in cols}
    for cand in candidates:
        if cand.lower() in lower:
            return lower[cand.lower()]
    return None

def to_year(value):
    if pd.isna(value):
        return None
    m = YEAR_RE.search(str(value))
    return int(m.group(0)) if m else None

def clamp_rating(x):
    try:
        v = float(x)
    except Exception:
        return None
    if v > 5 and v <= 10:
        v = v / 2.0
    elif v > 10 and v <= 100:
        v = v / 20.0  # coarse scale to 5
    return round(max(0.0, min(5.0, v)), 2)

def autodetect_csv():
    if INPUT_PATH and os.path.exists(INPUT_PATH):
        return INPUT_PATH
    candidates = []
    for pattern in ("*.csv", "data/*.csv", "*/*.csv"):
        candidates.extend(glob.glob(pattern))
    if not candidates:
        sys.stderr.write("[ERROR] No CSV file found. Set KINDLE_CSV_PATH or place CSV in current directory.\n")
        sys.exit(1)
    candidates.sort(key=lambda p: os.path.getsize(p), reverse=True)
    return candidates[0]

def read_csv_any(path):
    # Try UTF-8 first; fallback to cp949 for some Windows CSVs
    try:
        return pd.read_csv(path, low_memory=False, encoding="utf-8")
    except UnicodeDecodeError:
        return pd.read_csv(path, low_memory=False, encoding="cp949")

def main():
    path = autodetect_csv()
    df = read_csv_any(path)
    cols = list(df.columns)

    c_title = find_col(cols, CANDIDATE_COLS["title"])
    c_author = find_col(cols, CANDIDATE_COLS["author"])
    c_publisher = find_col(cols, CANDIDATE_COLS["publisher"])
    c_rating = find_col(cols, CANDIDATE_COLS["rating"])
    c_pubdate = find_col(cols, CANDIDATE_COLS["pubdate"])

    out = pd.DataFrame()
    out["제목"] = df[c_title] if c_title in df else None
    out["작가"] = df[c_author] if c_author in df else None
    out["출판사"] = df[c_publisher] if c_publisher in df else None
    out["발행년도"] = df[c_pubdate].apply(to_year) if c_pubdate in df else None
    out["별점"] = df[c_rating].apply(clamp_rating) if c_rating in df else None

    out = out.dropna(subset=["제목","작가","출판사","발행년도","별점"])
    out = out.head(MAX_ROWS)
    out.to_csv(OUTPUT_CSV, index=False, encoding="utf-8-sig")
    print(f"[OK] Wrote {len(out)} rows to {OUTPUT_CSV} from {os.path.basename(path)}")

if __name__ == "__main__":
    main()
