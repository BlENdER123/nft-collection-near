import { ClickAwayListener, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import NumberFormat, { NumberFormatProps } from "react-number-format";

import { SlippagePopupProps, VirtualElement } from "../../../types";
import classes from "./index.module.scss";

export default function SlippagePopup({
  anchorEl,
  id,
  onChange,
  onClose,
  value,
}: SlippagePopupProps) {
  return (
    <ClickAwayListener onClickAway={onClose}>
      <Popper
        id={id}
        open
        anchorEl={anchorEl as VirtualElement}
        placement="bottom-start"
        style={{ zIndex: 1 }}
      >
        <Paper variant="outlined" className={classes.paper}>
          <div className={classes.container}>
            <div className={classes.slippageContainer}>
              <div className={classes.title}>Slippage tolerance:</div>
              <PercentageTextField
                placeholder="2%"
                value={value}
                onValueChange={onChange}
                style={{
                  maxHeight: 45,
                  maxWidth: 165,
                }}
              />
            </div>
            <Box sx={{ maxWidth: "236px" }} className={classes.paragraph}>
              Your transaction will revert if the price changes unfavorably by
              more than this percentage
            </Box>
          </div>
        </Paper>
      </Popper>
    </ClickAwayListener>
  );
}

function PercentageTextField(props: NumberFormatProps) {
  return (
    <NumberFormat
      allowNegative={false}
      allowLeadingZeros={false}
      customInput={TextField as any}
      decimalScale={2}
      decimalSeparator="."
      fixedDecimalScale
      displayType="input"
      type="text"
      isAllowed={({ floatValue }) => (floatValue || 0) <= 100}
      suffix="%"
      {...props}
    />
  );
}
