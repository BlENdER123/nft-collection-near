import React, {useState, useEffect} from "react";
// import {connect} from "react-redux";
import {HashRouter as Router, Redirect, useHistory} from "react-router-dom";
//import {main_screen_bg} from "../sdk/img/screenbg1.png"
import ConnectWalletPage from "./ConnectWalletPage";

import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {signerKeys, TonClient, signerNone} from "@tonclient/core";

import {DataContract} from "./collection contracts/DataContract.js";
import {NFTMarketContract} from "./collection contracts/NftMarketContract.js";
import {NftRootColectionContract} from "./collection contracts/NftRootColectionContract.js";
import {IndexOfferContract} from "./collection contracts/IndexOfferContract.js";
import {IndexContract} from "./collection contracts/IndexContract.js";
import {OfferContract} from "./collection contracts/OfferContract.js";

const {
	contractNft,
	nearConfig,
	contractRootNft,
	marketNft,
} = require("./config.json");

import * as nearAPI from "near-api-js";

const {parseNearAmount} = require("near-api-js/lib/utils/format");

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

const config = require("./config.json");

TonClient.useBinaryLibrary(libWeb);

const client = new TonClient({network: {endpoints: [config.DappServer]}});

async function getClientKeys(phrase) {
	//todo change with only pubkey returns
	let test = await client.crypto.mnemonic_derive_sign_keys({
		phrase,
		path: "m/44'/396'/0'/0/0",
		dictionary: 1,
		word_count: 12,
	});
	console.log(test);
	return test;
}

function NftMarket() {
	let history = useHistory();

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	const [connectWal, setConnect] = useState(false);

	const [mintNftData, setMintNftData] = useState({
		hidden: true,
	});

	const [redirect, setRedirect] = useState(false);

	const [loader, setLoader] = useState(true);

	let marketrootAddr = config.marketroot;

	const zeroAddress =
		"0:0000000000000000000000000000000000000000000000000000000000000000";

	let [collections, setCollections] = useState([]);

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

		let sales = [];

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
				console.log(data.data.getRecipes);

				let nonUniqArr = [];

				for (let i = 0; i < data.data.getRecipes.length; i++) {
					nonUniqArr.push(
						data.data.getRecipes[i].receipt_predecessor_account_id,
					);
				}

				let uniqArr = [...new Set(nonUniqArr)];

				console.log(uniqArr);

				for (let i = 0; i < uniqArr.length; i++) {
					let tempAddr = uniqArr[i];

					const salesUrl =
						"https://helper.nearapi.org/v1/batch/" +
						JSON.stringify([
							{
								contract: marketNft,
								method: "get_sales_by_nft_contract_id",
								args: {
									nft_contract_id: tempAddr,
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

					const headers = new Headers({
						"max-age": "1",
					});

					await fetch(salesUrl, {headers})
						.then((res) => {
							return res.json();
						})
						.then((data) => {
							console.log(data);
							for (let k = 0; k < data[0].length; k++) {
								sales.push(data[0][k]);
							}
						});
				}
			});

		// await fetch("http://145.239.27.218/endpoint/receiver", {
		// 	method: "post",
		// 	headers: {
		// 		"Content-Type": "application/json; charset=utf-8",
		// 		Connection: "keep-alive",
		// 	},
		// 	body: `
		// {
		// 	"receiver": {
		// 		"receipt_receiver_account_id":"dev-1648581158866-16348149344133"
		// 	}
		// }
		// `,
		// })
		// 	.then((data) => {
		// 		return data.json();
		// 	})
		// 	.then(async (data) => {
		// 		console.log(data);

		// 		let nonUniqArr = [];

		// 		for (let i = 0; i < data.length; i++) {
		// 			nonUniqArr.push(data[i].receipt_predecessor_account_id);
		// 		}

		// 		let uniqArr = [...new Set(nonUniqArr)];

		// 		console.log(uniqArr);

		// 		for (let i = 0; i < uniqArr.length; i++) {
		// 			let tempAddr = uniqArr[i];

		// 			const salesUrl =
		// 				"https://helper.nearapi.org/v1/batch/" +
		// 				JSON.stringify([
		// 					{
		// 						contract: marketNft,
		// 						method: "get_sales_by_nft_contract_id",
		// 						args: {
		// 							nft_contract_id: tempAddr,
		// 						},
		// 						batch: {
		// 							from_index: "0", // must be name of contract arg (above)
		// 							limit: "500", // must be name of contract arg (above)
		// 							step: 50, // divides contract arg 'limit'
		// 							flatten: [], // how to combine results
		// 						},
		// 						sort: {
		// 							path: "metadata.issued_at",
		// 						},
		// 					},
		// 				]);

		// 			const headers = new Headers({
		// 				"max-age": "1",
		// 			});

		// 			await fetch(salesUrl, {headers})
		// 				.then((res) => {
		// 					return res.json();
		// 				})
		// 				.then((data) => {
		// 					console.log(data);
		// 					for (let k = 0; k < data[0].length; k++) {
		// 						sales.push(data[0][k]);
		// 					}
		// 				});
		// 		}
		// 	});

		console.log(sales);

		let tempCols = [];

		for (let i = 0; i < sales.length; i++) {
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
					console.log(data);

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

					tempCols.push({
						name: info.title,
						desc: info.description,
						icon: mediaUrl,
						addrNftCol: sales[i].nft_contract_id,
						token_id: sales[i].token_id,
						price: sales[i].sale_conditions / 1000000000000000000000000,
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

		console.log(tempCols);
		setLoader(false);
		setCollections(tempCols);
	}

	useEffect(() => {
		getCollections();
	}, []);

	function openCollection(collection) {
		history.push("/nft-market-pack/" + collection);
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	async function buyNft(nft) {
		console.log(nft);

		window.contractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["storage_minimum_balance", "storage_balance_of"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["offer"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		console.log(window.walletConnection.getAccountId());

		console.log(window.walletConnection.account());

		// console.log(nft.price);
		// console.log(parseNearAmount(nft.price.toString()));

		contractMarket.offer(
			{
				nft_contract_id: nft.addrNftCol,
				token_id: nft.token_id,
			},
			"300000000000000",
			parseNearAmount(nft.price.toString()),
		);
	}

	return (
		<Router>
			<div
				className={!mintNftData.hidden || connectWallet ? "error-bg" : "hide"}
			>
				<span onClick={close}></span>
			</div>
			<div
				className={
					!mintNftData.hidden || connectWallet ? "App-error" : "App App2"
				}
			>
				<Header activeCat={2}></Header>

				<div
					className={
						mintNftData.hidden ? "hide" : "modal-connect modal-connect-first"
					}
				>
					<button
						className="close"
						onClick={() => setMintNftData({hidden: true})}
					>
						<span></span>
						<span></span>
					</button>
					<div class="title">Robots Collection</div>
					<div class="mint owner">
						Owner: <span>0:65eb...fe7b</span>{" "}
					</div>
					<div class="mint price">
						Price: <span>149</span>{" "}
					</div>
					<div class="mint royalty">
						Royalty for Author <span>15%</span>{" "}
					</div>
					<div class="button-1-square">Buy & Open Pack</div>
				</div>

				<div class="collections">
					{/* <div class="collection">
						<div class="img">
						</div>
						<div class="content">
							<div class="name">Robot #23245</div>
							<div class="rank">
								<span>Rank:</span>100
							</div>
							<div class="price">
								<span>Price:</span>149000.00
							</div>
							<div class="price-quality">
								<span>Price quality:</span>50%
							</div>
							<div class="button-1-square" onClick={()=>openCollection("owner1", "collection1")}>Buy & Open Pack</div>
						</div>
					</div> */}

					{/* <button onClick={getCollections}>Test</button> */}
					{collections.length > 0 ? (
						collections.map((item, index) => {
							return (
								<div class="collection">
									<div class="img">
										<img src={item.icon} />
									</div>
									<div class="content">
										<div class="name">{item.name.substring(0, 40)}</div>
										<div class="description">
											<span>Description:</span>
											{item.desc.substring(0, 50)}
										</div>
										<div class="description">
											<span>Price:</span>
											{item.price.toFixed(3)} NEAR
										</div>
										{/* <div class="rank">
											<span>Rank:</span>100
										</div>
										<div class="price">
											<span>Price:</span>149000.00
										</div>
										<div class="price-quality">
											<span>Price quality:</span>50%
										</div> */}
										<div
											class="button-1-square"
											// onClick={() => setMintNftData({hidden: false})}
											onClick={() => buyNft(item)}
										>
											Buy
										</div>
									</div>
								</div>
							);
						})
					) : (
						// <button className="button-1-square" onClick={getCollections}>
						// 	Load Collections
						// </button>

						<div className={loader ? "hide" : ""}>No NFT`s</div>
					)}

					{loader ? (
						<div className="loader">
							<div></div>
							<div></div>
							<div></div>
						</div>
					) : null}

					{redirect ? <Redirect to="/collection-market-pack" /> : ""}
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default NftMarket;
