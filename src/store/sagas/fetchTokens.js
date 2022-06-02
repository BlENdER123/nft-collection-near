import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";

import getAllTokenWallets from "../../utils/getAllTokenWallets";
import {
  setTokensFetchFailedAction,
  setTokensFetchLoadingAction,
  setTokensFetchSucceededAction,
} from "../actions/app";
import { TOKENS_FETCH_REQUESTED } from "../actions/types";

function* fetchTokens() {
  yield put(setTokensFetchLoadingAction());

  try {
    const tokens: SagaReturnType<typeof getAllTokenWallets> = yield call(
      getAllTokenWallets,
    );

    yield put(setTokensFetchSucceededAction(tokens));
  } catch (e) {
    yield put(setTokensFetchFailedAction(e as string));
  }
}

export default function* fetchTokensSaga() {
  yield takeLatest(TOKENS_FETCH_REQUESTED, fetchTokens);
}
