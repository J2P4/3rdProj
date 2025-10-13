# filename: test.py
# 기능:
# - 사용자 제공 "새 번호" 매핑 테이블과 item(=새 번호) 기준으로
#   train/test 각각을 inner join하여 두 개 CSV로 저장
# - Windows 절대경로 기본값을 제공 (C:\Users\tis03\*.csv)
# - 매우 큰 파일도 처리 가능하도록 chunksize(스트리밍) 지원

import argparse
import pandas as pd
from pathlib import Path

# 1) 매핑 테이블 (새 번호, 코드, 금액, 상태, 비고, 제목)
MAPPING_ROWS = [
    [1, "E2510080001",  50000, "완제품", "[포장완료]", "Chronicles of Narnia Box Set"],
    [2, "E2510080002",  24000, "완제품", "[포장완료]", "Just as I Am: A Memoir"],
    [3, "E2510080003",  70000, "완제품", "[포장완료]", "The Hobbit Lord of the Rings Boxed Set"],
    [4, "E2510080004",  30000, "완제품", "[포장완료]", "Pretty Girls"],
    [5, "E2510080005",  45000, "완제품", "[포장완료]", "Mere Christianity"],
    [6, "E2510080006",  70000, "완제품", "[포장완료]", "The Silmarillion"],
    [7, "E2510081001",  45000, "완제품", "[포장완료]", "Mere Christianity"],
    [8, "E2510081002", 300000, "완제품", "[포장완료]", "Pretty Girls"],
]
MAP_COLUMNS = ["item", "코드", "금액", "상태", "비고", "제목"]

def build_mapping_df():
    m = pd.DataFrame(MAPPING_ROWS, columns=MAP_COLUMNS)
    m["item"] = pd.to_numeric(m["item"], errors="coerce")
    return m

def join_one(input_path: Path, output_path: Path, mapping_df: pd.DataFrame, chunksize: int = 200_000):
    """
    input_path CSV를 mapping_df와 item 기준 inner join해서 output_path로 저장.
    메모리 절약을 위해 청크 단위로 처리.
    """
    # 기존 파일 있으면 삭제
    if output_path.exists():
        output_path.unlink()

    first_chunk = True

    for chunk in pd.read_csv(input_path, chunksize=chunksize):
        if "item" not in chunk.columns:
            raise ValueError(f"{input_path}에 'item' 컬럼이 없습니다.")
        # item 숫자화
        chunk["item"] = pd.to_numeric(chunk["item"], errors="coerce")

        merged = pd.merge(chunk, mapping_df, on="item", how="inner")

        if not merged.empty:
            merged.to_csv(
                output_path,
                index=False,
                mode="w" if first_chunk else "a",
                header=first_chunk,
                encoding="utf-8-sig",
            )
            first_chunk = False

    # 한 번도 쓰지 못했으면 헤더만 있는 빈 파일 생성
    if first_chunk:
        pd.DataFrame(columns=[]).to_csv(output_path, index=False, encoding="utf-8-sig")

def main():
    parser = argparse.ArgumentParser(description="Join train/test with mapping table on item and output two files.")
    # 1번 방법: 절대경로 기본값 제공
    parser.add_argument("--train", default=r"C:\Users\tis03\train.csv", help="Input train.csv path")
    parser.add_argument("--test",  default=r"C:\Users\tis03\test.csv",  help="Input test.csv path")
    parser.add_argument("--out-train", default=r"C:\Users\tis03\train_joined.csv", help="Output for joined train")
    parser.add_argument("--out-test",  default=r"C:\Users\tis03\test_joined.csv",  help="Output for joined test")
    parser.add_argument("--chunksize", type=int, default=200_000, help="CSV read chunksize")
    args = parser.parse_args()

    mapping_df = build_mapping_df()

    train_in  = Path(args.train)
    test_in   = Path(args.test)
    train_out = Path(args.out_train)
    test_out  = Path(args.out_test)

    # 입력 존재 체크
    if not train_in.exists():
        raise FileNotFoundError(f"train 파일을 찾을 수 없습니다: {train_in}")
    if not test_in.exists():
        raise FileNotFoundError(f"test 파일을 찾을 수 없습니다: {test_in}")

    join_one(train_in, train_out, mapping_df, chunksize=args.chunksize)
    join_one(test_in,  test_out,  mapping_df, chunksize=args.chunksize)

    print("[OK]")
    print(f"- train_joined: {train_out}")
    print(f"- test_joined : {test_out}")

if __name__ == "__main__":
    main()
