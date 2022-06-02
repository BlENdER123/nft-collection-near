// import {
//   ActionError,
//   AddLiquidityArg,
//   CreatePairArg,
//   LimitOrderValuesConfirm,
//   LpToken,
//   MakeLimitOrderArg,
//   MakeSwapArg,
//   ProvideLiquidityValuesConfirm,
//   RemoveLiquidityArg,
//   RemoveLiquidityValuesConfirm,
//   SetClientDataArg,
//   SwapValuesConfirm,
//   ThemeVariant,
//   Token,
//   WaitingPopupValues,
//   CreatePairValuesConfirm,
//   Pair
// } from "../types";
import {
  CONNECT_WALLET_ACTION,
  CONNECT_WALLET_LOADING,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILED,
  DISCONNECT_WALLET_ACTION,
  NFTS_URL_FETCH_SUCCESS,
  NFTS_URL_FETCH_REQUESTED, 
  NFTS_URL_FETCH_LOADING, 
  NFTS_URL_FETCH_FAILED,
  GET_ACCOUNT_DATA_ACTION,
  GET_ACCOUNT_DATA_ACTION_FAILED,
  GET_ACCOUNT_DATA_ACTION_SUCCESS,
  GET_ACCOUNT_DATA_ACTION_LOADING,


} from "./types";

// DROP ALL ACCOUNT DATA
export function disconnectWalletAction() {
  return {
    type: DISCONNECT_WALLET_ACTION,
  };
}

//GET ACCOUNT DATA FROM WALLETACCOUNT - NEAR SDK
export function getAccountDataAction() {
  return {
    type: GET_ACCOUNT_DATA_ACTION,
  };
}
export function getAccountDataLoading() {
  return {
    type: GET_ACCOUNT_DATA_ACTION_LOADING,
  };
}

export function getAccountDataSuccess(data) {
  return {
    type: GET_ACCOUNT_DATA_ACTION_SUCCESS,
    payload: data,
  };
}

export function getAccountDataFailed(e) {
  return {
    type: GET_ACCOUNT_DATA_ACTION_FAILED,
    payload: e,
  };
}

//CONNECT WALLET AT NEAR 
export function connectWalletAction() {
  console.log("connectWalletAction action")
  return {
    type: CONNECT_WALLET_ACTION,
  };
}

export function connectWalletLoading() {
  return {
    type: CONNECT_WALLET_LOADING,
  };
}

export function connectWalletSuccess(data) {
  console.log("connectWalletSuccess",data)
  return {
    type: CONNECT_WALLET_SUCCESS,
    payload: data,
  };
}

export function connectWalletFailed(e) {
  return {
    type: CONNECT_WALLET_FAILED,
    payload: e,
  };
}



export function requestNFtsUrlsFetchAction() {
  return {
    type: NFTS_URL_FETCH_REQUESTED,
  };
}

export function setNFtsUrlsFetchLoadingAction() {
  return {
    type: NFTS_URL_FETCH_LOADING,
  };
}

export function setNFtsUrlsSuccess(NFTsUrls) {
  return {
    type: NFTS_URL_FETCH_SUCCESS,
    payload: NFTsUrls,
  };
}

export function setNFtsUrlsFailedAction(e) {
  return {
    type: NFTS_URL_FETCH_FAILED,
    payload: e,
  };
}