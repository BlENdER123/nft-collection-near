import "./NativeLogin.scss";

import React from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { connectWalletAction } from "../../../store/actions/app";

function NativeLogin() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleClick = async () => {
    dispatch(connectWalletAction());

    navigate("/account");
  };

  return (
    <div className="container">
      <div className="mainblock">
        <div className="mainblock-title">Login</div>
        {/*{(!walletIsConnected && wallet) ?*/}
        <button className="btn wallet-btn" onClick={handleClick}>
          Log in using Seed phrase
        </button>
        <button className="btn wallet-btn" onClick={handleClick}>
          Create a new Wallet
        </button>
      </div>
    </div>
  );
}

export default NativeLogin;
