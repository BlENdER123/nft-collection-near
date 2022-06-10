import {all} from "redux-saga/effects";

// import connectWalletSaga from "./sagas/connectWallet";
import fetchNFTsUrlsSaga from "./fetchNFTsUrls";
import connectWalletSaga from "./connectWallet";
import getAccountDataSaga from "./getAccountData";
import webSocketSagas from "./web-socket-sagas/index";
// import fetchTokensSaga from "./sagas/fetchTokens";
// import makeSwapSaga from "./sagas/makeSwap";
// import provideLiquiditySaga from "./sagas/provideLiquidity";
// import removeLiquiditySaga from "./sagas/removeLiquidity";
// import createPairSaga from "./sagas/createPair";

export default function* rootSaga() {
	yield all([
		// fetchPairsSaga(),
		// fetchTokensSaga(),
		fetchNFTsUrlsSaga(),
		connectWalletSaga(),
		getAccountDataSaga(),
		//webSocketSagas(),
		// makeSwapSaga(),
		// removeLiquiditySaga(),
		// createPairSaga(),
		// provideLiquiditySaga(),
	]);
}
