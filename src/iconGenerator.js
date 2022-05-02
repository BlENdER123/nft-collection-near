import TON from "./images/tokens/TON.svg";
import fBTC from "./images/tokens/wBTC.svg";
import fETH from "./images/tokens/wETH.svg";
import USDT from "./images/tokens/wUSDT.svg";
import USDC from "./images/tokens/USDC.svg";
import DAI from "./images/tokens/DAI.svg";
import BNB from "./images/tokens/BNB.svg";
import tonNew from "./images/tokens/tonNew.svg";
import defaultIcon from "./images/tokens/default.svg";
import question from "./images/icons/question.svg";

export function iconGenerator(icon) {
	if (icon.includes("TON")) {
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
		return tonNew;
	} else if (icon.includes("QUESTION")) {
		return question;
	} else {
		return defaultIcon;
	}
}
