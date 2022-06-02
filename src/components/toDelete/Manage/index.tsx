import "./index.scss";

import find from "lodash/find";
import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { iconGenerator } from "../../../iconGenerator";
import CloseBtn from "../CloseBtn";
import Button from "../Button/Button";
import MainBlock from "../MainBlock";

export default function Manage() {
  const navigate = useNavigate();
  const params = useParams();

  const lpTokens = useAppSelector((state) => state.lpTokens);
  const pairs = useAppSelector((state) => state.pairs);

  const lpToken = useMemo(
    () => find(lpTokens, { walletAddress: params.lpTokenAddress }),
    [lpTokens, params],
  );
  const pair = useMemo(
    () => find(pairs, { pairAddress: lpToken?.pairAddress }),
    [pairs, lpToken],
  );

  const [poolShare, setPoolShare] = useState(1);
  const [pooledTokensA, setpooledTokensA] = useState(1);
  const [pooledTokensB, setpooledTokensB] = useState(1);

  useEffect(() => {
    if (!lpToken || !pair) return;

    let poolS =
      (lpToken.balance * 100) /
      (pair && (pair.totalSupply ? pair.totalSupply : 1));
    setPoolShare(poolS);
  }, [lpToken, pair]);

  useEffect(() => {
    if (!lpToken || !pair) return;

    let pooledTokensA = ((pair.reserveA) * poolShare) / 100;
    let pooledTokensB = ((pair.reserveB) * poolShare) / 100;
console.log("pooledTokensA",pooledTokensA)
    setpooledTokensA(pooledTokensA);
    setpooledTokensB(pooledTokensB);
  }, [poolShare, lpToken, pair]);

  function handleSupplyClick() {
    navigate(`/add-liquidity?from=${pair?.rootA}&to=${pair?.rootB}`);
  }

  function handleClose() {
    navigate("/pool");
  }

  if (!lpToken || !pair) return <Navigate to="/pool" />;

  return (
    <div className="popup-wrapper">
      <MainBlock
        class={"manage-confirm"}
        title={"Manage"}
        button={<CloseBtn onClick={handleClose} />}
        content={
          <>
            <div className="confirm-block">
              <span className="confirm-value supply">
                {parseFloat(lpToken.balance.toFixed(4))}
              </span>
              <img
                className="confirm-icon"
                src={iconGenerator(pair.symbolA)}
                style={{ marginRight: '-15px' }}
                alt={pair.symbolA}
              />
              <img
                className="confirm-icon"
                src={iconGenerator(pair.symbolB)}
                alt={pair.symbolB}
              />
              <span className="confirm-token">
                DS-{pair.symbolA}/{pair.symbolB} LP Tokens
              </span>
            </div>
            <Button
              onClick={handleSupplyClick}
              
              size={"large"}
            >
              Supply
            </Button>
            {lpToken.balance !== 0 ? (
              <div className="manage-remove-link">
                <span
                  onClick={() =>
                    navigate(`/remove-liquidity/${lpToken.walletAddress}`)
                  }
                >
                  Remove
                </span>
              </div>
            ) : null}
          </>
        }
        footer={
          <div className="mainblock-footer">
            <div className="mainblock-footer-wrap">
              <div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value">
                    {parseFloat(lpToken.balance.toFixed(4))}
                  </p>
                  <p className="mainblock-footer-subtitle">
                    Your total pool tokens
                  </p>
                </div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value">
                    {poolShare.toFixed(4)} %
                  </p>
                  <p className="mainblock-footer-subtitle">Your pool share</p>
                </div>
              </div>
              <div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value">
                    {pooledTokensA.toFixed(4)}
                  </p>
                  <p className="mainblock-footer-subtitle">
                    Your pooled {pair.symbolA}
                  </p>
                </div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value">
                    {pooledTokensB.toFixed(4)}
                  </p>
                  <p className="mainblock-footer-subtitle">
                    Your pooled {pair.symbolB}
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
