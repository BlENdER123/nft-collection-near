import { ClickAwayListener } from "@mui/base";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import PropTypes from "prop-types";
import React, { MouseEventHandler, useMemo, useState } from "react";

import { SelectPopupProps, Token } from "../../../types";
import includesTextInToken from "../../../utils/includesTextInToken";
import CloseBtn from "../CloseBtn";
import Loader from "../Loader";
import MainBlock from "../MainBlock";
import SearchInput from "../SearchInput";
import SelectItem from "../SelectItem";
import classes from "./index.module.scss";

export default function SelectPopup({
  loading,
  onClose,
  onSelect,
  tokens,
  title,
}: SelectPopupProps) {
  const [searchWord, setSearchWord] = useState("");
  const filteredTokens = useMemo(
    () =>
      tokens
        // .sort((a, b) => b.balance - a.balance)
        .filter((t: Token) => includesTextInToken(t, searchWord)),
    [tokens, searchWord],
  );

  function handleTokenSelect(
    e: MouseEvent | TouchEvent | React.MouseEvent<Element, MouseEvent>,
    t: Token,
  ) {
    onSelect(e as MouseEvent, t);
    (onClose as (event: MouseEvent | TouchEvent) => void)(e as MouseEvent);
  }

  return (
    <ModalUnstyled open onClose={onClose}>
      <div className={classes["select-wrapper"]}>
        <ClickAwayListener
          onClickAway={onClose as (event: MouseEvent | TouchEvent) => void}
        >
          <MainBlock
            title={title}
            button={<CloseBtn onClick={onClose as MouseEventHandler} />}
            content={
              loading ? (
                <Loader className={classes.loader} />
              ) : (
                <>
                  <SearchInput
                    onChange={(e) => setSearchWord(e.target.value)}
                  />
                  <div className={classes["select-list"]}>
                    {!filteredTokens.length && (
                      <p style={{ textAlign: "center" }}>No tokens found</p>
                    )}
                    {filteredTokens.map((t: Token) => (
                      <SelectItem
                        token={t}
                        key={t.rootAddress}
                        onClick={(e) => handleTokenSelect(e, t)}
                      />
                    ))}
                  </div>
                </>
              )
            }
          />
        </ClickAwayListener>
      </div>
    </ModalUnstyled>
  );
}

SelectPopup.propTypes = {
  loading: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  tokens: PropTypes.any,
};

SelectPopup.defaultProps = {
  loading: false,
  onClose: () => {},
  onSelect: () => {},
  tokens: [],
  title: "Select a token",
};
