import produce from "immer";
import find from "lodash/find";
import {
  call,
  put,
  SagaReturnType,
  select,
  takeLatest,
} from "redux-saga/effects";

import {RootState} from "../../types";
import swap from "../../utils/swap";
import truncateNum from "../../utils/truncateNum";
import {
  makeSwapAction,
  resetSwapConfirmValues,
  resetWaitingPopupValues,
  setSwapFailedAction,
  setSwapProcessingAction,
  setSwapSucceededAction,
  setWaitingPopupValues, updatePairsAction,
  updateSwapWalletsAction,
} from "../actions/app";
import {MAKE_SWAP} from "../actions/types";

function* makeSwap({payload}: ReturnType<typeof makeSwapAction>) {
  const {fromToken, fromValue, toToken, toValue} = payload;

  yield put(
    setWaitingPopupValues({
      hidable: true,
      text: `Swapping ${truncateNum(fromValue)} ${
        fromToken.symbol
      } for ${truncateNum(toValue)} ${toToken.symbol}`,
      title: "Sending message to blockchain",
    }),
  );
  yield put(setSwapProcessingAction());
  yield put(resetSwapConfirmValues());
  try {
    const success: SagaReturnType<typeof swap> = yield call(swap, payload);

    if (!success) throw new Error("Swap function failed");

    const {tokens, pairs}: RootState = yield select();
    yield put(
      updateSwapWalletsAction(
        produce(tokens, (draft) => {
          const from = find(draft, {walletAddress: fromToken.walletAddress});
          const to = find(draft, {walletAddress: toToken.walletAddress});

          if (from && to) {
            from.balance -= fromValue;
            to.balance += toValue;
          }
        }),
      ),
    );
    yield put(
      updatePairsAction(
        produce(pairs, (draft) => {
          const pair = find(draft, {symbolA: fromToken.symbol, symbolB: toToken.symbol});

          if (pair) {
            pair.reserveA += fromValue;
            pair.reserveB -= toValue;
          }
        }),
      ),
    )

    yield put(setSwapSucceededAction());
  } catch (e) {
    yield put(setSwapFailedAction(e as string));
  }

  yield put(resetWaitingPopupValues());
}

export default function* makeSwapSaga() {
  yield takeLatest(MAKE_SWAP, makeSwap);
}
