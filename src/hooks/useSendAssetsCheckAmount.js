import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
	NOT_ENOUGH,
	NOT_ENOUGH_CAUSE_COMMISSION,
	NOT_SELECTED_TOKEN,
} from "../constants/validationMessages";
import {SEND_TOKEN} from "../constants/commissions";
import useAssetList from "./useAssetList";

/**
 * Special case hook for "/assets/send" modal window for amount check
 *
 * @returns {HookReturn}
 *
 * @typedef {object} HookReturn
 * @property {boolean} invalid
 * @property {string} validationMsg
 */
export default function useSendAssetsCheckAmount() {
	const [state, setState] = useState({
		invalid: undefined,
	});

	const amountToSend = useSelector(
		(state) => state.walletSeedReducer.amountToSend,
	);
	const currentTokenForSend = useSelector(
		(state) => state.walletSeedReducer.currentTokenForSend,
	);

	const tokenSetted = useSelector(
		(state) => state.walletSeedReducer.tokenSetted,
	);

	const {assetList} = useAssetList();

	useEffect(() => {
		const tonAsset = assetList.find((t) => t.symbol === "TON Crystal");

		if (!tokenSetted && amountToSend) {
			setState({
				invalid: true,
				validationMsg: NOT_SELECTED_TOKEN,
			});
		} else if (
			(currentTokenForSend.type === "Native Tons" ||
				currentTokenForSend.type === "PureToken") &&
			currentTokenForSend.balance - amountToSend < 0
		) {
			setState({
				invalid: true,
				validationMsg: NOT_ENOUGH,
			});
		} else if (
			currentTokenForSend.type === "PureToken" &&
			currentTokenForSend.balance - amountToSend < 0 &&
			tonAsset.balance - SEND_TOKEN < 0
		) {
			setState({
				invalid: true,
				validationMsg: NOT_ENOUGH_CAUSE_COMMISSION,
			});
		} else if (
			currentTokenForSend.type === "Native Tons" &&
			currentTokenForSend.balance - amountToSend - SEND_TOKEN < 0
		) {
			setState({
				invalid: true,
				validationMsg: NOT_ENOUGH_CAUSE_COMMISSION,
			});
		} else {
			setState({
				invalid: false,
			});
		}
	}, [amountToSend, tokenSetted]);

	return state;
}
