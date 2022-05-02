import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import useAssetList from "./useAssetList";

export default function useSendAssetsSelectedToken() {
	const currentTokenForSend = useSelector(
		(state) => state.walletSeedReducer.currentTokenForSend,
	);
	const {assetList} = useAssetList();

	const [selectedToken, setSelectedToken] = useState(selectToken());

	useEffect(() => {
		setSelectedToken(selectToken());
	}, [currentTokenForSend, assetList]);

	function selectToken() {
		const inListToken = assetList.find(
			(token) => token.symbol === currentTokenForSend.symbol,
		);

		return inListToken || currentTokenForSend;
	}

	return {
		selectedToken,
	};
}
