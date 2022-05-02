import {useState} from "react";

export default function useSlippagePopper() {
	const [anchorEl, setAnchorEl] = useState(null);
	const [slippage, setSlippage] = useState("");

	const handleClick = (event) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const open = Boolean(anchorEl);

	const id = open ? "simple-popper" : undefined;

	return {
		slippageState: {
			slippage,
			setSlippage,
		},
		popperState: {
			id,
			open,
			handleClick,
			anchorEl,
		},
	};
}
