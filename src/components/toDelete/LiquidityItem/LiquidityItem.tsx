import "./LiquidityItem.scss";

import find from "lodash/find";
import React, { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { iconGenerator } from "../../../iconGenerator";
import { LiquidityItemProps } from "../../../types";

function LiquidityItem({ onClick, lpToken }: LiquidityItemProps) {
  const navigate = useNavigate();
  const pairsList = useAppSelector((state) => state.pairs);

  const pair = useMemo(
    () => find(pairsList, { pairAddress: lpToken.pairAddress }),
    [lpToken, pairsList],
  );

  function handleClick() {
    navigate(`/manage/${lpToken}`);
  }

  if (!pair) return <Navigate to="/pool" />;

  return (
    <div className="liquidity-item" onClick={onClick}>
      <div>
        <img src={iconGenerator(pair.symbolA)} alt={pair.symbolA} />
        <img src={iconGenerator(pair.symbolB)} alt={pair.symbolB} />
        <span className="liquidity-item-text">
          {pair.symbolA}/{pair.symbolB} LP Tokens
        </span>
      </div>
      <button onClick={handleClick} className="liquidity-item-btn">
        Manage
      </button>
    </div>
  );
}

export default LiquidityItem;
