import React, {useEffect, useState} from "react";
import {
	HashRouter as Router,
	Switch,
	Route,
	Redirect,
	useLocation,
	useHistory,
} from "react-router-dom";

import Context from "./sdk/Context";

import ConnectWalletPage from "./sdk/ConnectWalletPage";
import WelcomeNftPage from "./sdk/WelcomeNftPage";
import LoadNftPage from "./sdk/LoadNftPage";
import LoginPage from "./sdk/LoginPage";
import AppPage from "./sdk/AppPage";
import NftCustomization from "./sdk/NftCustomization";
import NftGenerate from "./sdk/NftGenerate";
import NftCollection from "./sdk/NftCollection";
import GettingStarted from "./sdk/GetttingStartedPage";
import CollectioMarket from "./sdk/CollectionMarket";
import OpenPack from "./sdk/OpenPack";
import Header from "./sdk/Header";
import HowPage from "./sdk/HowPage";
import ProfilePage from "./sdk/ProfilePage";
import LoadNftPageSingle from "./sdk/LoadNftPageSingle";
import NftCustomizationSingle from "./sdk/NftCustomizationSingle";
import NftGenerateSingle from "./sdk/NftGenerateSingle";
import NftSingle from "./sdk/NftSingle";
import CollectionMarketPack from "./sdk/CollectionMarketPack";
import NftDetails from "./sdk/NftDetails";
import NftMarket from "./sdk/NftMarket";
import NftMarketPack from "./sdk/NftMarketPack";
import NftMarketAuction from "./sdk/NftMarketAuction";
import NftMarketNft from "./sdk/NftMarketNft";
import PackPage from "./sdk/PackPage";

import {Buffer} from "buffer";
import * as nearAPI from "near-api-js";
global.Buffer = Buffer;

import {
	contractNft,
	nearConfig,
	contractRootNft,
	marketNft,
} from "../src/sdk/config.json";

const getUrlsData = async (urls) => {
	const headers = new Headers({
		"max-age": "1",
	});
	// let rrr = await fetch("https://helper.nearapi.org/v1/batch/[{\"contract\":\"dev-1648581158866-16348149344133\",\"method\":\"get_sales_by_nft_contract_id\",\"args\":{\"nft_contract_id\":\"dev-1648581158866-16348149344133\"},\"batch\":{\"from_index\":\"0\",\"limit\":\"500\",\"step\":50,\"flatten\":[]},\"sort\":{\"path\":\"metadata.issued_at\"}}]", {headers}).then(async resp => console.log("yyy",await resp.json()))

	let res = [];
	await Promise.all(
		urls.map(async (url) => {
			// console.log("uuuuu",url)
			await fetch(url, {headers}).then(async (resp) => {
				let responce = await resp.json();
				if (responce[0].length !== 0) {
					// console.log("{...responce[0]}",{...responce[0]},"responce[0]",responce[0])
					res = [...res, ...responce[0]];
				}
			});
		}),
	).catch((error) => console.log("err", error));
	// console.log("vallllres", res)
	return res;
};

function App() {
	const [collections, setCollections] = useState([]);
	const [loader, setLoader] = useState(true);
	async function getCollections() {
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

		let urls = [];

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
					nonUniqArr.push(
						data.data.getRecipes[i].receipt_predecessor_account_id,
					);
				}
				let uniqArr = [...new Set(nonUniqArr)];

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

		let sales = await getUrlsData(urls);
		// console.log("myData",sales)
		let tempCols = [];

		for (let i = 0; i < sales.length; i++) {
			// console.log("sales.sales.",sales[i])
			window.tempContract = await new nearAPI.Contract(
				window.walletConnection.account() || "test",
				sales[i].nft_contract_id,
				{
					// View methods are read-only – they don't modify the state, but usually return some value
					viewMethods: [
						"nft_tokens",
						"nft_supply_for_owner",
						"nft_tokens_for_owner",
						"nft_token",
					],
					// Change methods can modify the state, but you don't receive the returned value when called
					// changeMethods: ["new"],
					// Sender is the account ID to initialize transactions.
					// getAccountId() will return empty string if user is still unauthorized
					sender: window.walletConnection.getAccountId(),
				},
			);

			await tempContract
				.nft_token({token_id: sales[i].token_id})
				.then((data) => {
					// console.log(data);

					let info = data.metadata;

					let mediaUrl;

					try {
						if (
							info.media.includes("http://") ||
							(info.media.includes("data") && info.media.length > 25) ||
							info.media.includes("https://")
						) {
							mediaUrl = info.media;
						} else {
							mediaUrl = "https://cloudflare-ipfs.com/ipfs/" + info.media;
						}
					} catch {
						mediaUrl = info.media;
					}

					if (info.title == null || undefined) {
						info.title = "No Name";
					}
					if (info.description == null || undefined) {
						info.description = "No Description";
					}

					tempCols.push({
						name: info.title,
						desc: info.description,
						icon: mediaUrl,
						addrNftCol: sales[i].nft_contract_id,
						token_id: sales[i].token_id,
						price: sales[i].sale_conditions / 1000000000000000000000000,
						index: i,
					});

					// tempCol.push({
					// 	addrNft: "addrNFT",
					// 	name: info.title,
					// 	desc: info.description, //"https://cloudflare-ipfs.com/ipfs/"+
					// 	image: mediaUrl,
					// 	token_id: data[i].token_id,
					// 	addrCol: data[i].nft_contract_id
					// })
				});
		}

		console.log("tempColstempColst", tempCols);

		setCollections(tempCols);
	}

	useEffect(async () => {
		console.log("rerender");
		let res = await getCollections();
		setLoader(false);

		// await fetch("https://helper.nearapi.org/v1/batch/[%7B%22contract%22:%22dev-1648581158866-16348149344133%22,%22method%22:%22get_sales_by_nft_contract_id%22,%22args%22:%7B%22nft_contract_id%22:%22vfxcfsuy374jmbpk7ajj.dev-1649955014160-15139685094806%22%7D,%22batch%22:%7B%22from_index%22:%220%22,%22limit%22:%22500%22,%22step%22:50,%22flatten%22:[]%7D,%22sort%22:%7B%22path%22:%22metadata.issued_at%22%7D%7D]", {
		// 	"max-age": "1",
		// }).then(async (resp) => {
		// 	let responce = await resp.json();
		// 	console.log(response);
		// });
	}, []);

	return (
		<>
			<Router>
				<Context.Provider value={{status: status}}>
					<Switch>
						<Route exact path="/" component={WelcomeNftPage}></Route>
						{/* <Route exact path="/connect-wallet" component={ConnectWalletPage}></Route> */}
						{/* <Route exact path="/welcome-nft" component={WelcomeNftPage}></Route> */}
						<Route exact path="/get-start" component={GettingStarted}></Route>
						<Route exact path="/load-nft" component={LoadNftPage}></Route>
						<Route
							exact
							path="/nft-customization"
							component={NftCustomization}
						></Route>
						<Route exact path="/nft-generate" component={NftGenerate}></Route>
						<Route
							exact
							path="/nft-collection"
							component={NftCollection}
						></Route>
						<Route
							exact
							path="/load-nft-single"
							component={LoadNftPageSingle}
						></Route>
						<Route
							exact
							path="/nft-customization-single"
							component={NftCustomizationSingle}
						></Route>
						<Route
							exact
							path="/nft-generate-single"
							component={NftGenerateSingle}
						></Route>
						<Route exact path="/nft-single" component={NftSingle}></Route>
						<Route
							exact
							path="/collection-market"
							component={CollectioMarket}
						></Route>
						<Route
							exact
							path="/collection-market-pack/:address"
							component={CollectionMarketPack}
						></Route>
						<Route
							exact
							path="/nft-market"
							render={(props) => (
								<NftMarket
									{...props}
									collections={collections}
									loader={loader}
								/>
							)}
						></Route>
						<Route
							exact
							path="/nft-market-pack/:address"
							component={NftMarketPack}
						></Route>
						<Route
							exact
							path="/nft-market-auction"
							component={NftMarketAuction}
						></Route>
						<Route
							exact
							path="/nft-market-nft/:address"
							component={NftMarketNft}
						></Route>
						<Route exact path="/pack/:address" component={PackPage}></Route>
						<Route
							exact
							path="/nft-details/:address"
							component={NftDetails}
						></Route>
						<Route exact path="/how" component={HowPage}></Route>
						{/* <Route exact path="/open-pack" component={OpenPack}></Route> */}
						{/* <Route exact path="/login" component={LoginPage}></Route> */}
						{/* <Route exact path="/app" component={AppPage}></Route> */}
						<Route
							exact
							path="/profile/:address"
							component={ProfilePage}
						></Route>
					</Switch>
				</Context.Provider>
			</Router>
		</>
	);
}

export default App;
