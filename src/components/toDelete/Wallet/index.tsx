import "./index.scss";

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { iconGenerator } from "../../../iconGenerator";

function Wallet() {
  const navigate = useNavigate();

  const clientData = useAppSelector((state) => state.client);

  if (!clientData) return <Navigate to="/swap" />;

  return (
    <div className="wallet">
      {/*{walletIsConnected &&*/}
      <div className="wallet-wrap" onClick={() => navigate("/account")}>
        <span className="wallet-ballance">
          {clientData.balance.toFixed(4)}{" "}
          <img width={15} src={iconGenerator("STACKING")} alt="Icon" />
        </span>
        <span className="wallet-key">
          {clientData.address.slice(0, 5)}...{clientData.address.slice(-4)}
        </span>
      </div>
      {/*}*/}
    </div>
  );
}

export default Wallet;
