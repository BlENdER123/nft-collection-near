import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import TONicon from "../images/tonCrystalDefault.svg";

export default function useAssetList() {
	const tokenList = useSelector((state) => state.walletReducer.tokenList);
	const liquidityList = useSelector(
		(state) => state.walletReducer.liquidityList,
	);

	const clientData = useSelector((state) => state.walletReducer.clientData);
	const updatedWallet = useSelector(
		(state) => state.walletReducer.updatedWallet,
	);

	const [fullSetOfAssets, setFullSetOfAssets] = useState([]);

	useEffect(() => {
		const isTONwalletExist = tokenList.filter(
			(item) => item.type === "Native Tons",
		);
		console.log("isTONwalletExist", isTONwalletExist);
		if (isTONwalletExist.length === 0) {
			const TONdata = {
				walletAddress: clientData.address,
				owner_address: clientData.address,
				symbol: "TON Crystal",
				tokenName: "TON Crystal",
				type: "Native Tons",
				icon: TONicon,
				rootAddress: "none",
				showWrapMenu: true,
				balance: updatedWallet === null ? clientData.balance : updatedWallet,
			};

			const withNative = JSON.parse(JSON.stringify(tokenList));
			// const liquidListCopy = JSON.parse(JSON.stringify(liquidityList));
			withNative.push(TONdata);
			// const assetsArr = withNative.concat(liquidListCopy)
			console.log("withNative111", withNative);
			setFullSetOfAssets(withNative);
		} else {
			const withNative = JSON.parse(JSON.stringify(tokenList));
			console.log("withNative", withNative);
			// const liquidListCopy = JSON.parse(JSON.stringify(liquidityList));
			// const assetsArr = withNative.concat(liquidListCopy)
			setFullSetOfAssets(withNative);
		}
	}, [tokenList, clientData, updatedWallet]);

	return {
		assetList: fullSetOfAssets,
	};
}
