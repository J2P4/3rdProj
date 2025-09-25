#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prepare 1,000 clean book rows from Amazon Reviews 2023 'Books' metadata.
Outputs: amazon_books_1000.csv with columns [제목, 발행년도, 작가, 출판사, 별점].
Env vars:
  - UCSD_META_PATH: path to meta_Books.jsonl.gz
  - MAX_ROWS: number of rows (default 1000)
  - OUTPUT_CSV: output filename
"""

import os, json, gzip, re, sys
import pandas as pd

INPUT_PATH = os.environ.get("UCSD_META_PATH", "meta_Books.jsonl.gz")
MAX_ROWS = int(os.environ.get("MAX_ROWS", "1000"))
OUTPUT_CSV = os.environ.get("OUTPUT_CSV", "amazon_books_1000.csv")

YEAR_RE = re.compile(r"(19|20)\d{2}")

def to_year(value):
    if not value:
        return None
    m = YEAR_RE.search(str(value))
    return int(m.group(0)) if m else None

def norm_author(obj):
    if isinstance(obj, str) and obj.strip():
        return obj.strip()
    if isinstance(obj, list) and obj:
        return ", ".join([str(x) for x in obj if x])
    if isinstance(obj, dict):
        name = obj.get("name") or obj.get("author") or obj.get("Name")
        if name:
            return str(name)
    return None

def safe_float(x):
    try:
        return float(x)
    except Exception:
        return None

def main():
    if not os.path.exists(INPUT_PATH):
        sys.stderr.write(f"[ERROR] File not found: {INPUT_PATH}\n")
        sys.exit(1)

    rows = []
    open_fn = gzip.open if INPUT_PATH.endswith(".gz") else open
    with open_fn(INPUT_PATH, "rt", encoding="utf-8") as f:
        for line in f:
            try:
                o = json.loads(line)
            except Exception:
                continue

            title = o.get("title") or o.get("Title")
            author = norm_author(o.get("author") or o.get("authors"))
            avg = safe_float(o.get("average_rating") or o.get("rating") or o.get("stars"))
            details = o.get("details") or {}
            publisher = (details.get("Publisher") or details.get("publisher") or
                         details.get("Imprint") or details.get("Label"))
            pubdate = (details.get("Publication date") or details.get("Publication Date") or
                       details.get("publication_date") or details.get("Release date") or
                       details.get("Released") or details.get("Date Published"))
            year = to_year(pubdate)

            if title and author and publisher and year and avg is not None:
                rows.append({
                    "제목": str(title).strip(),
                    "발행년도": int(year),
                    "작가": author,
                    "출판사": str(publisher).strip(),
                    "별점": round(max(0.0, min(5.0, avg)), 2)
                })
                if len(rows) >= MAX_ROWS:
                    break

    if not rows:
        sys.stderr.write("[WARN] No valid rows found with all required fields.\n")

    df = pd.DataFrame(rows, columns=["제목","발행년도","작가","출판사","별점"])
    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8-sig")
    print(f"[OK] Wrote {len(df)} rows to {OUTPUT_CSV}")

if __name__ == "__main__":
    main()
