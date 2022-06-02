import question from "./images/icons/question.svg";
import bsc from "./images/networks/bsc.svg";
import ethChain from "./images/networks/eth.png";
import phantom from "./images/networks/phantom.svg";
import polygon from "./images/networks/polygon.svg";
import BNB from "./images/tokens/BNB.svg";
import DAI from "./images/tokens/DAI.svg";
import defaultIcon from "./images/tokens/default.svg";
import TON from "./images/tokens/ton.png";
import USDC from "./images/tokens/USDC.svg";
import fBTC from "./images/tokens/wBTC.svg";
import fETH from "./images/tokens/wETH.svg";
import USDT from "./images/tokens/wUSDT.svg";

export function iconGenerator(icon) {
  if (icon.includes("TON")) {
    return TON;
  } else if (icon.includes("EVER")) {
    return TON;
  } else if (icon.includes("BTC")) {
    return fBTC;
  } else if (icon.includes("ETH")) {
    return fETH;
  } else if (icon.includes("USDT")) {
    return USDT;
  } else if (icon.includes("USDC")) {
    return USDC;
  } else if (icon.includes("DAI")) {
    return DAI;
  } else if (icon.includes("BNB")) {
    return BNB;
  } else if (icon.includes("STACKING")) {
    return TON;
  } else if (icon.includes("QUESTION")) {
    return question;
  } else if (icon.includes("Ethereum")) {
    return ethChain;
  } else if (icon.includes("BSC")) {
    return bsc;
  } else if (icon.includes("Polygon")) {
    return polygon;
  } else if (icon.includes("Fantom")) {
    return phantom;
  } else {
    return defaultIcon;
  }
}
