import produce from "immer";

// import {
//   ActionError,
//   LimitOrderValuesConfirm,
//   LpToken,
//   Pair,
//   ProvideLiquidityValuesConfirm,
//   ReduxAction,
//   RemoveLiquidityValuesConfirm,
//   SetClientDataArg,
//   SwapValuesConfirm,
//   ThemeVariant,
//   Token,
//   WaitingPopupValues,
//   CreatePairValuesConfirm
// } from "../types";
import {

  GET_ACCOUNT_DATA_ACTION,
  GET_ACCOUNT_DATA_ACTION_FAILED,
  GET_ACCOUNT_DATA_ACTION_SUCCESS,
  GET_ACCOUNT_DATA_ACTION_LOADING,
  CONNECT_WALLET_ACTION,
  CONNECT_WALLET_LOADING,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILED,
  NFTS_URL_FETCH_FAILED,
  NFTS_URL_FETCH_LOADING,
  NFTS_URL_FETCH_SUCCESS, DISCONNECT_WALLET_ACTION,
} from "../actions/types";

const nftUrlsInitialState = {
  NFTsUrls: [],
  NFTsUrlsError: null,
  NFTsUrlsFetched: false,
  NFTsUrlsLoading: false,
};

const appTheme = "light";

const wallet = {
  connected: [],
  account: {} ,
  connectionError: null,
  connectionFetched: false,
  connectionLoading: false,
};

const tokensInitialState = {
  tokens: [] ,
  tokensError: null | null,
  tokensFetched: false,
  tokensLoading: false,
};

const lpTokensInitialState = {
  lpTokens: [] ,
  lpTokensError: null | null,
  lpTokensFetched: false,
  lpTokensLoading: false,
};

const clientInitialState = {
  client: null | null,
  clientError: null | null,
  clientFetched: false,
  clientLoading: false,
};

const popups = {
  swapConfirmValues: null | null,
  makeLimitOrderConfirmValues: null | null,
  provideLiquidityConfirmValues: null | null,
  removeLiquidityConfirmValues: null | null,
  waitingPopupValues: null | null,
  createPairConfirmValues: null | null,
};

const initialState = {
  // appTheme,
  ...nftUrlsInitialState,
  ...wallet,
  // ...lpTokensInitialState,
  // ...clientInitialState,
  // ...popups,
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case DISCONNECT_WALLET_ACTION:
      return produce(state, (draft) => {
        draft.connected = false;
        draft.account = {};
        draft.connectionError = null;
        draft.connectionFetched = true;
        draft.connectionLoading = false;
      });    
    // case CONNECT_WALLET_ACTION:
    //   return produce(state, (draft) => {
    //     draft.connected = false;
    //     draft.connectionError = null;
    //     draft.connectionFetched = true;
    //     draft.connectionLoading = true;
    //   });
    case GET_ACCOUNT_DATA_ACTION_LOADING:
      return produce(state, (draft) => {
        draft.connected = false;
        draft.connectionError = null;
        draft.connectionFetched = true;
        draft.connectionLoading = true;
      });
    case GET_ACCOUNT_DATA_ACTION_SUCCESS:
      return produce(state, (draft) => {
        draft.connected = true;
        draft.account = action.payload;
        draft.connectionError = false;
        draft.connectionFetched = true;
        draft.connectionLoading = false;
      });
    case GET_ACCOUNT_DATA_ACTION_FAILED:
      return produce(state, (draft) => {
        draft.connected = false;
        draft.account = {};
        draft.connectionError = true;
        draft.connectionFetched = true;
        draft.connectionLoading = false;
      });
      
//CONNECT WALLET NEAR RPC
    case CONNECT_WALLET_LOADING:
      return produce(state, (draft) => {
        draft.connected = false;
        draft.requestSignIn = "loading";
        draft.connectionError = null;
        draft.connectionFetched = true;
        draft.connectionLoading = true;
      });
    case CONNECT_WALLET_SUCCESS:
      return produce(state, (draft) => {
        draft.connected = false;
        draft.requestSignIn = action.payload;
        draft.connectionError = false;
        draft.connectionFetched = true;
        draft.connectionLoading = false;
      });
    case CONNECT_WALLET_FAILED:
      return produce(state, (draft) => {
        draft.connected = false;
        draft.requestSignIn = "failed";
        draft.connectionError = true;
        draft.connectionFetched = true;
        draft.connectionLoading = false;
      });
      
//FIRST PART OF LOADING NFTS - GET URLS
    case NFTS_URL_FETCH_SUCCESS:
      return produce(state, (draft) => {
        draft.NFTsUrls = action.payload;
        draft.NFTsUrlsError = null;
        draft.NFTsUrlsFetched = true;
        draft.NFTsUrlsLoading = false;
      });
    case NFTS_URL_FETCH_LOADING:
      return produce(state, (draft) => {
        draft.NFTsUrlsError = null;
        draft.NFTsUrlsFetched = false;
        draft.NFTsUrlsLoading = true;
      });
    case NFTS_URL_FETCH_FAILED:
      return produce(state, (draft) => {
        draft.NFTsUrlsError = action.payload;
        draft.NFTsUrlsFetched = true;
        draft.NFTsUrlsLoading = false;
      });
     default:
      return state;
  }
}
