import {useState, useEffect} from "react";
import {useSelector} from "react-redux";

const NOT_ENOUGH_TOKENS = "Not enough tokens in your account";
const CANNOT_BE_EMPTY = "Fields cannot be empty";
const SPECIFY_TOKENS = 'Specify "from" and "to" tokens';

export default function useLimitOrderValidation() {
	const [invalid, setInvalid] = useState(false);
	const [validationMsg, setValidationMsg] = useState(false);

	const fromInputValue = useSelector(
		(state) => state.limitOrders.fromInputValue,
	);
	const fromToken = useSelector((state) => state.limitOrders.fromToken);
	const toToken = useSelector((state) => state.limitOrders.toToken);
	const rate = useSelector((state) => state.limitOrders.rate);

	useEffect(() => {
		if (!fromToken.symbol || !toToken.symbol) {
			setInvalid(true);
			setValidationMsg(SPECIFY_TOKENS);
		} else if (!fromInputValue || !rate) {
			setInvalid(true);
			setValidationMsg(CANNOT_BE_EMPTY);
		} else if (fromInputValue > fromToken.balance) {
			setInvalid(true);
			setValidationMsg(NOT_ENOUGH_TOKENS);
		} else {
			setInvalid(false);
			setValidationMsg("");
		}
	}, [fromInputValue, fromToken, toToken, rate]);

	return {
		invalid,
		validationMsg,
	};
}
