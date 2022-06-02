import { SnackbarKey } from "notistack";
import {
  ButtonHTMLAttributes,
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  ReactElement,
} from "react";
import { NumberFormatValues, SourceInfo } from "react-number-format";

import { reduxStore } from "./lib/redux";
import {
  addLiquidityAction,
  changeThemeAction,
  connectWalletAction,
  createPairAction,
  disconnectWalletAction,
  makeLimitOrderAction,
  makeSwapAction,
  removeLiquidityAction,
  requestLpTokensFetchAction,
  requestPairsFetchAction,
  requestTokensFetchAction,
  resetMakeLimitOrderConfirmValues,
  resetProvideLiquidityConfirmValues,
  resetRemoveLiquidityConfirmValues,
  resetSwapConfirmValues,
  resetWaitingPopupValues,
  setAddLiquidityFailedAction,
  setAddLiquidityProcessingAction,
  setAddLiquiditySucceededAction,
  setConnectWalletFailedAction,
  setConnectWalletProcessingAction,
  setConnectWalletSucceededAction,
  setCreatePairFailedAction,
  setCreatePairProcessingAction,
  setCreatePairSucceededAction,
  setLpTokensFetchFailedAction,
  setLpTokensFetchLoadingAction,
  setLpTokensFetchSucceededAction,
  setMakeLimitOrderConfirmValues,
  setMakeLimitOrderFailedAction,
  setMakeLimitOrderProcessingAction,
  setMakeLimitOrderSucceededAction,
  setPairsFetchFailedAction,
  setPairsFetchLoadingAction,
  setPairsFetchSucceededAction,
  setProvideLiquidityConfirmValues,
  setRemoveLiquidityConfirmValues,
  setRemoveLiquidityFailedAction,
  setRemoveLiquidityProcessingAction,
  setRemoveLiquiditySucceededAction,
  setSwapConfirmValues,
  setSwapFailedAction,
  setSwapProcessingAction,
  setSwapSucceededAction,
  setTokensFetchFailedAction,
  setTokensFetchLoadingAction,
  setTokensFetchSucceededAction,
  setWaitingPopupValues,
  updateLiquidityWalletsAction,
  updateSwapWalletsAction,
  setCreatePairConfirmValues,
  resetCreatePairConfirmValues,
  updatePairsAction,
  updateLPtokensAction
  
} from "./store/actions/app";

export interface AlertMessageProps {
  type: "success" | "info" | "error";
  message: string;
}

export interface AlertProps extends AlertMessageProps {
  id: SnackbarKey;
}

export interface CloseBtnProps {
  height: number;
  width: number;
  onClick: MouseEventHandler;
}

export interface SetClientDataArg {
  status: boolean;
  address: string;
  balance: number;
}

export interface SetWaitingPopupValuesArg {
  hidable: boolean;
  text: string;
  title: string;
}

export interface Token {
  balance: number;
  decimals: number;
  owner_address: string;
  rootAddress: string;
  symbol: string;
  tokenName: string;
  type: string;
  walletAddress: string;
}

export interface Extensions {
  symbol: string,
  chainID: number,
  rootAddress: number
}

export interface Pair {
  exists: boolean;
  pairAddress: string;
  rateAB: number;
  rateBA: number;
  reserveA: number;
  reserveB: number;
  rootA: string;
  rootB: string;
  symbolA: string;
  symbolB: string;
  totalSupply: number;
}

export type UseSelectPopupArg = (t: Token) => void;

export type UseSlippagePopupArg = (t: number) => void;

export interface SwapValuesFormik {
  fromToken: Token | null;
  fromValue: number | "";
  pair: Pair | null;
  slippage: number;
  toToken: Token | null;
  toValue: number | "";
  name: string | "";
}

export interface SwapValuesConfirm {
  fromToken: Token;
  fromValue: number;
  pair: Pair;
  slippage: number;
  toToken: Token;
  toValue: number;
}
export interface CreatePairValuesConfirm {
  fromToken: Token;
  fromValue: number;
  pair: Pair;
  slippage: number;
  toToken: Token;
  toValue: number;
}
export interface LimitOrderValuesFormik {
  fromToken: Token | null;
  fromValue: number | "";
  pair: Pair | null;
  price: number;
  toToken: Token | null;
  toValue: number | "";
}

export interface LimitOrderValuesConfirm {
  fromToken: Token;
  fromValue: number;
  pair: Pair;
  price: number;
  toToken: Token;
  toValue: number;
}

export interface SwapErrorsFormik {
  fromToken?: string;
  fromValue?: string;
  pair?: string;
  slippage?: string;
  toToken?: string;
  toValue?: string;
}

export interface ProvideLiquidityValuesFormik {
  fromToken: Token | null;
  fromValue: number | "";
  pair: Pair | null;
  toToken: Token | null;
  toValue: number | "";
}

export interface ProvideLiquidityValuesConfirm {
  fromToken: Token;
  fromValue: number;
  toToken: Token;
  toValue: number;
  lpToken: LpToken;
  lpValue: number;
}

export interface RemoveLiquidityValuesFormik {
  amount: number;
  lpToken: LpToken | null;
  pair: Pair | null;
}

export interface RemoveLiquidityValuesConfirm {
  fromToken: Token;
  fromValue: number;
  pair: Pair;
  toToken: Token;
  toValue: number;
  lpValue: number;
  lpToken: LpToken;
}

export interface WaitingPopupValues {
  hidable: boolean;
  text: string;
  title: string;
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export interface SelectPopupProps {
  loading: boolean;
  onClose: ((event: MouseEvent | TouchEvent) => void) | MouseEventHandler;
  onSelect: (e: MouseEvent | TouchEvent, t: Token) => void;
  tokens: any;
  title: string;
}

export interface LoaderProps {
  className: string;
}

export interface SlippagePopupProps {
  id?: string;
  open: Boolean;
  anchorEl: EventTarget | VirtualElement | null;
  onClose: (e: MouseEvent | TouchEvent) => void;
  value: number;
  onChange: (values: NumberFormatValues, sourceInfo: SourceInfo) => void;
}

export interface InputProps {
  autoFocus?: boolean;
  className?: string;
  error?: boolean;
  helperText?: string;
  label: string;
  name: string;
  notExact?: boolean;
  onMaxClick: MouseEventHandler;
  onSelectClick: MouseEventHandler;
  onValueBlur: FocusEventHandler;
  onValueChange: ChangeEventHandler;
  readOnly?: boolean;
  token: Token | null;
  touched?: boolean;
  value: number | "";
  ref: any
}

export interface VirtualElement {
  getBoundingClientRect: () => DOMRect;
  contextElement?: Element;
}

export type DirectionPair = "AB" | "BA";

export interface MakeSwapArg {
  directionPair: DirectionPair;
  pair: Pair;
  fromToken: Token;
  toToken: Token;
  fromValue: number;
  toValue: number;
}

export type ActionError = string;

export type AddLiquidityArg = ProvideLiquidityValuesConfirm;

export type RemoveLiquidityArg = AddLiquidityArg;

export interface CreatePairArg {
  fromToken: Token;
  toToken: Token;
  fromValue: number;
  toValue: number;
}

export interface MakeLimitOrderArg {
  directionPair: DirectionPair;
  pairAddr: string;
  fromValue: number;
  toValue: number;
}

export interface LpToken extends Token {
  pairAddress: string;
}

export type ReduxAction =
  | ReturnType<typeof makeSwapAction>
  | ReturnType<typeof setSwapProcessingAction>
  | ReturnType<typeof setSwapSucceededAction>
  | ReturnType<typeof setSwapFailedAction>
  | ReturnType<typeof addLiquidityAction>
  | ReturnType<typeof setAddLiquidityProcessingAction>
  | ReturnType<typeof setAddLiquiditySucceededAction>
  | ReturnType<typeof setAddLiquidityFailedAction>
  | ReturnType<typeof removeLiquidityAction>
  | ReturnType<typeof setRemoveLiquidityProcessingAction>
  | ReturnType<typeof setRemoveLiquiditySucceededAction>
  | ReturnType<typeof setRemoveLiquidityFailedAction>
  | ReturnType<typeof makeLimitOrderAction>
  | ReturnType<typeof setMakeLimitOrderProcessingAction>
  | ReturnType<typeof setMakeLimitOrderSucceededAction>
  | ReturnType<typeof setMakeLimitOrderFailedAction>
  | ReturnType<typeof connectWalletAction>
  | ReturnType<typeof setConnectWalletProcessingAction>
  | ReturnType<typeof setConnectWalletSucceededAction>
  | ReturnType<typeof setConnectWalletFailedAction>
  | ReturnType<typeof requestTokensFetchAction>
  | ReturnType<typeof setTokensFetchLoadingAction>
  | ReturnType<typeof setTokensFetchSucceededAction>
  | ReturnType<typeof setTokensFetchFailedAction>
  | ReturnType<typeof requestPairsFetchAction>
  | ReturnType<typeof setPairsFetchLoadingAction>
  | ReturnType<typeof setPairsFetchSucceededAction>
  | ReturnType<typeof setPairsFetchFailedAction>
  | ReturnType<typeof requestLpTokensFetchAction>
  | ReturnType<typeof setLpTokensFetchLoadingAction>
  | ReturnType<typeof setLpTokensFetchSucceededAction>
  | ReturnType<typeof setLpTokensFetchFailedAction>
  | ReturnType<typeof setSwapConfirmValues>
  | ReturnType<typeof resetSwapConfirmValues>
  | ReturnType<typeof setMakeLimitOrderConfirmValues>
  | ReturnType<typeof resetMakeLimitOrderConfirmValues>
  | ReturnType<typeof setProvideLiquidityConfirmValues>
  | ReturnType<typeof resetProvideLiquidityConfirmValues>
  | ReturnType<typeof setRemoveLiquidityConfirmValues>
  | ReturnType<typeof resetRemoveLiquidityConfirmValues>
  | ReturnType<typeof setWaitingPopupValues>
  | ReturnType<typeof resetWaitingPopupValues>
  | ReturnType<typeof createPairAction>
  | ReturnType<typeof setCreatePairProcessingAction>
  | ReturnType<typeof setCreatePairSucceededAction>
  | ReturnType<typeof setCreatePairFailedAction>
  | ReturnType<typeof disconnectWalletAction>
  | ReturnType<typeof changeThemeAction>
  | ReturnType<typeof updateSwapWalletsAction>
  | ReturnType<typeof updateLiquidityWalletsAction>
  | ReturnType<typeof setCreatePairConfirmValues>
  | ReturnType<typeof resetCreatePairConfirmValues>
  | ReturnType<typeof updatePairsAction>
  | ReturnType<typeof updateLPtokensAction>;

export type ThemeVariant = "light" | "dark";

export interface BaseIconProps {
  pushRight?: boolean;
  color: string;
  children?: ReactElement;
}

declare module "react-outside-click-handler" {}

export interface LiquidityItemProps {
  lpToken: LpToken;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export interface MainBlockProps {
  button?: ReactElement;
  class?: string;
  classHeader?: string;
  classTitle?: string;
  content: ReactElement;
  error?: boolean;
  footer?: ReactElement;
  helperText?: string;
  normalTitle?: boolean;
  smallTitle?: boolean;
  title?: ReactElement | string;
}

export interface SearchInputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export interface SelectItemProps {
  onClick: MouseEventHandler;
  token: Token;
}

export type SwapButtonProps = ButtonProps;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reduxStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof reduxStore.dispatch;
