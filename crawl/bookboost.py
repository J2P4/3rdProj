# filename: bookboost_lastmonth_tune.py
# 목적
# - "최근 한달(window_days=30)" 데이터만 사용해 "다음날" 판매량을 예측
# - 하이퍼파라미터 그리드(반복문)로 평가 → 최적 조합 선택
# - 최적 조합으로 테스트 구간을 하루씩 순차 예측(매 스텝 직전 30일로 재학습)
# - result.csv 저장: id, date, actual, pred, pred_lo, pred_hi
#
# 실행 예
# python bookboost_lastmonth_tune.py ^
#   --train "C:\Users\tis03\train_joined.csv" ^
#   --test  "C:\Users\tis03\test_joined.csv" ^
#   --out   "C:\Users\tis03\result.csv" ^
#   --metric mae ^
#   --grid-n-estimators "300,500" ^
#   --grid-lr "0.03,0.05" ^
#   --grid-max-depth "2,3" ^
#   --grid-min-leaf "20,40" ^
#   --window-days 30 ^
#   --cv-splits 3 ^
#   --val-size 21 ^
#   --log-level INFO

import argparse
import json
import logging
import sys
from pathlib import Path
from datetime import timedelta
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

# ---------------- logging ----------------
def setup_logger(level=logging.INFO):
    fmt = "[%(asctime)s] %(levelname)s: %(message)s"
    datefmt = "%Y-%m-%d %H:%M:%S"
    logging.basicConfig(level=level, format=fmt, datefmt=datefmt, handlers=[logging.StreamHandler(sys.stdout)])

# ---------------- utils / features ----------------
CAL_FEATS = ["dow","dom","week","month","is_month_start","is_month_end"]
LAGS      = (1,2,3,7,14,28)    # 한달 창에 적합한 범위
ROLLS     = (7,14,28)

def ensure_columns(df, required, name):
    lower = {c.lower(): c for c in df.columns}
    out = {}
    for need in required:
        if need in df.columns:
            out[need] = need
        elif need.lower() in lower:
            out[need] = lower[need.lower()]
        else:
            raise ValueError(f"{name}: '{need}' 컬럼 없음. 현재: {list(df.columns)}")
    return out

def add_calendar(df):
    s = df["date"]
    df["dow"] = s.dt.weekday
    df["dom"] = s.dt.day
    df["week"] = s.dt.isocalendar().week.astype(int)
    df["month"] = s.dt.month
    df["is_month_start"] = s.dt.is_month_start.astype(int)
    df["is_month_end"]   = s.dt.is_month_end.astype(int)
    return df

def build_lag_roll(df):
    for k in LAGS:
        df[f"sales_lag_{k}"] = df["sales"].shift(k)
    for w in ROLLS:
        df[f"sales_rollmean_{w}"] = df["sales"].shift(1).rolling(w).mean()
        df[f"sales_rollstd_{w}"]  = df["sales"].shift(1).rolling(w).std()
        df[f"sales_rollsum_{w}"]  = df["sales"].shift(1).rolling(w).sum()
    return df

def select_features(cols):
    feats = []
    for c in cols:
        if (c in CAL_FEATS) or c.startswith("sales_lag_") or c.startswith("sales_roll"):
            feats.append(c)
    return feats

def safe_float_df(df):
    return df.replace([np.inf,-np.inf], np.nan).astype(float)

def mape(y_true, y_pred):
    y_true = np.asarray(y_true); y_pred = np.asarray(y_pred)
    denom = np.where(y_true==0, 1e-9, np.abs(y_true))
    return float(np.mean(np.abs((y_true-y_pred)/denom))*100.0)

def score_metric(y_true, y_pred, metric):
    if metric == "mae":
        return float(mean_absolute_error(y_true, y_pred))
    if metric == "rmse":
        return float(np.sqrt(mean_squared_error(y_true, y_pred)))
    if metric == "mape":
        return float(mape(y_true, y_pred))
    raise ValueError(f"metric must be one of ['mae','rmse','mape']")

def fit_gb_models(X_tr, y_tr, n_estimators=500, lr=0.05, max_depth=3, min_samples_leaf=20):
    # 중앙(허버) + 분위(0.10/0.90)
    gb_med = GradientBoostingRegressor(
        loss="huber", n_estimators=n_estimators, learning_rate=lr,
        max_depth=max_depth, min_samples_leaf=min_samples_leaf, random_state=42
    )
    gb_lo = GradientBoostingRegressor(
        loss="quantile", alpha=0.10, n_estimators=n_estimators, learning_rate=lr,
        max_depth=max_depth, min_samples_leaf=min_samples_leaf, random_state=42
    )
    gb_hi = GradientBoostingRegressor(
        loss="quantile", alpha=0.90, n_estimators=n_estimators, learning_rate=lr,
        max_depth=max_depth, min_samples_leaf=min_samples_leaf, random_state=42
    )
    gb_med.fit(X_tr, y_tr)
    gb_lo.fit(X_tr, y_tr)
    gb_hi.fit(X_tr, y_tr)
    return gb_med, gb_lo, gb_hi

# ---------------- time-based CV for last-month method ----------------
def rolling_validation_dates(dates, cv_splits=3, val_size=21, min_train=60):
    """
    dates: 정렬된 datetime 배열
    각 split의 검증 기간은 끝에서부터 균등히 분할한 구간의 '마지막 val_size일'.
    train은 검증 시작일 이전의 모든 과거(최소 min_train 보장).
    """
    n = len(dates)
    if n < (min_train + val_size + cv_splits - 1):
        # 너무 짧으면 1 split
        start_idx = max(0, n - val_size)
        if start_idx >= min_train:
            yield dates[:start_idx], dates[start_idx:]
        return
    # 균등한 컷포인트
    ends = np.linspace(min_train + val_size, n, num=cv_splits+1, dtype=int)[1:]
    for end in ends:
        val_end = end
        val_start = val_end - val_size
        if val_start < min_train:
            continue
        yield dates[:val_start], dates[val_start:val_end]

def eval_params_once_for_item_lastmonth(tr_full, params, window_days, metric, cv_splits, val_size):
    """
    tr_full: 단일 item의 (date, sales) 오름차순 DataFrame
    window_days: 각 예측 시점에서 직전 window_days만 학습
    평가: 검증 날짜들 각각에 대해 '바로 전날까지'의 window로 모델 학습 → 검증일 판매 예측
    """
    dates = tr_full["date"].values
    scores, weights = [], []
    n_usable = 0

    for train_dates, valid_dates in rolling_validation_dates(dates, cv_splits=cv_splits, val_size=val_size, min_train=window_days):
        # valid segment 내 날짜마다 next-day 예측(= 그 날짜의 실제를 바로 예측)
        y_true, y_pred = [], []
        for d in valid_dates:
            d = pd.Timestamp(d)
            start = d - timedelta(days=int(window_days))
            win = tr_full[(tr_full["date"] >= start) & (tr_full["date"] < d)].copy().sort_values("date")
            if win.shape[0] < max(28, int(0.6*window_days)):  # 최소 보장
                continue
            # 피처 생성 (훈련)
            win_feat = add_calendar(win.copy())
            win_feat = build_lag_roll(win_feat)
            feat_cols = select_features(win_feat.columns)
            tr_ready = win_feat.dropna(subset=[c for c in feat_cols if ("lag_" in c or "roll" in c)]).copy()
            if tr_ready.empty:
                continue

            X_tr = safe_float_df(tr_ready[feat_cols]).values
            y_tr = tr_ready["sales"].astype(float).values
            gb_med = GradientBoostingRegressor(
                loss="huber",
                n_estimators=params["n_estimators"],
                learning_rate=params["learning_rate"],
                max_depth=params["max_depth"],
                min_samples_leaf=params["min_samples_leaf"],
                random_state=42
            )
            gb_med.fit(X_tr, y_tr)

            # d일 예측용 한 행 만들기: (win + d 빈행)
            probe = pd.concat([win.copy(), pd.DataFrame({"date":[d], "sales":[np.nan]})], ignore_index=True)
            probe = add_calendar(probe)
            probe = build_lag_roll(probe)
            row = probe.iloc[-1:].copy()
            use_feats = [c for c in feat_cols if c in row.columns]
            X_today = safe_float_df(row[use_feats]).fillna(0.0).values

            y_hat = float(gb_med.predict(X_today)[0])
            y_true.append(float(tr_full.loc[tr_full["date"]==d, "sales"].values[0]))
            y_pred.append(y_hat)

        if y_true:
            s = score_metric(np.array(y_true), np.array(y_pred), metric)
            scores.append(s); weights.append(len(y_true))
            n_usable += len(y_true)

    if not scores:
        return np.inf, 0
    return float(np.average(scores, weights=weights)), int(n_usable)

def eval_grid_over_all_items_lastmonth(train_df, grid, window_days, metric, cv_splits, val_size):
    items = sorted(train_df["item"].dropna().unique().tolist())
    best_score, best_params = np.inf, None
    results = []

    combos = []
    for ne in grid["n_estimators"]:
        for lr in grid["learning_rate"]:
            for md in grid["max_depth"]:
                for leaf in grid["min_samples_leaf"]:
                    combos.append({"n_estimators":ne,"learning_rate":lr,"max_depth":md,"min_samples_leaf":leaf})

    logging.info(f"총 조합: {len(combos)} | items={len(items)} | cv_splits={cv_splits} | val_size={val_size} | window_days={window_days}")

    for i, params in enumerate(combos, 1):
        logging.info(f"[{i}/{len(combos)}] 평가: {params}")
        per_item_scores, per_item_weights = [], []
        for it in items:
            tr_full = train_df[train_df["item"]==it][["date","sales"]].copy().sort_values("date")
            if tr_full.empty:
                continue
            s, w = eval_params_once_for_item_lastmonth(tr_full, params, window_days, metric, cv_splits, val_size)
            if np.isfinite(s) and w>0:
                per_item_scores.append(s); per_item_weights.append(w)
        if per_item_scores:
            overall = float(np.average(per_item_scores, weights=per_item_weights))
            n_valid = int(np.sum(per_item_weights))
        else:
            overall, n_valid = np.inf, 0
        logging.info(f"→ {metric.upper()}={overall:.6f} (validation_points={n_valid})")
        results.append({**params, "metric":metric, "score":overall, "n_valid":n_valid})
        if overall < best_score:
            best_score, best_params = overall, params

    return best_score, best_params, pd.DataFrame(results)

# ---------------- final forecasting (sequential, test dates) ----------------
def forecast_lastmonth_with_best(train_df, test_df, params, window_days, out_csv):
    items = sorted(train_df["item"].dropna().unique().tolist())
    rows = []

    for idx, it in enumerate(items, 1):
        logging.info(f"[BEST] [{idx}/{len(items)}] item={it}")
        tr_full = train_df[train_df["item"]==it][["date","sales"]].copy().sort_values("date")
        te      = test_df [test_df ["item"]==it][["date","sales"] if "sales" in test_df.columns else ["date"]].copy().sort_values("date")
        if tr_full.empty or te.empty:
            logging.info(f"item={it}: train/test 없음 → skip"); continue

        cur_hist = tr_full.copy()
        for d in te["date"].values:
            d = pd.Timestamp(d)
            start = d - timedelta(days=int(window_days))
            win = cur_hist[(cur_hist["date"] >= start) & (cur_hist["date"] < d)].copy().sort_values("date")
            if win.shape[0] < max(28, int(0.6*window_days)):
                fallback = win["sales"].tail(7).mean() if win.shape[0] > 0 else 0.0
                y_hat = float(0.0 if np.isnan(fallback) else fallback)
                y_lo, y_hi = max(0.0, y_hat*0.8), y_hat*1.2
            else:
                win_feat = add_calendar(win.copy()); win_feat = build_lag_roll(win_feat)
                feat_cols = select_features(win_feat.columns)
                tr_ready = win_feat.dropna(subset=[c for c in feat_cols if ("lag_" in c or "roll" in c)])
                if tr_ready.empty:
                    fallback = win["sales"].tail(7).mean()
                    y_hat = float(0.0 if np.isnan(fallback) else fallback)
                    y_lo, y_hi = max(0.0, y_hat*0.8), y_hat*1.2
                else:
                    X_tr = safe_float_df(tr_ready[feat_cols]).values
                    y_tr = tr_ready["sales"].astype(float).values
                    gb_med, gb_lo, gb_hi = fit_gb_models(
                        X_tr, y_tr,
                        n_estimators=params["n_estimators"],
                        lr=params["learning_rate"],
                        max_depth=params["max_depth"],
                        min_samples_leaf=params["min_samples_leaf"]
                    )
                    probe = pd.concat([win.copy(), pd.DataFrame({"date":[d], "sales":[np.nan]})], ignore_index=True)
                    probe = add_calendar(probe); probe = build_lag_roll(probe)
                    row = probe.iloc[-1:].copy()
                    use_feats = [c for c in feat_cols if c in row.columns]
                    X_today = safe_float_df(row[use_feats]).fillna(0.0).values
                    y_hat = float(gb_med.predict(X_today)[0])
                    y_lo  = float(gb_lo.predict(X_today)[0])
                    y_hi  = float(gb_hi.predict(X_today)[0])

            rows.append({
                "id": it, "date": d,
                "pred": y_hat, "pred_lo": min(y_lo, y_hi), "pred_hi": max(y_lo, y_hi)
            })
            # 예측을 시계열에 반영(다음날 라그/롤링 계산용)
            cur_hist.loc[len(cur_hist)] = {"date": d, "sales": y_hat}

    pred_df = pd.DataFrame(rows).sort_values(["id","date"])

    # actual join (train + test.sales 있으면 포함)
    actual_df = train_df[["item","date","sales"]].rename(columns={"item":"id"}).copy()
    if "sales" in test_df.columns:
        actual_df = pd.concat([actual_df, test_df[["item","date","sales"]].rename(columns={"item":"id"})], ignore_index=True)

    result = pred_df.merge(actual_df, on=["id","date"], how="left").rename(columns={"sales":"actual"})
    outp = Path(out_csv); outp.parent.mkdir(parents=True, exist_ok=True)
    result.to_csv(outp, index=False, encoding="utf-8-sig")
    logging.info(f"[SAVED] 결과: {outp.resolve()} (rows={len(result)})")
    return result

# ---------------- main ----------------
if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Last-month window next-day forecast - hyperparameter loop, best to result.csv")
    ap.add_argument("--train", default=r"C:\Users\tis03\train_joined.csv")
    ap.add_argument("--test",  default=r"C:\Users\tis03\test_joined.csv")
    ap.add_argument("--out",   default=r"C:\Users\tis03\result.csv")
    ap.add_argument("--metric", default="mae", choices=["mae","rmse","mape"])
    ap.add_argument("--window-days", type=int, default=14)
    ap.add_argument("--cv-splits", type=int, default=3, help="시간기반 검증 분할 수")
    ap.add_argument("--val-size", type=int, default=21, help="각 split 검증 길이(일)")
    # grid
    ap.add_argument("--grid-n-estimators", default="300,400,500")
    ap.add_argument("--grid-lr",           default="0.03,0.04,0.05")
    ap.add_argument("--grid-max-depth",    default="2,3,4")
    ap.add_argument("--grid-min-leaf",     default="20,30,40")
    ap.add_argument("--log-level", default="INFO", choices=["DEBUG","INFO","WARNING","ERROR","CRITICAL"])
    args = ap.parse_args()

    setup_logger(getattr(logging, args.log_level))

    # load data
    train = pd.read_csv(args.train)
    test  = pd.read_csv(args.test)
    train = train.rename(columns=ensure_columns(train, ["item","date","sales"], "train"))
    test  = test.rename(columns=ensure_columns(test,  ["item","date"], "test"))
    train["date"] = pd.to_datetime(train["date"], errors="coerce")
    test["date"]  = pd.to_datetime(test["date"],  errors="coerce")

    grid = {
        "n_estimators":   [int(x) for x in args.grid_n_estimators.split(",")],
        "learning_rate":  [float(x) for x in args.grid_lr.split(",")],
        "max_depth":      [int(x) for x in args.grid_max_depth.split(",")],
        "min_samples_leaf":[int(x) for x in args.grid_min_leaf.split(",")]
    }

    # grid search (시간기반 last-month 평가)
    best_score, best_params, df_results = eval_grid_over_all_items_lastmonth(
        train_df=train,
        grid=grid,
        window_days=args.window_days,
        metric=args.metric,
        cv_splits=args.cv_splits,
        val_size=args.val_size
    )
    df_results.sort_values("score").to_csv("param_search_results_lastmonth.csv", index=False, encoding="utf-8-sig")
    with open("best_params_lastmonth.json","w",encoding="utf-8") as f:
        json.dump({"metric":args.metric,"score":best_score,**best_params}, f, ensure_ascii=False, indent=2)
    logging.info(f"[BEST] {args.metric.upper()}={best_score:.6f}, params={best_params}")

    # final forecast with best params → result.csv
    _ = forecast_lastmonth_with_best(
        train_df=train, test_df=test,
        params=best_params, window_days=args.window_days,
        out_csv=args.out
    )
