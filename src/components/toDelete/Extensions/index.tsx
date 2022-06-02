import React from "react";
import { ClickAwayListener } from "@mui/base";
import SelectPopup from "../SelectPopup";
import { extensions } from "../../../constants/defaultData";
import { ModalUnstyled } from "@mui/material";

export default function Extensions(props: { onClose: any; onSelect: any }) {
  const { onClose, onSelect } = props;

  return (
    <ModalUnstyled open={true} onClose={onClose}>
      <div className="select-wrapper">
        <ClickAwayListener onClickAway={onClose}>
          <SelectPopup
            loading={false}
            onClose={onClose}
            onSelect={(e, item) => onSelect(e, item)}
            tokens={extensions}
            title={"Select extension"}
          />
        </ClickAwayListener>
      </div>
    </ModalUnstyled>
  );
}
