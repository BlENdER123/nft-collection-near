import "./index.scss";

import {useFormik} from "formik";
import compact from "lodash/compact";
import find from "lodash/find";
import reject from "lodash/reject";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {NumberFormatValues} from "react-number-format";

import {AB_DIRECTION, BA_DIRECTION} from "../../../constants/runtimeVariables";
import {useAppDispatch} from "../../../hooks/useAppDispatch";
import {useAppSelector} from "../../../hooks/useAppSelector";
import useSelectPopup from "../../../hooks/useSelectPopup";
import {setSwapConfirmValues} from "../../../store/actions/app";
import {
  ButtonProps,
  Pair,
  SwapErrorsFormik,
  SwapValuesConfirm,
  SwapValuesFormik,
  Token,
  UseSlippagePopupArg,
} from "../../../types";
import truncateNum from "../../../utils/truncateNum";
import Button from "../Button";
import Input from "../Input";
import MainBlock from "../MainBlock";
import SelectPopup from "../SelectPopup";
import SettingsButton from "../SettingsButton";
import SlippagePopup from "../SlippagePopup";
import SwapButton from "../SwapButton";
import {useNavigate} from "react-router-dom";

export default function SwapPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const walletConnected = useAppSelector((state) => state.client);
  const tokens: Token[] = useAppSelector((state) => state.tokens);
  const pairs: Pair[] = useAppSelector((state) => state.pairs);
  const [lastToched, setLastTouced] = useState("")
  const toInputRef = useRef("");
  const fromInputRef = useRef("");
  
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    values,
    dirty,
  } = useFormik<SwapValuesFormik>({
    initialValues: {
      fromToken: null,
      fromValue: "",
      pair: null,
      slippage: 5,
      toToken: null,
      toValue: "",
      name:""
    },
    onSubmit: handleSwap,
    validate,
    enableReinitialize: true,
  });

  const fromTokens = useMemo(() => {
    if (!values.toToken) return tokens;
    let leftTokens = reject(tokens, values.toToken);

    const leftPairs = pairs.filter(
      (p) =>
        p.rootA === values.toToken?.rootAddress ||
        p.rootB === values.toToken?.rootAddress,
    );
    leftTokens = leftPairs.map(
      (p) =>
        find(leftTokens, {rootAddress: p.rootA}) ||
        find(leftTokens, {rootAddress: p.rootB}),
    ) as Token[];

    return compact(leftTokens);
  }, [tokens, pairs, values.toToken]);

  const toTokens = useMemo(() => {
    if (!values.fromToken) return tokens;
    let leftTokens = reject(tokens, values.fromToken);

    const leftPairs = pairs.filter(
      (p) =>
        p.rootA === values.fromToken?.rootAddress ||
        p.rootB === values.fromToken?.rootAddress,
    );
    leftTokens = leftPairs.map(
      (p) =>
        find(leftTokens, {rootAddress: p.rootA}) ||
        find(leftTokens, {rootAddress: p.rootB}),
    ) as Token[];

    return compact(leftTokens);
  }, [tokens, pairs, values.fromToken]);
  function handleChangeValues(e: any){
    setLastTouced(e.currentTarget.name)
    handleChange(e)

  }
  // Find the pair
  useEffect(() => {
    if (!pairs.length || !values.fromToken || !values.toToken) return;
    setFieldValue(
      "pair",
      find(pairs, {
        rootA: values.fromToken.rootAddress,
        rootB: values.toToken.rootAddress,
      }) ||
      find(pairs, {
        rootA: values.toToken.rootAddress,
        rootB: values.fromToken.rootAddress,
      }),
    );
  }, [pairs, values.fromToken, values.toToken, setFieldValue]);

  const directionPair = useMemo(() => {
    if (values.fromToken && values.pair)
      return values.fromToken.rootAddress === values.pair.rootA
        ? AB_DIRECTION
        : BA_DIRECTION;
  }, [values.fromToken, values.pair]);

  const rate = useMemo(() => {
    setFieldValue("toValue", (values.fromValue || 0) * ((directionPair === "4" ? values.pair?.rateAB : values.pair?.rateBA) || 0));
    if (directionPair)
      return directionPair === AB_DIRECTION
        ? values.pair?.rateAB
        : values.pair?.rateBA;
  }, [directionPair, values.pair]);


  // Calculate "To" value
  useEffect(() => {
    if (!values.fromToken && !values.toToken) return
    if(lastToched==="fromValue"){
      setFieldValue("toValue", (values.fromValue || 0) * ((directionPair === "4" ? values.pair?.rateAB : values.pair?.rateBA) || 0));
    }
    if(lastToched==="toValue"){
       setFieldValue("fromValue", (values.toValue || 0) * ((directionPair === "4" ? values.pair?.rateBA : values.pair?.rateAB) || 0));
    }

  }, [values.fromValue,values.toValue]);
  
  function handleSwap(values: SwapValuesFormik) {
    dispatch(setSwapConfirmValues(values as SwapValuesConfirm));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleConnectWallet() {
    // dispatch(connectWalletAction());
    navigate("/account");
  }

  function handleTokensInvert() {
    setFieldValue("fromToken", values.toToken);
    setFieldValue("toToken", values.fromToken);
    setFieldValue("fromValue", values.toValue);
    setFieldValue("toValue", values.fromValue);
  }

  function handleMaxClick() {
    setFieldValue("fromValue", values.fromToken?.balance);
  }

  const currentState = useMemo(() => {
    if (!walletConnected) return "CONNECT_WALLET";
    else return "DO_SWAP";
  }, [walletConnected]);

  const CurrentButton = useMemo(() => {
    const props = {
      className: "mainblock-btn",
    } as ButtonProps;

    switch (currentState) {
      case "CONNECT_WALLET":
        props.children = "Connect wallet";
        props.onClick = handleConnectWallet;
        props.type = "button";
        break;
      default:
        props.children = "Swap";
        props.type = "submit";
    }

    return function CurrentButton(p: ButtonProps) {
      return <Button {...props} {...p} />;
    };
  }, [currentState, handleConnectWallet]);

  // Update selected token balance after swap
  useEffect(() => {
    if (values.fromToken)
      setFieldValue(
        "fromToken",
        find(tokens, {rootAddress: values.fromToken.rootAddress}),
      );
    if (values.toToken)
      setFieldValue(
        "toToken",
        find(tokens, {rootAddress: values.toToken.rootAddress}),
      );
  }, [values.fromToken, values.toToken, tokens, setFieldValue]);

  // Update selected pair rate after swap
  useEffect(() => {
    if (values.pair)
      setFieldValue(
        "pair",
        find(pairs, {pairAddress: values.pair.pairAddress}),
      );
  }, [values.pair, pairs, setFieldValue]);

  const slippagePopup = useSlippagePopup((v) => setFieldValue("slippage", v));
  const selectFromPopup = useSelectPopup((t) => setFieldValue("fromToken", t));
  const selectToPopup = useSelectPopup((t) => setFieldValue("toToken", t));

  return (
    <>
      <div className="container">
        <MainBlock
          content={
            <div style={{display: "contents"}}>
              <div className="head_wrapper" style={{marginBottom: "40px"}} onClick={() => console.log(values)}>
                <div
                  className="left_block"
                >
                  Swap
                </div>
                <div className="settings_btn_container">
                  <SettingsButton
                    aria-describedby={slippagePopup.id}
                    onClick={slippagePopup.handleClick}
                  />
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <Input
                  label="From"
                  ref={toInputRef}
                  name="fromValue"
                  value={values.fromValue}
                  onMaxClick={handleMaxClick}
                  onValueChange={(e)=>handleChangeValues(e)}
                  onValueBlur={handleBlur}
                  onSelectClick={selectFromPopup.handleOpen}
                  token={values.fromToken}
                  error={Boolean(
                    touched.fromValue && (errors.fromValue || errors.fromToken),
                  )}
                  helperText={
                    touched.fromValue && (errors.fromValue || errors.fromToken)
                      ? errors.fromValue || errors.fromToken
                      : ""
                  }
                />
                <SwapButton
                  onClick={handleTokensInvert}
                  className="swap-btn"
                  type="button"
                />
                <Input
                  className="input"
                  label="To"
                  name="toValue"
                  ref={fromInputRef}
                  // notExact
                  value={values.toValue}
                  onValueChange={(e)=>handleChangeValues(e)}
                  onValueBlur={handleBlur}
                  onSelectClick={selectToPopup.handleOpen}
                  token={values.toToken}
                  error={Boolean(touched.toToken && errors.toToken)}
                  helperText={
                    (touched.toToken && errors.toToken) ||
                    "Field is automatically calculated"
                  }
                  // readOnly
                />
                <CurrentButton/>
                {rate ? (
                  <p className="swap-rate">
                    Price{" "}
                    Price{" "}
                    <span>
                      {truncateNum(rate)} {values.toToken?.symbol}
                    </span>{" "}
                    per <span>1 {values.fromToken?.symbol}</span>
                  </p>
                ) : null}
              </form>
            </div>
          }
          footer={
            values.fromToken &&
            values.toToken &&
            ((
              <div className="mainblock-footer">
                <div
                  className="mainblock-footer-wrap"
                  style={{justifyContent: "space-around"}}
                >
                  <div className="swap-confirm-wrap">
                    <p className="mainblock-footer-value">
                      {truncateNum(
                        (values.toValue || 0) -
                        ((values.toValue || 0) * values.slippage) / 100,
                      )}{" "}
                      {values.toToken.symbol}
                    </p>
                    <p className="mainblock-footer-subtitle">
                      Minimum <br/> received
                    </p>
                  </div>
                  <div className="swap-confirm-wrap">
                    <p className="mainblock-footer-value">
                      {values.pair
                        ? truncateNum(((values.fromValue || 0) * 0.3) / 100)
                        : 0.0}{" "}
                      {values.fromToken.symbol}
                    </p>
                    <p className="mainblock-footer-subtitle">
                      Liquidity <br/> Provider Fee
                    </p>
                  </div>
                </div>
              </div>
            ) as any)
          }
        />
      </div>
      {selectFromPopup.open && (
        <SelectPopup
          tokens={fromTokens}
          onClose={selectFromPopup.handleClose}
          onSelect={selectFromPopup.handleSelect}
        />
      )}
      {selectToPopup.open && (
        <SelectPopup
          tokens={toTokens}
          onClose={selectToPopup.handleClose}
          onSelect={selectToPopup.handleSelect}
        />
      )}
      {slippagePopup.open && (
        <SlippagePopup
          id={slippagePopup.id}
          open={slippagePopup.open}
          anchorEl={slippagePopup.anchorEl}
          onClose={slippagePopup.handleClick}
          value={values.slippage}
          onChange={slippagePopup.handleChange}
        />
      )}
    </>
  );
}

function useSlippagePopup(setValue: UseSlippagePopupArg) {
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);

  function handleClick(
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | MouseEvent
      | TouchEvent,
  ) {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  function handleChange({floatValue}: NumberFormatValues) {
    setValue(floatValue as number);
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return {
    anchorEl,
    handleChange,
    handleClick,
    id,
    open,
  };
}

function validate(values: SwapValuesFormik) {
  const errors: SwapErrorsFormik = {};

  const MUST_BE_NUMBER = "Input value must be a number";
  const POSITIVE_NUMBER = "Use positive number";
  const SELECT_TOKEN = "You must select token";
  const BALANCE_EXCEEDS = "Input value exceeds balance";

  if (isNaN(+values.fromValue)) errors.fromValue = MUST_BE_NUMBER;
  else if (values.fromValue <= 0) errors.fromValue = POSITIVE_NUMBER;

  if (isNaN(+values.toValue)) errors.toValue = MUST_BE_NUMBER;
  else if (values.toValue <= 0) errors.toValue = POSITIVE_NUMBER;

  if (!values.fromToken) errors.fromToken = SELECT_TOKEN;
  else if (values.fromValue > values.fromToken.balance)
    errors.fromToken = BALANCE_EXCEEDS;

  if (!values.toToken) errors.toToken = SELECT_TOKEN;

  return errors;
}
