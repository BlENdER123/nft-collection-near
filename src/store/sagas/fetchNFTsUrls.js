import { call, put, SagaReturnType, takeLatest,takeEvery } from "redux-saga/effects";

import getUrlsData from "../../utils/getUrlsData";
import {
  setNFtsUrlsFailedAction,
  setNFtsUrlsFetchLoadingAction,
  setNFtsUrlsSuccess,
} from "../actions/app";
import { NFTS_URL_FETCH_REQUESTED } from "../actions/types";
// import {takeEvery} from "@redux-saga/core/types/effects";

function* fetchNFTsUrls() {
  yield put(setNFtsUrlsFetchLoadingAction());

  try {
    const nftUrls = yield call(
      getUrlsData,
    );
    console.log("urls", nftUrls)
    yield put(setNFtsUrlsSuccess(nftUrls));
  } catch (e) {
    yield put(setNFtsUrlsFailedAction(e));
  }
}

export default function* fetchNFTsUrlsSaga() {
  yield takeLatest(NFTS_URL_FETCH_REQUESTED, fetchNFTsUrls);
}
