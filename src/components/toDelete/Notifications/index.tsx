import { useSnackbar } from "notistack";
import { useEffect } from "react";

import { useAppSelector } from "../../../hooks/useAppSelector";
import {
  CREATE_PAIR_FAILED,
  CREATE_PAIR_SUCCEEDED, CREATING_PAIR,
  ADDING_LIQUIDITY,
  ADD_LIQUIDITY_FAILED,
  ADD_LIQUIDITY_SUCCEEDED,
  REMOVE_LIQUIDITY_FAILED,
  REMOVE_LIQUIDITY_SUCCEEDED,
  REMOVING_LIQUIDITY,
  SWAP_FAILED,
  SWAP_HAPPENING,
  SWAP_SUCCEEDED,
} from "../../../store/actions/types";

export default function Notifications() {
  const { enqueueSnackbar } = useSnackbar();
  const tips = useAppSelector((state) => state.tips);

  useEffect(() => {
    if (tips.length === 0) return;

    switch (tips[tips.length - 1]) {
      case SWAP_HAPPENING:
        enqueueSnackbar({
          type: "info",
          message: "Swap process in progress",
        });
        break;
      case SWAP_SUCCEEDED:
        enqueueSnackbar({
          type: "success",
          message: "Swap successfully finished",
        });
        break;
      case SWAP_FAILED:
        enqueueSnackbar({
          type: "error",
          message: "Swap, unfortunately, failed",
        });
        break;
      case REMOVING_LIQUIDITY:
        enqueueSnackbar({
          type: "info",
          message: "Remove liquidity process in progress",
        });
        break;
      case REMOVE_LIQUIDITY_SUCCEEDED:
        enqueueSnackbar({
          type: "success",
          message: "Remove liquidity successfully finished",
        });
        break;
      case REMOVE_LIQUIDITY_FAILED:
        enqueueSnackbar({
          type: "success",
          message: "Remove liquidity, unfortunately, failed",
        });
        break;
      case CREATE_PAIR_SUCCEEDED:
        enqueueSnackbar({
          type: "success",
          message: "Create pair successfully finished",
        });
        break;
      case CREATING_PAIR:
        enqueueSnackbar({
          type: "success",
          message: "Create pair process in progress",
        });
        break;
      case CREATE_PAIR_FAILED:
        enqueueSnackbar({
          type: "success",
          message: "Create pair, unfortunately, failed",
        });
        break;
      case ADDING_LIQUIDITY:
        enqueueSnackbar({
          type: "info",
          message: "Add liquidity process in progress",
        });
        break;
      case ADD_LIQUIDITY_SUCCEEDED:
        enqueueSnackbar({
          type: "success",
          message: "Add liquidity successfully finished",
        });
        break;
      case ADD_LIQUIDITY_FAILED:
        enqueueSnackbar({
          type: "success",
          message: "Add liquidity, unfortunately, failed",
        });
        break;
      default:
        console.log("Unhandled notification - ", tips[tips.length - 1]);
    }
  }, [tips, enqueueSnackbar]);

  return null;
}
