import "./index.scss";

import ModalUnstyled from "@mui/base/ModalUnstyled";
import React from "react";

import {useAppDispatch} from "../../../hooks/useAppDispatch";
import {useAppSelector} from "../../../hooks/useAppSelector";
import {iconGenerator} from "../../../iconGenerator";
import {createPairAction, resetCreatePairConfirmValues} from "../../../store/actions/app";
import truncateNum from "../../../utils/truncateNum";
import CloseBtn from "../CloseBtn";
import MainBlock from "../MainBlock";

export default function CreatePairConfirmPopup() {
  const dispatch = useAppDispatch();

  const appTheme = useAppSelector((state) => state.appTheme);
  const values = useAppSelector((state) => state.createPairConfirmValues);

  async function handleCreatePair() {
    dispatch(
      createPairAction({
        fromToken: values!.fromToken,
        toToken: values!.toToken,
        fromValue: values!.fromValue,
        toValue: values!.toValue,
      }),
    );
  }

  function handleClose() {
    dispatch(resetCreatePairConfirmValues());
  }

  if (!values) return null;

  return (
    <ModalUnstyled open={Boolean(values)} onClose={handleClose}>
      <div className="popup-wrapper">
        <MainBlock
          button={<CloseBtn onClick={handleClose}/>}
          title={"Create pair Confirm "}
          content={
            <>
              <div className="confirm-block swap-confirm-block">
                <div className="confirm-amounts-wrapper">
                <span className="confirm-token">
                  <img
                    className="confirm-icon"
                    src={iconGenerator(values.fromToken.symbol)}
                    alt={values.fromToken.symbol}
                  />
                  {values.fromValue}
                </span>
                  <span className="confirm-token">
                  <img
                    className="confirm-icon"
                    src={iconGenerator(values.toToken.symbol)}
                    alt={values.toToken.symbol}
                  />
                    {truncateNum(values.toValue)}
                </span>
                </div>
                {appTheme === "light" ? (
                  <svg
                    width="68"
                    height="19"
                    viewBox="0 0 68 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M0.897098 10.5H64.9499L58.8496 17.3C58.4908 17.7 58.4908 18.3 58.8496 18.7C59.029 18.9 59.2982 19 59.4776 19C59.657 19 59.9261 18.9 60.1055 18.7L67.7309 10.2C68.0897 9.8 68.0897 9.2 67.7309 8.8L60.1055 0.3C59.7467 -0.1 59.2084 -0.1 58.8496 0.3C58.4908 0.7 58.4908 1.3 58.8496 1.7L64.9499 8.5H0.897098C0.358839 8.5 0 8.9 0 9.5C0 10.1 0.358839 10.5 0.897098 10.5Z"
                      fill="url(#paint0_linear)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="68.0035"
                        y1="9.49999"
                        x2="-13.031"
                        y2="-17.3695"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#41444E"/>
                        <stop offset="1" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                ) : (
                  <svg
                    className="swap-confirm-arrow"
                    width="68"
                    height="20"
                    viewBox="0 0 68 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M0.897098 11H64.9499L58.8496 17.8C58.4908 18.2 58.4908 18.8 58.8496 19.2C59.029 19.4 59.2982 19.5 59.4776 19.5C59.657 19.5 59.9261 19.4 60.1055 19.2L67.7309 10.7C68.0897 10.3 68.0897 9.7 67.7309 9.3L60.1055 0.8C59.7467 0.4 59.2084 0.4 58.8496 0.8C58.4908 1.2 58.4908 1.8 58.8496 2.2L64.9499 9H0.897098C0.358839 9 0 9.4 0 10C0 10.6 0.358839 11 0.897098 11Z"
                      fill="url(#paint0_linear)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="68.0035"
                        y1="9.99999"
                        x2="-13.031"
                        y2="-16.8695"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                )}
                <span className="confirm-token">
                  <img
                    className="confirm-icon"
                    src={iconGenerator(values.fromToken.symbol)}
                    alt={values.fromToken.symbol}
                  />
                  <img
                    className="confirm-icon"
                    src={iconGenerator(values.toToken.symbol)}
                    alt={values.toToken.symbol}
                  />
                  {`DS-${values.fromToken.symbol}/${values.toToken.symbol}`}
                </span>
              </div>
              <button className="btn popup-btn" onClick={() => handleCreatePair()}>
                Submit
              </button>
            </>
          }
          footer={
            <div className="mainblock-footer">
              <div className="mainblock-footer-wrap">
                  <div className="swap-confirm-wrap">
                    <p className="mainblock-footer-value">
                      {truncateNum(values.fromValue / values.toValue)}
                    </p>
                    <p className="mainblock-footer-subtitle">
                      Rate {values.fromToken.symbol}/{values.toToken.symbol}
                    </p>
                  </div>
                  <div className="swap-confirm-wrap">
                    <p className="mainblock-footer-value">
                      {truncateNum(values.toValue / values.fromValue)}
                    </p>
                    <p className="mainblock-footer-subtitle">
                      Rate {values.toToken.symbol}/{values.fromToken.symbol}
                    </p>
                  </div>
              </div>
            </div>
          }
        />
      </div>
    </ModalUnstyled>
  );
}
