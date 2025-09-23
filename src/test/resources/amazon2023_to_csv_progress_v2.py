#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Amazon Reviews 2023 -> CSV (with progress + Nth-record logs)
Default category: Books

Usage examples:
  python amazon2023_to_csv_progress_v2.py
  python amazon2023_to_csv_progress_v2.py --category Books --outdir ./out --max-products 30000 --max-reviews 100000 --log-every 10000
  python amazon2023_to_csv_progress_v2.py --no-download --meta meta_Books.jsonl.gz --reviews Books.jsonl.gz --log-file convert.log

Requires: requests, tqdm
  pip install requests tqdm
"""
import os, io, sys, json, csv, gzip, argparse, pathlib, time, struct, datetime as dt
from typing import Optional
try:
    import requests
except ImportError:
    print("ERROR: 'requests'가 필요합니다.  pip install requests")
    sys.exit(1)
try:
    from tqdm import tqdm
except ImportError:
    print("ERROR: 'tqdm'가 필요합니다.  pip install tqdm")
    sys.exit(1)


BASE_META = "https://mcauleylab.ucsd.edu/public_datasets/data/amazon_2023/raw/meta_categories/meta_{cat}.jsonl.gz"
BASE_REVS = "https://mcauleylab.ucsd.edu/public_datasets/data/amazon_2023/raw/review_categories/{cat}.jsonl.gz"


def ensure_dir(p: str):
    pathlib.Path(p).mkdir(parents=True, exist_ok=True)


def write_log(msg: str, log_file: Optional[str] = None):
    ts = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    if log_file:
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(line + "\n")


def head_content_length(url: str) -> Optional[int]:
    try:
        r = requests.head(url, timeout=15, allow_redirects=True)
        if r.status_code >= 400:
            return None
        if 'Content-Length' in r.headers:
            return int(r.headers['Content-Length'])
    except Exception:
        return None
    return None


def download_with_progress(url: str, out_path: str, desc: str, log_file: Optional[str], log_every_bytes: int):
    ensure_dir(os.path.dirname(out_path) or ".")
    total = head_content_length(url)
    tmp_path = out_path + ".part"
    chunk = 1 << 20  # 1MB

    r = requests.get(url, stream=True)
    r.raise_for_status()

    downloaded = 0
    next_log = log_every_bytes

    with open(tmp_path, "wb") as f, tqdm(
        total=total, unit="B", unit_scale=True, desc=f"다운로드: {desc}", ascii=True
    ) as bar:
        for chunk_bytes in r.iter_content(chunk_size=chunk):
            if not chunk_bytes:  # keep-alive
                continue
            f.write(chunk_bytes)
            n = len(chunk_bytes)
            downloaded += n
            if total:
                bar.update(n)

            # N바이트 단위 로그: "지금까지 XMB 받는 중"
            if log_every_bytes and downloaded >= next_log:
                mb = downloaded / (1024*1024)
                write_log(f"{desc}: 지금까지 {mb:.1f}MB 다운로드 완료", log_file)
                next_log += log_every_bytes

    os.replace(tmp_path, out_path)


def gzip_uncompressed_size(path: str) -> Optional[int]:
    # ISIZE: last 4 bytes of .gz is uncompressed size modulo 2**32
    try:
        with open(path, "rb") as f:
            f.seek(-4, os.SEEK_END)
            raw = f.read(4)
            if len(raw) == 4:
                return struct.unpack("<I", raw)[0]
    except Exception:
        return None
    return None


def first_image_url(images):
    if not images:
        return ""
    x = images[0] if isinstance(images, list) else images
    for k in ("hi_res", "large", "thumb"):
        if isinstance(x, dict) and x.get(k):
            return x[k]
    return ""


def to_json_text(v):
    if v is None:
        return ""
    if isinstance(v, (list, dict)):
        return json.dumps(v, ensure_ascii=False)
    return str(v)


def parse_meta_to_csv(gz_path: str, out_csv: str, max_rows: Optional[int], log_every: Optional[int], log_file: Optional[str]):
    fields = [
        "parent_asin","title","price","average_rating","rating_number",
        "main_category","categories","image_url","description"
    ]
    total_unz = gzip_uncompressed_size(gz_path) or 0

    with gzip.open(gz_path, "rb") as gz, io.TextIOWrapper(gz, encoding="utf-8") as txt, \
         open(out_csv, "w", newline="", encoding="utf-8") as f_out, \
         tqdm(total=total_unz if total_unz > 0 else None, unit="B", unit_scale=True,
              desc="변환(meta→products)", ascii=True) as bar:
        w = csv.DictWriter(f_out, fieldnames=fields)
        w.writeheader()
        last_tell = 0
        rows = 0
        while True:
            line = txt.readline()
            if not line:
                break
            if not line.strip():
                continue
            obj = json.loads(line)
            row = {
                "parent_asin": obj.get("parent_asin",""),
                "title": obj.get("title",""),
                "price": obj.get("price",""),
                "average_rating": obj.get("average_rating",""),
                "rating_number": obj.get("rating_number",""),
                "main_category": obj.get("main_category",""),
                "categories": to_json_text(obj.get("categories", [])),
                "image_url": first_image_url(obj.get("images", [])),
                "description": to_json_text(obj.get("description", []))
            }
            w.writerow(row)
            rows += 1

            tell = gz.tell()
            bar.update(max(0, tell - last_tell))
            bar.set_postfix_str(f"rows={rows}")
            last_tell = tell

            if log_every and rows % log_every == 0:
                write_log(f"[메타] {rows}번째 레코드 처리 중…", log_file)

            if max_rows and rows >= max_rows:
                break

        write_log(f"[메타] 총 {rows}행 변환 완료 → {out_csv}", log_file)


def parse_reviews_to_csv(gz_path: str, out_csv: str, max_rows: Optional[int], log_every: Optional[int], log_file: Optional[str]):
    fields = ["user_id","parent_asin","asin","rating","title","text",
              "verified_purchase","helpful_vote","timestamp"]
    total_unz = gzip_uncompressed_size(gz_path) or 0

    with gzip.open(gz_path, "rb") as gz, io.TextIOWrapper(gz, encoding="utf-8") as txt, \
         open(out_csv, "w", newline="", encoding="utf-8") as f_out, \
         tqdm(total=total_unz if total_unz > 0 else None, unit="B", unit_scale=True,
              desc="변환(reviews)", ascii=True) as bar:
        w = csv.DictWriter(f_out, fieldnames=fields)
        w.writeheader()
        last_tell = 0
        rows = 0
        while True:
            line = txt.readline()
            if not line:
                break
            if not line.strip():
                continue
            obj = json.loads(line)
            row = {
                "user_id": obj.get("user_id",""),
                "parent_asin": obj.get("parent_asin",""),
                "asin": obj.get("asin",""),
                "rating": obj.get("rating",""),
                "title": obj.get("title",""),
                "text": obj.get("text",""),
                "verified_purchase": obj.get("verified_purchase",""),
                "helpful_vote": obj.get("helpful_vote",""),
                "timestamp": obj.get("timestamp",""),
            }
            w.writerow(row)
            rows += 1

            tell = gz.tell()
            bar.update(max(0, tell - last_tell))
            bar.set_postfix_str(f"rows={rows}")
            last_tell = tell

            if log_every and rows % log_every == 0:
                write_log(f"[리뷰] {rows}번째 레코드 처리 중…", log_file)

            if max_rows and rows >= max_rows:
                break

        write_log(f"[리뷰] 총 {rows}행 변환 완료 → {out_csv}", log_file)


def main():
    ap = argparse.ArgumentParser(description="Amazon Reviews 2023 -> CSV (with progress + Nth-record logs)")
    ap.add_argument("--category", default="Books", help="카테고리 이름 (기본: Books)")
    ap.add_argument("--outdir", default="./out", help="출력 폴더 (기본: ./out)")
    ap.add_argument("--max-products", type=int, default=None, help="상품 최대 행 수 제한")
    ap.add_argument("--max-reviews", type=int, default=None, help="리뷰 최대 행 수 제한")

    # NEW: 로그 관련 옵션
    ap.add_argument("--log-every", type=int, default=10000, help="N행마다 '몇번째 처리 중' 로그 출력 (기본: 10000, 0이면 끔)")
    ap.add_argument("--log-file", default=None, help="로그 파일 경로 (지정 시 파일에도 기록)")

    # 다운로드 스킵/로컬 경로
    ap.add_argument("--no-download", action="store_true", help="다운로드를 건너뜀 (로컬 파일 사용)")
    ap.add_argument("--meta", default=None, help="로컬 meta_{cat}.jsonl.gz 경로")
    ap.add_argument("--reviews", default=None, help="로컬 {cat}.jsonl.gz 경로")
    args = ap.parse_args()

    cat = args.category
    ensure_dir(args.outdir)

    # Resolve paths and URLs
    meta_url = BASE_META.format(cat=cat)
    revs_url = BASE_REVS.format(cat=cat)

    meta_gz = args.meta or os.path.join(args.outdir, f"meta_{cat}.jsonl.gz")
    revs_gz = args.reviews or os.path.join(args.outdir, f"{cat}.jsonl.gz")

    products_csv = os.path.join(args.outdir, "products.csv")
    reviews_csv  = os.path.join(args.outdir, "reviews.csv")

    # Download if needed
    if not args.no_download:
        # NEW: 다운로드 바이트 단위 주기 로그 (50MB마다)
        log_every_bytes = 50 * 1024 * 1024
        if not os.path.exists(meta_gz):
            download_with_progress(meta_url, meta_gz, f"meta_{cat}.jsonl.gz", args.log_file, log_every_bytes)
        else:
            write_log(f"[스킵] 이미 존재: {meta_gz}", args.log_file)
        if not os.path.exists(revs_gz):
            download_with_progress(revs_url, revs_gz, f"{cat}.jsonl.gz", args.log_file, log_every_bytes)
        else:
            write_log(f"[스킵] 이미 존재: {revs_gz}", args.log_file)
    else:
        if not (os.path.exists(meta_gz) and os.path.exists(revs_gz)):
            print("ERROR: --no-download 사용 시 --meta 및 --reviews 경로가 유효해야 합니다.")
            sys.exit(2)

    # Convert with progress + N번째 로그
    parse_meta_to_csv(meta_gz, products_csv, max_rows=args.max_products, log_every=args.log_every, log_file=args.log_file)
    parse_reviews_to_csv(revs_gz, reviews_csv, max_rows=args.max_reviews, log_every=args.log_every, log_file=args.log_file)

    write_log("✅ 전체 작업 완료", args.log_file)
    print(f" - products.csv: {products_csv}")
    print(f" - reviews.csv : {reviews_csv}")


if __name__ == "__main__":
    main()
