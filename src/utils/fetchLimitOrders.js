import {Account} from "@tonclient/appkit";
import {signerKeys} from "@tonclient/core";
import {LimitOrderRootContract} from "../extensions/contracts/LimitOrderRoot";
import {LimitOrderContract} from "../extensions/contracts/LimitOrder";
import client from "../extensions/webhook/script";

export default async function fetchLimitOrders() {
	const rootAcc = new Account(LimitOrderRootContract, {
		address: process.env.LIMIT_ROOT_ADDRESS,
		signer: signerKeys({
			public: process.env.LIMIT_ROOT_PUBLIC_KEY,
			secret: process.env.LIMIT_ROOT_PRIVATE_KEY,
		}),
		client,
	});

	const response = await rootAcc.runLocal("resolveCodeHash", {});

	let hash = response.decoded.output.codeHash;
	hash = hash.substring(2, hash.length);
	console.log("hash", hash);

	const data = (
		await client.net.query_collection({
			collection: "accounts",
			filter: {
				code_hash: {eq: hash},
			},
			result: "id",
		})
	).result;

	const ids = data.map((el) => el.id);
	console.log("ids", ids);
	const orders = [];

	for (const id of ids) {
		const orderAcc = new Account(LimitOrderContract, {
			address: id,
			client,
		});

		const res = await orderAcc.runLocal("getInfo", {});

		orders.push(res.decoded.output);
	}
	console.log("orders", orders);
	return orders;
}
