import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";

import connectWallet from "../../utils/connectWallet";
import {
  connectWalletLoading,
  connectWalletSuccess,
  connectWalletFailed,
} from "../actions/app";
import { CONNECT_WALLET_ACTION } from "../actions/types";

function* connectWalletS() {
  console.log("connectWalletSaga")
  yield put(connectWalletLoading());
  try {
    const wallet = yield call(
      connectWallet,
    );
    console.log("wallet",wallet)
    yield put(connectWalletSuccess(wallet));
  } catch (e) {
    yield put(connectWalletFailed(e));
  }
}

export default function* connectWalletSaga() {
  yield takeLatest(CONNECT_WALLET_ACTION, connectWalletS);
}
