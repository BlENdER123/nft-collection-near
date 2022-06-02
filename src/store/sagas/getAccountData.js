import { call, put, SagaReturnType, takeLatest } from "redux-saga/effects";

import getAccountData from "../../utils/getAccountData";
import {
  getAccountDataLoading,
  getAccountDataSuccess,
  getAccountDataFailed,
} from "../actions/app";
import { GET_ACCOUNT_DATA_ACTION } from "../actions/types";

function* getAccountDataS() {
  yield put(getAccountDataLoading());
  try {
    const accountData = yield call(
      getAccountData,
    );
    console.log("accountData",accountData)
    yield put(getAccountDataSuccess(accountData));
  } catch (e) {
    yield put(getAccountDataFailed(e));
  }
}

export default function* getAccountDataSaga() {
  yield takeLatest(GET_ACCOUNT_DATA_ACTION, getAccountDataS);
}
