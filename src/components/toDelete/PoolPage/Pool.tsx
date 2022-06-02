import "./Pool.scss";

import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { connectWalletAction } from "../../../store/actions/app";
import { LpToken } from "../../../types";
import LiquidityItem from "../LiquidityItem/LiquidityItem";
import MainBlock from "../MainBlock";

import React from "react";

import Button from "../Button/Button";
import Icon from "../../../Icon";


function Pool() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const walletIsConnected = useAppSelector((state) => state.client);
  const pairs = useAppSelector((state) => state.pairs);
  const lpTokens = useAppSelector((state) => state.lpTokens);

  function handleConnectWallet() {
    // dispatch(connectWalletAction());
    navigate("/account")
  }

  function handleItemClick(lpToken: LpToken) {
    navigate(`/manage/${lpToken.walletAddress}`);
  }

  return (
    <div className="container">
      <MainBlock
        class={"pool"}
        content={
          <div style={{ display: "contents" }}>
            <div className="head_wrapper" style={{ marginBottom: "40px" }}>
              <div
                className="left_block"
              >
                Liquidity pools
              </div>
            </div>

            {!walletIsConnected ? (
              <button className="btn mainblock-btn" onClick={handleConnectWallet}>
                Connect wallet
              </button>
            ) : (
              <div className="pool-wrapper">
                {!pairs.length
                  ? "You don’t have liquidity pairs yet"
                  : lpTokens.map((t) => (

                    <LiquidityItem
                      lpToken={t}
                      key={t.walletAddress}
                      onClick={(e) => handleItemClick(t)}
                    />
                  ))}
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}

export default Pool;
