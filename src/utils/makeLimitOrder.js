import {Account} from "@tonclient/appkit";
import {signerKeys} from "@tonclient/core";
import {DEXClientContract} from "../extensions/contracts/DEXClientMainNet";
import client from "../extensions/webhook/script";

const TOKEN_ROUTER_MAP = {
	USDT: process.env.LIMIT_ROUTER_USDT_ADDRESS,
	WBTC: process.env.LIMIT_ROUTER_WBTC_ADDRESS,
	WTON: process.env.LIMIT_ROUTER_WTON_ADDRESS,
	WETH: process.env.LIMIT_ROUTER_WETH_ADDRESS,
};

export default async function makeLimitOrder(
	{pairAddr, tokenSymbol, qty, price},
	{clientAddr, clientKeyPair},
) {
	const clientAcc = new Account(DEXClientContract, {
		address: clientAddr,
		client,
		signer: signerKeys(clientKeyPair),
	});

	let response = null;
	console.log(
		"pairAddr",
		pairAddr,
		"TOKEN_ROUTER_MAP",
		TOKEN_ROUTER_MAP,
		"TOKEN_ROUTER_MAP[tokenSymbol]",
		TOKEN_ROUTER_MAP[tokenSymbol],
		"tokenSymbol",
		tokenSymbol,
		"qty",
		qty,
		"price",
		price,
	);
	try {
		if (tokenSymbol === "WTON")
			response = await clientAcc.run("makeLimitOrderA", {
				routerWalletA: TOKEN_ROUTER_MAP[tokenSymbol],
				pairAddr,
				qtyA: Number(qty) * 1000000000,
				priceA: price,
			});
		else
			response = await clientAcc.run("makeLimitOrderB", {
				routerWalletB: TOKEN_ROUTER_MAP[tokenSymbol],
				pairAddr,
				qtyB: Number(qty) * 1000000000,
				priceB: price,
			});

		return response.decoded.output;
	} catch (e) {
		console.log("eee", e);
		return e;
	}
}
