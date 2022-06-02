import { FormHelperText } from "@mui/material";
import cls from "classnames";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

import { iconGenerator } from "../../../iconGenerator";
import { InputProps } from "../../../types";
import truncateNum from "../../../utils/truncateNum";
import classes from "./index.module.scss";

export default function Input({
  autoFocus,
  className,
  error,
  helperText,
  label,
  name,
  notExact,
  onMaxClick,
  onSelectClick,
  onValueBlur,
  onValueChange,
  readOnly,
  token,
  value,
  ref
}: InputProps) {
  const currentLabel = useMemo(() => {
    if (notExact && value) return `${label} (estimated)`;
    else return label;
  }, [label, notExact, value]);

  return (
    <>
      <div
        className={cls(className, classes.input)}
        style={{
          borderColor: error ? "var(--error)" : "var(--input-border-color)",
        }}
      >
        <div className={classes.input_wrapper}>
          <span className={classes.input_title}>{currentLabel}</span>
          <span className={cls(classes.input_balance, { incorBalance: error })}>
            {token && `Balance: ${truncateNum(token.balance)}`}
          </span>
        </div>
        <div className={classes.input_wrapper}>
          <input
            type="number"
            className={classes.input_field}
            name={name}
            ref={ref}
            value={truncateNum(value)}
            onChange={onValueChange}
            onBlur={onValueBlur}
            autoFocus={autoFocus}
            placeholder="0"
            readOnly={readOnly}
          />

          {!token ? (
            <button
              className={cls("btn", classes.input_btn)}
              onClick={onSelectClick}
              type="button"
            >
              Select a token
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.06066 0.93934C2.47487 0.353553 1.52513 0.353553 0.93934 0.93934C0.353553 1.52513 0.353553 2.47487 0.93934 3.06066L3.06066 0.93934ZM8 8L6.93934 9.06066C7.52513 9.64645 8.47487 9.64645 9.06066 9.06066L8 8ZM15.0607 3.06066C15.6464 2.47487 15.6464 1.52513 15.0607 0.93934C14.4749 0.353553 13.5251 0.353553 12.9393 0.93934L15.0607 3.06066ZM0.93934 3.06066L6.93934 9.06066L9.06066 6.93934L3.06066 0.93934L0.93934 3.06066ZM9.06066 9.06066L15.0607 3.06066L12.9393 0.93934L6.93934 6.93934L9.06066 9.06066Z"
                  fill="white"
                />
              </svg>
            </button>
          ) : (
            <>
              {onMaxClick && (
                <button
                  className={classes.input_max}
                  onClick={(e)=>onMaxClick(e)}
                  type="button"
                  id={name}
                >
                  MAX
                </button>
              )}
              <button
                className={classes.input_select}
                onClick={onSelectClick}
                type="button"
              >
                <img
                  src={iconGenerator(token.symbol)}
                  alt={token.symbol}
                  className={classes.input_token_img}
                />
                <span>{token.symbol}</span>
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.06066 0.93934C2.47487 0.353553 1.52513 0.353553 0.93934 0.93934C0.353553 1.52513 0.353553 2.47487 0.93934 3.06066L3.06066 0.93934ZM8 8L6.93934 9.06066C7.52513 9.64645 8.47487 9.64645 9.06066 9.06066L8 8ZM15.0607 3.06066C15.6464 2.47487 15.6464 1.52513 15.0607 0.93934C14.4749 0.353553 13.5251 0.353553 12.9393 0.93934L15.0607 3.06066ZM0.93934 3.06066L6.93934 9.06066L9.06066 6.93934L3.06066 0.93934L0.93934 3.06066ZM9.06066 9.06066L15.0607 3.06066L12.9393 0.93934L6.93934 6.93934L9.06066 9.06066Z"
                    fill="white"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      {helperText && (
        <FormHelperText error={error} className={classes.helper_text}>
          {helperText}
        </FormHelperText>
      )}
    </>
  );
}

Input.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  notExact: PropTypes.bool,
  onMaxClick: PropTypes.func,
  onSelectClick: PropTypes.func.isRequired,
  onValueBlur: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  ref: PropTypes.any,
  readOnly: PropTypes.bool,
  token: PropTypes.exact({
    balance: PropTypes.number.isRequired,
    decimals: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    owner_address: PropTypes.string.isRequired,
    rootAddress: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    tokenName: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    walletAddress: PropTypes.string.isRequired,
  }),
  touched: PropTypes.bool,
  value: PropTypes.number.isRequired,
};

Input.defaultProps = {
  autoFocus: false,
  className: null,
  error: false,
  helperText: "Type numeric value",
  notExact: false,
  onMaxClick: null,
  readOnly: false,
  token: null,
  touched: false,
  walletAddress: null,
};
