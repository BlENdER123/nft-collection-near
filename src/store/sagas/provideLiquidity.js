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
import addLiquidity from "../../utils/addLiquidity";
import {
  removeLiquidityAction,
  resetProvideLiquidityConfirmValues,
  resetWaitingPopupValues,
  setAddLiquidityFailedAction,
  setAddLiquidityProcessingAction,
  setAddLiquiditySucceededAction,
  setWaitingPopupValues,
  updateLiquidityWalletsAction, updatePairsAction,
} from "../actions/app";
import { ADD_LIQUIDITY } from "../actions/types";

function* provideLiquidity({
  payload,
}: ReturnType<typeof removeLiquidityAction>) {
  const { fromToken, fromValue, toToken, toValue, lpToken, lpValue } = payload;

  yield put(
    setWaitingPopupValues({
      hidable: true,
      text: "Adding liquidity",
      title: "Sending message to blockchain",
    }),
  );
  yield put(setAddLiquidityProcessingAction());
  yield put(resetProvideLiquidityConfirmValues());
  try {
    const success: SagaReturnType<typeof addLiquidity> = yield call(
      addLiquidity,
      payload,
    );

    if (!success) throw new Error("Add liquidity function failed");

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
            from.balance -= fromValue;
            to.balance -= toValue;
            lp.balance += lpValue;
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
            pair.reserveB += toValue;
          }
        }),
      ),
    );
    yield put(setAddLiquiditySucceededAction());
  } catch (e) {
    yield put(setAddLiquidityFailedAction(e as string));
  }

  yield put(resetWaitingPopupValues());
}

export default function* provideLiquiditySaga() {
  yield takeLatest(ADD_LIQUIDITY, provideLiquidity);
}
