import "./index.scss";

import find from "lodash/find";
import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-rangeslider";
import { Link, Navigate, useParams } from "react-router-dom";

import MainBlock from "../MainBlock";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { iconGenerator } from "../../../iconGenerator";
import { setRemoveLiquidityConfirmValues } from "../../../store/actions/app";

export default function RemoveLiquidityPage() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const lpTokens = useAppSelector((state) => state.lpTokens);
  const pairs = useAppSelector((state) => state.pairs);
  const tokens = useAppSelector((state) => state.tokens);

  const lpToken = useMemo(
    () => find(lpTokens, { walletAddress: params.lpTokenAddress }),
    [lpTokens, params],
  );
  const pair = useMemo(
    () => find(pairs, { pairAddress: lpToken?.pairAddress }),
    [pairs, lpToken],
  );
  const fromToken = useMemo(
    () => find(tokens, { rootAddress: pair?.rootA }),
    [tokens, pair],
  );
  const toToken = useMemo(
    () => find(tokens, { rootAddress: pair?.rootB }),
    [tokens, pair],
  );

  const [rangeValue, setRangeValue] = useState(0);
  const [percent, setPercent] = useState(0);

  const [qtyA, setQtyA] = useState(0);
  const [qtyB, setQtyB] = useState(0);

  useEffect(() => {
    if (!lpToken || !pair) return;

    const total = pair.totalSupply;
    setPercent((lpToken.balance * 100) / total);
  }, [lpToken, pair]);

  const handleChange = (value: number) => {
    if (!pair) return;

    setRangeValue(value);
    setQtyA((((pair.reserveA * percent) / 100) * value) / 100);
    setQtyB((((pair.reserveB * percent) / 100) * value) / 100);
  };

  function handleRemove() {
    dispatch(
      setRemoveLiquidityConfirmValues({
        lpToken: lpToken!,
        fromToken: fromToken!,
        toToken: toToken!,
        fromValue: qtyA,
        toValue: qtyB,
        lpValue: (rangeValue / 100) * lpToken!.balance,
        pair: pair!,
      }),
    );
  }

  if (!lpToken || !pair) return <Navigate to="/pool" />;

  return (
    <div className="container">
      <MainBlock
        smallTitle={false}
        title={
          <Link to={`/manage/${lpToken.walletAddress}`} className="pool-back">
            <svg
              width="12"
              height="19"
              viewBox="0 0 12 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.9142 4.4108C11.6953 3.62975 11.6953 2.36342 10.9142 1.58237C10.1332 0.80132 8.86684 0.80132 8.08579 1.58237L10.9142 4.4108ZM2.5 9.99658L1.08579 8.58237C0.304738 9.36342 0.304738 10.6297 1.08579 11.4108L2.5 9.99658ZM8.08579 18.4108C8.86683 19.1918 10.1332 19.1918 10.9142 18.4108C11.6953 17.6297 11.6953 16.3634 10.9142 15.5824L8.08579 18.4108ZM8.08579 1.58237L1.08579 8.58237L3.91421 11.4108L10.9142 4.4108L8.08579 1.58237ZM1.08579 11.4108L8.08579 18.4108L10.9142 15.5824L3.91421 8.58237L1.08579 11.4108Z"
                fill="white"
              />
            </svg>
            Remove Liquidity
          </Link>
        }
        content={
          <div className="manage">
            <div className="manage-percents">
              <span className="manage-percent-value">{rangeValue}%</span>
              <div className="manage-percents-btns">
                <div
                  className="manage-percent-btn"
                  onClick={() => handleChange(25)}
                >
                  25%
                </div>
                <div
                  className="manage-percent-btn"
                  onClick={() => handleChange(50)}
                >
                  50%
                </div>
                <div
                  className="manage-percent-btn"
                  onClick={() => handleChange(75)}
                >
                  75%
                </div>
                <div
                  className="manage-percent-btn"
                  onClick={() => handleChange(100)}
                >
                  100%
                </div>
              </div>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={rangeValue}
              onChange={(value) => handleChange(value)}
              tooltip={false}
            />
            <p className="manage-subtitle">Amount</p>
            <div className="manage-token-wrapper">
              <div className="manage-token-balance">
                {qtyA < 0.0001
                  ? parseFloat(qtyA.toFixed(8))
                  : parseFloat(qtyA.toFixed(4))}
              </div>
              <div className="manage-token-symbol">
                <img src={iconGenerator(pair.symbolA)} alt={pair.symbolA} />
                {pair.symbolA}
              </div>
            </div>
            <div className="manage-token-wrapper">
              <div className="manage-token-balance">
                {qtyB < 0.0001
                  ? parseFloat(qtyB.toFixed(8))
                  : parseFloat(qtyB.toFixed(4))}
              </div>
              <div className="manage-token-symbol">
                <img src={iconGenerator(pair.symbolB)} alt={pair.symbolB} />
                {pair.symbolB}
              </div>
            </div>
            <p className="manage-subtitle">Price</p>
            <p className="manage-text">
              1 {pair.symbolA} ={" "}
              {pair.rateAB < 0.0001
                ? parseFloat(pair.rateAB.toFixed(8))
                : parseFloat(pair.rateAB.toFixed(4))}{" "}
              {pair.symbolB}
            </p>
            <p className="manage-text">
              1 {pair.symbolB} ={" "}
              {pair.rateBA < 0.0001
                ? parseFloat(pair.rateBA.toFixed(8))
                : parseFloat(pair.rateBA.toFixed(4))}{" "}
              {pair.symbolA}
            </p>
            <button
              onClick={rangeValue !== 0 ? handleRemove : () => {}}
              className={
                rangeValue !== 0
                  ? "btn mainblock-btn"
                  : "btn mainblock-btn btn--disabled"
              }
            >
              Remove
            </button>
          </div>
        }
      />
    </div>
  );
}
