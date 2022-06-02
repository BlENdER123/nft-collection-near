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
  NFTS_FETCH_REQUESTED,
  NFTS_FETCH_LOADING,
  NFTS_FETCH_SUCCESS,
  NFTS_FETCH_FAILED,
} from "./types";



export function requestNFtsFetchAction() {
  return {
    type: NFTS_FETCH_REQUESTED,
  };
}

export function setNFtsFetchLoadingAction() {
  return {
    type: NFTS_FETCH_LOADING,
  };
}

export function setNFtsSuccess(NFTs) {
  return {
    type: NFTS_FETCH_SUCCESS,
    payload: NFTs,
  };
}

export function setNFtsFailedAction(e) {
  return {
    type: NFTS_FETCH_FAILED,
    payload: e,
  };
}