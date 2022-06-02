import produce from "immer";
import find from "lodash/find";
import {
  call,
  put,
  SagaReturnType,
  select,
  takeLatest,
} from "redux-saga/effects";

import { RootState } from "../../types";
import removeLiquidityFn from "../../utils/removeLiquidity";
import {
  removeLiquidityAction,
  resetRemoveLiquidityConfirmValues,
  resetWaitingPopupValues,
  setRemoveLiquidityFailedAction,
  setRemoveLiquidityProcessingAction,
  setRemoveLiquiditySucceededAction,
  setWaitingPopupValues,
  updateLiquidityWalletsAction, updatePairsAction,
} from "../actions/app";
import { REMOVE_LIQUIDITY } from "../actions/types";

function* removeLiquidity({
  payload,
}: ReturnType<typeof removeLiquidityAction>) {
  const { fromToken, fromValue, toToken, toValue, lpToken, lpValue } = payload;

  yield put(
    setWaitingPopupValues({
      hidable: true,
      text: "Removing liquidity",
      title: "Sending message to blockchain",
    }),
  );
  yield put(setRemoveLiquidityProcessingAction());
  yield put(resetRemoveLiquidityConfirmValues());
  try {
    const success: SagaReturnType<typeof removeLiquidityFn> = yield call(
      removeLiquidityFn,
      payload,
    );

    if (!success) throw new Error("Remove liquidity function failed");

    const { tokens, lpTokens, pairs }: RootState = yield select();
    yield put(
      updateLiquidityWalletsAction(
        produce({ tokens, lpTokens }, (draft) => {
          const from = find(draft.tokens, {
            walletAddress: fromToken.walletAddress,
          });
          const to = find(draft.tokens, {
            walletAddress: toToken.walletAddress,
          });
          const lp = find(draft.lpTokens, {
            walletAddress: lpToken.walletAddress,
          });

          if (from && to && lp) {
            from.balance += fromValue;
            to.balance += toValue;
            lp.balance -= lpValue;
          }
        }),
      ),
    );
    yield put(
      updatePairsAction(
        produce(pairs, (draft) => {
          const pair = find(draft, {symbolA: fromToken.symbol, symbolB: toToken.symbol});
          if (pair) {
            pair.reserveA -= fromValue;
            pair.reserveB -= toValue;
          }
        }),
      ),
    );
    
    yield put(setRemoveLiquiditySucceededAction());
  } catch (e) {
    yield put(setRemoveLiquidityFailedAction(e as string));
  }

  yield put(resetWaitingPopupValues());
}

export default function* removeLiquiditySaga() {
  yield takeLatest(REMOVE_LIQUIDITY, removeLiquidity);
}
