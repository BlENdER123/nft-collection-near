import { useFormik } from "formik";
import compact from "lodash/compact";
import find from "lodash/find";
import reject from "lodash/reject";
import React, { useEffect, useMemo, useState } from "react";
import { NumberFormatValues } from "react-number-format";

import { AB_DIRECTION, BA_DIRECTION } from "../../../constants/runtimeVariables";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import useSelectPopup from "../../../hooks/useSelectPopup";
import {setCreatePairConfirmValues,setCreatePairSucceededAction } from "../../../store/actions/app";
import {
  ButtonProps,
  Pair,
  SwapErrorsFormik,
  SwapValuesFormik,
  SwapValuesConfirm,
  Token,
} from "../../../types";
import truncateNum from "../../../utils/truncateNum";
import filterHelper from "../../../utils/filterObjectByStringObj";
import Button from "../Button";
import Input from "../Input";
import MainBlock from "../MainBlock";
import SelectPopup from "../SelectPopup";
import SlippagePopup from "../SlippagePopup";
import SwapButton from "../SwapButton";
import {useNavigate} from "react-router-dom";

 
export default function CreatePairPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const walletConnected = useAppSelector((state) => state.client);
  const tokens: Token[] = useAppSelector((state) => state.tokens);
  const pairs: Pair[] = useAppSelector((state) => state.pairs);

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    values,
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
    onSubmit: handleCreatePair,
    validate,
  });

  const fromTokens = useMemo(() => {
    if (!values.toToken) return tokens;
    let leftTokens = reject(tokens, values.toToken);

    const leftPairs = pairs.filter(
      (p) =>
        p.rootA === values.toToken?.rootAddress ||
        p.rootB === values.toToken?.rootAddress,
    );
    const leftTok: string[] = [];

    leftPairs.map(p=>{
      leftTok.push(p.symbolA === values.fromToken?.symbol ? p.symbolB : p.symbolA)
    })
    leftTokens = filterHelper.call(leftTokens,
      'symbol', leftTok
    );

    return compact(leftTokens);
  }, [tokens, pairs, values.toToken]);
  
  const toTokens = useMemo(() => {
    if (!values.fromToken) return tokens;
    let leftTokens = reject(tokens, values.fromToken);

    const leftPairs = pairs.filter(
      (p) =>
        p.rootA === values.fromToken?.rootAddress ||
        p.rootB === values.fromToken?.rootAddress 
    );
    
    const leftTok: string[] = [];
    
    leftPairs.map(p=>{
      leftTok.push(p.symbolA === values.fromToken?.symbol ? p.symbolB : p.symbolA)
    })

    leftTokens = filterHelper.call(leftTokens,
      'symbol', leftTok
    );

    return compact(leftTokens);
  }, [tokens, pairs, values.fromToken]);

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
    if (directionPair)
      return directionPair === AB_DIRECTION
        ? values.pair?.rateAB
        : values.pair?.rateBA;
  }, [directionPair, values.pair]);

  // Calculate "To" value
  // useEffect(() => {
  //   setFieldValue("toValue", (values.fromValue || 0) * (rate || 0));
  // }, [values.fromValue, rate, setFieldValue]);

  function handleCreatePair(values: SwapValuesFormik) {
    dispatch(setCreatePairConfirmValues(values as SwapValuesConfirm));

    
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleConnectWallet() {
    // dispatch(connectWalletAction());
    navigate("/account")
  }
  // function createPair() {
  //   // dispatch(connectWalletAction());
  //   navigate("/account")
  // }
  function handleTokensInvert() {
    setFieldValue("fromToken", values.toToken);
    setFieldValue("toToken", values.fromToken);
    setFieldValue("fromValue", values.toValue);
    setFieldValue("toValue", values.fromValue);
  }

  function handleMaxClick(e: React.MouseEvent<Element, MouseEvent>) {
    let type = e.currentTarget.id
   if(type === "fromValue"){
     setFieldValue("fromValue", values.fromToken?.balance);
   }else{
     setFieldValue("toValue", values.toToken?.balance);
   }
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
        props.children = "Create pair";
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
        find(tokens, { rootAddress: values.fromToken.rootAddress }),
      );
    if (values.toToken)
      setFieldValue(
        "toToken",
        find(tokens, { rootAddress: values.toToken.rootAddress }),
      );
  }, [values.fromToken, values.toToken, tokens, setFieldValue]);

  // Update selected pair rate after swap
  useEffect(() => {
    if (values.pair)
      setFieldValue(
        "pair",
        find(pairs, { pairAddress: values.pair.pairAddress }),
      );
  }, [values.pair, pairs, setFieldValue]);

  const selectFromPopup = useSelectPopup((t) => setFieldValue("fromToken", t));
  const selectToPopup = useSelectPopup((t) => setFieldValue("toToken", t));

  return (
    <>
      <div className="container">
        <MainBlock
          content={
            <div style={{ display: "contents" }}>
              <div className="head_wrapper" style={{ marginBottom: "40px" }}>
                <div
                  className="left_block"
                >
                  Create pair
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <Input
                  label="Token A"
                  name="fromValue"
                  value={values.fromValue}
                  onMaxClick={handleMaxClick}
                  onValueChange={handleChange}
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
                  label="Token B"
                  name="toValue"
                  value={values.toValue}
                  onMaxClick={handleMaxClick}
                  onValueChange={handleChange}
                  onValueBlur={handleBlur}
                  onSelectClick={selectToPopup.handleOpen}
                  token={values.toToken}
                  error={Boolean(
                    touched.toValue && (errors.toValue || errors.toToken)
                  )}
                  helperText={
                    (touched.toValue && (errors.toToken || errors.toValue))
                      ? errors.toValue || errors.toToken
                      : ""
                  }
                />
                <CurrentButton />
                {rate ? (
                  <p className="swap-rate">
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
    </>
  );
}

function validate(values: SwapValuesFormik) {
  const errors: SwapErrorsFormik = {};

  const MUST_BE_NUMBER = "Input value must be a number";
  const POSITIVE_NUMBER = "Use positive number";
  const SELECT_TOKEN = "You must select token";
  const BALANCE_EXCEEDS = "Input value exceeds balance";

  if (isNaN(+values.fromValue)) errors.fromValue = MUST_BE_NUMBER;
  else if (values.fromValue <= 0) errors.fromValue = POSITIVE_NUMBER;
  // if (values.toValue <= 0) errors.toValue = POSITIVE_NUMBER;
  if (isNaN(+values.toValue)) errors.toValue = MUST_BE_NUMBER;
  else if (values.toValue <= 0) errors.toValue = POSITIVE_NUMBER;

  if (!values.fromToken) errors.fromToken = SELECT_TOKEN;
  else if (values.fromValue > values.fromToken.balance)
    errors.fromToken = BALANCE_EXCEEDS;


  if (!values.toToken) errors.toToken = SELECT_TOKEN;
  if (values.toToken && values.toValue > values.toToken.balance)
    errors.toToken = BALANCE_EXCEEDS;
  console.log(errors)
  return errors;
}
