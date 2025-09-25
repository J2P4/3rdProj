
# 온라인 서점(아마존) 데이터 2경로 준비 가이드

## 1) Amazon Reviews 2023 – Books 메타 (McAuley Lab)
- 다운로드(직접 링크는 공식 페이지의 *Books → meta* 참고):
  - 페이지: https://amazon-reviews-2023.github.io  (Books 항목의 **meta** 링크)
  - 파일명: `meta_Books.jsonl.gz`
- 전처리 실행:
  ```bash
  python3 prepare_ucsd_books_meta.py
  # 또는 환경변수로 경로/행수 지정
  UCSD_META_PATH=/path/to/meta_Books.jsonl.gz MAX_ROWS=1000 OUTPUT_CSV=amazon_books_1000.csv python3 prepare_ucsd_books_meta.py
  ```
- 결과: `amazon_books_1000.csv` (제목, 발행년도, 작가, 출판사, 별점)

## 2) Kaggle – Amazon Kindle Books 2023 (130K)
- 사전준비: Kaggle CLI 로그인(`~/.kaggle/kaggle.json`)
- 다운로드:
  ```bash
  kaggle datasets download -d asaniczka/amazon-kindle-books-dataset-2023-130k-books -p ./data
  unzip -o ./data/amazon-kindle-books-dataset-2023-130k-books.zip -d ./data
  ```
- 전처리 실행:
  ```bash
  python3 prepare_kaggle_kindle_2023.py
  # 또는
  KINDLE_CSV_PATH=./data/<다운로드된_파일명>.csv MAX_ROWS=1000 OUTPUT_CSV=kaggle_kindle_1000.csv python3 prepare_kaggle_kindle_2023.py
  ```
- 결과: `kaggle_kindle_1000.csv` (제목, 발행년도, 작가, 출판사, 별점)

### 공통 스키마
- CSV 헤더: `제목,발행년도,작가,출판사,별점`
- 별점 범위: 0–5 (소수 둘째자리 반올림)

> 팁: 두 CSV를 합쳐도 스키마가 같으니 곧바로 DB 적재/테스트에 사용할 수 있습니다.
