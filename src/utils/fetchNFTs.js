import * as nearAPI from "near-api-js";
import {marketNft, nearConfig} from "../sdk/config.json";

export default async function fetchNFTs() {
	window.near = await nearAPI.connect({
		deps: {
			keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
		},
		...nearConfig,
	});

	// Needed to access wallet login
	window.walletConnection = new nearAPI.WalletConnection(window.near);

	// Getting the Account ID. If unauthorized yet, it's just empty string.
	window.accountId = window.walletConnection.getAccountId();
	console.log("timestamp1", new Date().toLocaleString());

	let urls = [];
	let uniqArr = [];
	await fetch("https://gq.cryptan.site/graphql", {
		method: "post",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Connection: "keep-alive",
		},
		body: JSON.stringify({
			query: `
    					{
    						getRecipes(receipt_receiver_account_id: "dev-1648581158866-16348149344133"){
    						  receipt_predecessor_account_id,
    						  receipt_id,
    						  args
    						}
    					  }
    					`,
		}),
	})
		.then((data) => {
			return data.json();
		})
		.then(async (data) => {
			let nonUniqArr = [];

			for (let i = 0; i < data.data.getRecipes.length; i++) {
				nonUniqArr.push(data.data.getRecipes[i].receipt_predecessor_account_id);
			}
			uniqArr = [...new Set(nonUniqArr)];

			for (let i = 0; i < uniqArr.length; i++) {
				// let tempAddr = uniqArr[i];

				const salesUrl =
					"https://helper.nearapi.org/v1/batch/" +
					JSON.stringify([
						{
							contract: marketNft,
							method: "get_sales_by_nft_contract_id",
							args: {
								nft_contract_id: uniqArr[i],
							},
							batch: {
								from_index: "0", // must be name of contract arg (above)
								limit: "500", // must be name of contract arg (above)
								step: 50, // divides contract arg 'limit'
								flatten: [], // how to combine results
							},
							sort: {
								path: "metadata.issued_at",
							},
						},
					]);
				urls.push(salesUrl);
			}
		});

	const headers = new Headers({
		"max-age": "1",
	});
	// let rrr = await fetch("https://helper.nearapi.org/v1/batch/[{\"contract\":\"dev-1648581158866-16348149344133\",\"method\":\"get_sales_by_nft_contract_id\",\"args\":{\"nft_contract_id\":\"dev-1648581158866-16348149344133\"},\"batch\":{\"from_index\":\"0\",\"limit\":\"500\",\"step\":50,\"flatten\":[]},\"sort\":{\"path\":\"metadata.issued_at\"}}]", {headers}).then(async resp => console.log("yyy",await resp.json()))

	let res = [];
	await Promise.all(
		urls.map(async (url) => {
			await fetch(url, {headers})
				.then(async (resp) => {
					let responce = await resp.json();
					console.log("responceresponce", responce);
					if (responce.error) {
						console.log("some error in responce");
						return responce;
					}
					if (!responce[0].length) {
						console.log("some error");
						return responce;
					}
					res = [...res, ...responce[0]];
				})
				.catch((e) => {
					console.log("some error type", e);
					return e;
				});
		}),
	);
	console.log("vallllres", res);

	if (res.length === 0) {
		throw {error: "e"};
	}
	return res;
}
