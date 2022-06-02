import { call, put, SagaReturnType, takeLatest,takeEvery } from "redux-saga/effects";

import fetchNFTs from "../../utils/fetchNFTs";
import {
  setNFtsFailedAction,
  setNFtsFetchLoadingAction,
  setNFtsSuccess,
} from "../actions/market";
import { NFTS_FETCH_REQUESTED } from "../actions/types";
// import {takeEvery} from "@redux-saga/core/types/effects";

function* fetchNFTs() {
  yield put(setNFtsFetchLoadingAction());

  try {
    const nftUrls = yield call(
      fetchNFTs,
    );
    console.log("urls", nftUrls)
    yield put(setNFtsSuccess(nftUrls));
  } catch (e) {
    yield put(setNFtsFailedAction(e));
  }
}

export default function* fetchLpTokensSaga() {
  yield takeLatest(NFTS_FETCH_REQUESTED, fetchNFTs);
}
