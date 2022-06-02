import produce from "immer";
import find from "lodash/find";
import {
  call,
  put,
  SagaReturnType,
  select,
  takeLatest,
} from "redux-saga/effects";

// import {RootState} from "../../types";
import cratePairFunc from "../../utils/cratePairFunc";
// import truncateNum from "../../utils/truncateNum";
import {
  createPairAction,
  resetCreatePairConfirmValues,
  resetWaitingPopupValues,
  setCreatePairFailedAction,
  setCreatePairProcessingAction,
  setCreatePairSucceededAction,
  setWaitingPopupValues, updateLPtokensAction,
  updatePairsAction, updateSwapWalletsAction,
} from "../actions/app";
import {CREATE_PAIR} from "../actions/types";

function* createPairSaga({payload}) {
  const {fromToken, toToken, fromValue, toValue} = payload;

  yield put(
    setWaitingPopupValues({
      hidable: true,
      text: `Creating DS-${fromToken.symbol}/${toToken.symbol} pair`,
      title: "Sending message to blockchain",
    }),
  );
  yield put(setCreatePairProcessingAction());
  yield put(resetCreatePairConfirmValues());
  try {
    const success = yield call(cratePairFunc, payload);

    if (!success) throw new Error("Create pair function failed");

    const {pairs, lpTokens, tokens} = yield select();
    yield put(
      updatePairsAction(
        produce(pairs, (draft) => {
          draft.push(
            {
              exists: true,
              pairAddress: `0:${pairs.length + 1}0c00629f4a36672608b441c6e5bc3809be782e3bf1faad4e32e18ad0f4c0bdb`,
              rateAB: fromValue / toValue,
              rateBA: toValue / fromValue,
              reserveA: fromValue,
              reserveB: toValue,
              rootA: fromToken.rootAddress,
              rootB: toToken.rootAddress,
              symbolA: fromToken.symbol,
              symbolB: toToken.symbol,
              totalSupply: fromValue + toValue
            },
          )
        }),
      ),
    );
    yield put(
      updateLPtokensAction(
        produce(lpTokens, (draft) => {
          draft.push(
            {
              balance: fromValue + toValue,
              decimals: 9,
              owner_address: "0:e8b5908ec8d4f3f252a51cccd7ca1181804eb2a4e0781468b02780134908984d",
              rootAddress: `0:${pairs.length + 2}0c00629f4a36672608b441c6e5bc3809be782e3bf1faad4e32e18ad0f4c0bdb`,
              symbol: `DS-${fromToken.symbol}/${toToken.symbol}`,
              tokenName: `Pool tokens of ${fromToken.symbol}/${toToken.symbol} pair`,
              type: "PureToken",
              walletAddress: `0:${pairs.length + 3}e444a69dbf287e5f1c1577581be508286349b6e75b285465d9500285e2ddadd`,
              pairAddress: `0:${pairs.length + 1}0c00629f4a36672608b441c6e5bc3809be782e3bf1faad4e32e18ad0f4c0bdb`

            }
          )
        })
      )
    )
    yield put(
      updateSwapWalletsAction(
        produce(tokens, (draft) => {
          const from = find(draft, { walletAddress: fromToken.walletAddress });
          const to = find(draft, { walletAddress: toToken.walletAddress });

          if (from && to) {
            from.balance -= fromValue;
            to.balance -= toValue;
          }
        }),
      ),
    );

    yield put(setCreatePairSucceededAction());
  } catch (e) {
    yield put(setCreatePairFailedAction(e));
  }

  yield put(resetWaitingPopupValues());
}

export default function* makeSwapSaga() {
  yield takeLatest(CREATE_PAIR, createPairSaga);
}
