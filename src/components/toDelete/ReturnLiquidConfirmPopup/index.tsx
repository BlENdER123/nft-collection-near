import "./index.scss";

import React from "react";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { iconGenerator } from "../../../iconGenerator";
import {
  removeLiquidityAction,
  resetRemoveLiquidityConfirmValues,
} from "../../../store/actions/app";
import CloseBtn from "../CloseBtn";
import MainBlock from "../MainBlock";

function ReturnLiquidConfirmPopup() {
  const values = useAppSelector((state) => state.removeLiquidityConfirmValues);
  const dispatch = useAppDispatch();

  async function handleRemoveConfirm() {
    dispatch(
      removeLiquidityAction({
        fromToken: values!.fromToken,
        toToken: values!.toToken,
        fromValue: values!.fromValue,
        toValue: values!.toValue,
        lpToken: values!.lpToken,
        lpValue: values!.lpValue,
      }),
    );
  }

  function handleClose() {
    dispatch(resetRemoveLiquidityConfirmValues());
  }

  if (!values) return null;

  return (
    <div className="popup-wrapper confirm-popup">
      <MainBlock
        smallTitle={true}
        button={<CloseBtn onClick={handleClose} />}
        content={
          <>
            <p className="confirm-subtitle">Remove liquidity Confirm</p>
            <div
              className="confirm-block"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className="returnViewDataItem">
                <span className="confirm-value">
                  {values.fromValue.toFixed(4)}
                </span>
                <div className="displayFlex">
                  <img
                    className="confirm-icon"
                    src={iconGenerator(values.fromToken.symbol)}
                    alt={values.fromToken.symbol}
                  />
                  <span className="confirm-tokenF" style={{ fontSize: "22px" }}>
                    {values.fromToken.symbol}
                  </span>
                </div>
              </div>
              <div className="returnViewDataItem">
                <span className="confirm-value">
                  {values.toValue.toFixed(4)}
                </span>
                <div className="displayFlex">
                  <img
                    className="confirm-icon"
                    src={iconGenerator(values.toToken.symbol)}
                    alt={values.toToken.symbol}
                  />
                  <span className="confirm-tokenF" style={{ fontSize: "22px" }}>
                    {values.toToken.symbol}
                  </span>
                </div>
              </div>
            </div>
            {/*<p className="confirm-text">Output is estimated. If the price changes by more than 0.5% your transaction will revert</p>*/}
            <button className="btn popup-btn" onClick={handleRemoveConfirm}>
              Confirm Remove
            </button>
          </>
        }
        // footer={
        //   <div className="mainblock-footer">
        //     <div className="mainblock-footer-wrap">
        //       <div>
        //         <div  className="pool-confirm-wrap">
        //           <p className="mainblock-footer-value">0.0001</p>
        //           <p className="mainblock-footer-subtitle">{fromToken.symbol} deposited</p>
        //         </div>
        //         <div>
        //           <p className="mainblock-footer-value">{parseFloat(props.rateBA.toFixed(4))}</p>
        //           <p className="mainblock-footer-subtitle">{fromToken.symbol} per {toToken.symbol}</p>
        //         </div>
        //       </div>
        //       <div>
        //         <div  className="pool-confirm-wrap">
        //           <p className="mainblock-footer-value">10000003</p>
        //           <p className="mainblock-footer-subtitle">{toToken.symbol} deposited</p>
        //         </div>
        //         <div>
        //           <p className="mainblock-footer-value">{parseFloat(props.rateAB.toFixed(4))}</p>
        //           <p className="mainblock-footer-subtitle">{toToken.symbol} per {fromToken.symbol}</p>
        //         </div>
        //       </div>
        //       <div>
        //         <div  className="pool-confirm-wrap">
        //           <p className="mainblock-footer-value">999785</p>
        //           <p className="mainblock-footer-subtitle">Rates</p>
        //         </div>
        //         <div>
        //           <p className="mainblock-footer-value">&lt;0.01%</p>
        //           <p className="mainblock-footer-subtitle">Share of Pool</p>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // }
      />
    </div>
  );
}

export default ReturnLiquidConfirmPopup;
