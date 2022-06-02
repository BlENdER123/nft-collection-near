import "./index.scss";

import PropTypes from "prop-types";
import React from "react";

import { iconGenerator } from "../../../iconGenerator";
import { SelectItemProps } from "../../../types";
import truncateNum from "../../../utils/truncateNum";

export default function SelectItem({ onClick, token }: SelectItemProps) {
  return (
    // <div className={props.isActive ? "select-item select-item--active" : "select-item"}
    <div className={"select-item swap"} onClick={onClick}>
      <div className="select-item-wrapper">
        <img
          className="item_icon"
          src={iconGenerator(token.symbol)}
          alt={token.symbol}
        />
        <div>
          <p className="select-item-title">{token.symbol}</p>
          <p className="select-item-descr">
            {token.tokenName ? token.tokenName : ""}
          </p>
        </div>
      </div>
      <span className="select-item-balance">
        {token.balance ? truncateNum(token.balance) : ""}
      </span>
    </div>
  );
}

SelectItem.propTypes = {
  onClick: PropTypes.func,
  token: PropTypes.exact({
    // balance: PropTypes.number.isRequired,
    symbol: PropTypes.string.isRequired,
    // tokenName: PropTypes.string.isRequired,
  }),
};

SelectItem.defaultProps = {
  onClick: () => {},
};
