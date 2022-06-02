import { useState } from "react";

import { Token, UseSelectPopupArg } from "../types";

export default function useSelectPopup(setToken: UseSelectPopupArg) {
  const [open, setOpen] = useState(false);

  function handleSelect(e: MouseEvent | TouchEvent, t: Token) {
    setToken(t);
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return {
    handleClose,
    handleOpen,
    handleSelect,
    open,
  };
}
