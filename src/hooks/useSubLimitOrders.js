import {useSnackbar} from "notistack";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {DEXClientContract} from "../extensions/contracts/DEXClientMainNet";
import client, {decode} from "../extensions/webhook/script";
import {setOrderList} from "../store/actions/limitOrders";

export default async function useSubLimitOrders() {
	const dispatch = useDispatch();

	const clientData = useSelector((state) => state.walletReducer.clientData);
	const orderList = useSelector((state) => state.limitOrders.orderList);

	const {enqueueSnackbar} = useSnackbar();

	useEffect(async () => {
		if (!clientData) return;

		const res = await client.net.subscribe_collection(
			{
				collection: "messages",
				filter: {
					dst: {eq: clientData.address},
				},
				result: "boc",
			},
			async (param) => {
				const decoded = await decode.message(
					DEXClientContract.abi,
					param.result.boc,
				);

				if (
					typeof decoded === "number" ||
					(decoded.name !== "makeLimitOrderA" &&
						decoded.name !== "makeLimitOrderB") ||
					decoded.body_type !== "Input"
				)
					return;

				const order = {};

				order.addrPair = decoded.value.pairAddr;
				order.addrOwner = clientData.address;

				if (decoded.name === "makeLimitOrderA") {
					order.price = decoded.value.priceA;
					order.amount = decoded.value.qtyA;
					order.directionPair = "4";
				} else {
					order.price = decoded.value.priceB;
					order.amount = decoded.value.qtyB;
					order.directionPair = "5";
				}

				dispatch(setOrderList([...orderList, order]));
				enqueueSnackbar({type: "success", message: "Created limit order"});
			},
		);

		return () => {
			client.net.unsubscribe(res);
		};
	}, [clientData]);
}
