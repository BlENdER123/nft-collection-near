import {useRef, useState, useEffect} from "react";
import {useSelector} from "react-redux";
import tonClient, {
	getDetailsFromTONtokenWallet,
	getExpectedWalletAddressByOwner,
} from "../extensions/webhook/script";
import {Account} from "@tonclient/appkit";
import {TONTokenWalletContract} from "../extensions/contracts/TONTokenWallet";

const DEFAULT_VALIDATION_MSG = "Incorrect address";
const VALIDATION_MSG_ROOTS_ERROR = "Incorrect wallet owner address";
const VALIDATION_MSG_ROOTS_SUC = "Complete";
const INCORRECT_LENGTH = "Incorrect address length";
const NOT_TON_VALID_ADDRESS = "Incorrect TON blockchain address";
const NOT_INITIALIZED = "Account not initialized";
const FROZEN = "Account frozen";
const UNKNOWN_ERROR = "Something went wrong";

const re = /.:.{64}/;

/**
 * Special case hook for "/assets/send" modal window for address check
 *
 * @returns {HookReturn}
 *
 * @typedef {object} HookReturn
 * @property {boolean} invalid
 * @property {boolean} loading
 * @property {string} validationMsg
 */
export default function useSendAssetsCheckAddress() {
	const [state, setState] = useState({
		invalid: undefined,
		loading: false,
		validationMsg: DEFAULT_VALIDATION_MSG,
	});

	const addressToSend = useSelector(
		(state) => state.walletSeedReducer.addressToSend,
	);

	const currentTokenForSend = useSelector(
		(state) => state.walletSeedReducer.currentTokenForSend,
	);

	useEffect(async () => {
		if (!re.test(addressToSend)) {
			setState({
				invalid: true,
				loading: false,
				validationMsg: INCORRECT_LENGTH,
			});
			return;
		}

		try {
			await tonClient.utils.convert_address({
				address: addressToSend,
				output_format: {
					type: "Hex",
				},
			});
		} catch {
			setState({
				invalid: true,
				loading: false,
				validationMsg: NOT_TON_VALID_ADDRESS,
			});
			return;
		}

		const acc = new Account(
			{
				abi: TONTokenWalletContract.abi,
				tvc: TONTokenWalletContract.tvc,
			},
			{client: tonClient},
		);

		const {acc_type} = await acc.getAccount();

		if (acc_type === 0) {
			setState({
				invalid: true,
				loading: false,
				validationMsg: NOT_INITIALIZED,
			});
			return;
		} else if (acc_type === 2) {
			setState({invalid: true, loading: false, validationMsg: FROZEN});
			return;
		}

		if (currentTokenForSend.type === "PureToken") {
			const tokenForSendRoot = currentTokenForSend.rootAddress;
			setState({invalid: undefined, loading: true});
			const walletAddrByOwner = await getExpectedWalletAddressByOwner(
				currentTokenForSend.rootAddress,
				addressToSend,
			);
			console.log("walletAddrByOwner", walletAddrByOwner);
			const addressToSendRoot = await getDetailsFromTONtokenWallet(
				walletAddrByOwner.name,
			);
			console.log("addressToSendRoot", addressToSendRoot);
			if (tokenForSendRoot === addressToSendRoot) {
				setState({
					invalid: false,
					loading: false,
					validationMsg: VALIDATION_MSG_ROOTS_SUC,
				});
			} else {
				setState({
					invalid: true,
					loading: false,
					validationMsg: VALIDATION_MSG_ROOTS_ERROR,
				});
			}
		} else {
			setState({
				invalid: false,
				loading: false,
				validationMsg: UNKNOWN_ERROR,
			});
		}
	}, [addressToSend]);

	return {
		...state,
	};
}
