import React, {useState, useEffect, PropTypes} from "react";
import {connect} from "react-redux";
import {HashRouter as Router, useParams, useHistory} from "react-router-dom";
//import {main_screen_bg} from "../sdk/img/screenbg1.png"
import ConnectWalletPage from "./ConnectWalletPage";

import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {signerKeys, TonClient, signerNone} from "@tonclient/core";

import {DEXClientContract} from "./test net contracts/DEXClient.js";

import {DataContract} from "./collection contracts/DataContract.js";
import {NFTMarketContract} from "./collection contracts/NftMarketContract.js";
import {NftRootColectionContract} from "./collection contracts/NftRootColectionContract.js";
import {IndexContract} from "./collection contracts/IndexContract.js";

import Header from "./Header";
import Footer from "./Footer";

import * as nearAPI from "near-api-js";
const {parseNearAmount} = require("near-api-js/lib/utils/format");

import {useDispatch, useSelector} from "react-redux";

const config = require("./config.json");

const {
	contractNft,
	nearConfig,
	contractRootNft,
	marketNft,
} = require("./config.json");

const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

TonClient.useBinaryLibrary(libWeb);

const client = new TonClient({network: {endpoints: [config.DappServer]}});

const pidCrypt = require("pidcrypt");
require("pidcrypt/aes_cbc");
const aes = new pidCrypt.AES.CBC();

function ProfilePage() {
	useEffect(() => {
		if (document.location.href.split("?transactionHashes=")[1]) {
			let href = document.location.origin + document.location.hash;
			document.location.href = href;
		}
	}, []);

	let history = useHistory();

	const params = useParams();

	//https://helper.testnet.near.org/account/blender1.testnet/likelyNFTs

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	let addrUser = params.address;

	const [connectWal, setConnect] = useState(false);

	const [openMenu, setOpenMenu] = useState(false);

	const [activeCat, setActiveCat] = useState(1);

	const [items, setItems] = useState([0, 0, 0]);

	const [saleModal, setSaleModal] = useState({
		hidden: true,
	});

	const [salePrice, setSalePrice] = useState(0);

	const [nftCol, setNftCol] = useState([
		{
			addrNft: "Null",
			name: "Null",
			desc: "Null",
			image: "Null",
		},
	]);

	const [nftSale, setNftSale] = useState([
		{
			addrNft: "Null",
			name: "Null",
			desc: "Null",
			image: "Null",
		},
	]);

	const [depositSale, setDepositSale] = useState({
		deposit: 0,
		sale: 0,
		avail: false,
	});

	let marketrootAddr = config.marketroot;

	async function getHash() {
		const {contractNft, nearConfig, contractRootNft} = require("./config.json");

		const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

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

		// sale nft`s

		window.contractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["get_sales_by_owner_id"],
				// Change methods can modify the state, but you don't receive the returned value when called
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		contractMarket
			.get_sales_by_owner_id({
				account_id: window.walletConnection.getAccountId(),
				from_index: "0",
				limit: 100,
			})
			.then(async (data) => {
				console.log(data);

				let tempCol = [];

				for (let i = 0; i < data.length; i++) {
					window.tempContract = await new nearAPI.Contract(
						window.walletConnection.account(),
						data[i].nft_contract_id,
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
						.nft_token({token_id: data[i].token_id})
						.then((data1) => {
							console.log(data1);

							let info = data1.metadata;

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

							tempCol.push({
								addrNft: "addrNFT",
								name: info.title,
								desc: info.description, //"https://cloudflare-ipfs.com/ipfs/"+
								image: mediaUrl,
								token_id: data[i].token_id,
								addrCol: data[i].nft_contract_id,
							});
						});
				}

				console.log(tempCol);
				let tempItems = items;
				tempItems[0] = tempCol.length;
				setItems(tempItems);
				if (tempCol.length > 0) {
					setNftSale(tempCol);
				}
			});

		// collectible nft`s

		// fetch("https://rpc.testnet.near.org/", {
		// 	method: "post",
		// 	headers: {
		// 		"Content-Type": "application/json; charset=utf-8",
		// 		Connection: "keep-alive",
		// 	},
		// 	body:
		// 		`
		// 		{
		// 			jsonrpc: "2.0",
		// 			method: "query",
		// 			params: {
		// 				account_id: "uucsp8phuoy4i45kih91.dev-1647760185497-61809335965956",
		// 				args_base64: "eyJhY2NvdW50X2lkIjoiYmxlbmRlcjEudGVzdG5ldCIsImZyb21faW5kZXgiOiIwIiwibGltaXQiOjR9",
		// 				finality: "optimistic",
		// 				method_name: "nft_tokens_for_owner",
		// 				request_type: "call_function"
		// 			}
		// 		}
		// 		`
		// }).then((data)=>{
		// 	return data.json();
		// }).then((data)=>{
		// 	console.log(data);
		// 	console.log(1);
		// })

		let accountName = window.walletConnection.account().accountId;

		console.log(accountName);

		fetch(
			"https://helper.testnet.near.org/account/" + accountName + "/likelyNFTs",
			{
				method: "get",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					Connection: "keep-alive",
				},
			},
		)
			.then((data) => {
				return data.json();
			})
			.then(async (data) => {
				console.log(data);

				let tempCol = [];

				window.contractMarket = await new nearAPI.Contract(
					window.walletConnection.account(),
					marketNft,
					{
						// View methods are read-only – they don't modify the state, but usually return some value
						viewMethods: ["get_sales_by_owner_id", "storage_balance_of"],
						// Change methods can modify the state, but you don't receive the returned value when called
						// Sender is the account ID to initialize transactions.
						// getAccountId() will return empty string if user is still unauthorized
						sender: window.walletConnection.getAccountId(),
					},
				);

				contractMarket
					.get_sales_by_owner_id({
						account_id: window.walletConnection.getAccountId(),
						from_index: "0",
						limit: 100,
					})
					.then(async (sales) => {
						contractMarket
							.storage_balance_of({
								account_id: window.walletConnection.getAccountId(),
							})
							.then((data) => {
								if (sales.length < data / 10000000000000000000000) {
									console.log(sales);
									console.log(sales.length, data / 10000000000000000000000);
									setDepositSale({
										deposit: data / 10000000000000000000000,
										sale: sales.length,
										avail: true,
									});
								} else {
									console.log(sales.length, data / 10000000000000000000000);
									setDepositSale({
										deposit: data / 10000000000000000000000,
										sale: sales.length,
										avail: false,
									});
								}
							});

						for (let i = 0; i < data.length; i++) {
							let tempAddr = data[i];

							// console.log(tempAddr);

							window.tempContract = await new nearAPI.Contract(
								window.walletConnection.account(),
								tempAddr,
								{
									// View methods are read-only – they don't modify the state, but usually return some value
									viewMethods: [
										"nft_tokens",
										"nft_supply_for_owner",
										"nft_tokens_for_owner",
									],
									// Change methods can modify the state, but you don't receive the returned value when called
									// changeMethods: ["new"],
									// Sender is the account ID to initialize transactions.
									// getAccountId() will return empty string if user is still unauthorized
									sender: window.walletConnection.getAccountId(),
								},
							);

							try {
								await tempContract
									.nft_tokens_for_owner({
										account_id: window.walletConnection.getAccountId(),
										from_index: "0",
										limit: 50,
									})
									.then(async (data) => {
										console.log(data);
										for (let j = 0; j < data.length; j++) {
											let info = data[j].metadata;

											let onSale = false;

											console.log(1);

											for (let k = 0; k < sales.length; k++) {
												// console.log(tempAddr , sales[k].nft_contract_id , data[j].token_id , sales[k].token_id);
												if (
													tempAddr == sales[k].nft_contract_id &&
													data[j].token_id == sales[k].token_id
												) {
													onSale = true;
													console.log("true");
												}
											}

											let mediaUrl;

											try {
												if (
													info.media.includes("http://") ||
													(info.media.includes("data") &&
														info.media.length > 25) ||
													info.media.includes("https://")
												) {
													mediaUrl = info.media;
												} else {
													mediaUrl =
														"https://cloudflare-ipfs.com/ipfs/" + info.media;
												}
											} catch {
												mediaUrl = info.media;
											}

											tempCol.push({
												addrNft: "addrNFT",
												name: info.title,
												desc: info.description, //"https://cloudflare-ipfs.com/ipfs/"+
												image: mediaUrl,
												token_id: data[j].token_id,
												addrCol: tempAddr,
												onSale,
											});
										}
									});
							} catch {
								console.log("error");
							}

							// const tokens = await tempContract.viewFunction(tempAddr, "")

							// tempContract.nft_tokens({
							// 	from_index: 0,
							// 	limit: 100
							// }).then((data)=>{
							// 	console.log(data);
							// });
						}

						let tempItems = items;
						tempItems[1] = tempCol.length;
						setItems(tempItems);

						console.log(tempCol);
						if (tempCol.length > 0) {
							setNftCol(tempCol);
						}
					});
			});
	}

	useEffect(() => {
		getHash();
	}, []);

	// async function saleNft() {
	// 	console.log(salePrice);
	// 	console.log(saleModal);

	// 	if (salePrice == 0) {
	// 		alert("Set Sale Price");
	// 		return;
	// 	}

	// 	let decrypted = aes.decryptText(sessionStorage.getItem("seedHash"), "5555");

	// 	const clientAcc = new Account(DEXClientContract, {
	// 		address: sessionStorage.getItem("address"),
	// 		signer: signerKeys(await getClientKeys(decrypted)),
	// 		client,
	// 	});

	// 	const indNftAcc = new Account(IndexContract, {
	// 		address: saleModal.addrNft,
	// 		signer: signerNone(),
	// 		client,
	// 	});

	// 	let addrDataNFT;

	// 	try {
	// 		const response = await indNftAcc.runLocal("getInfo", {});
	// 		let value0 = response;
	// 		addrDataNFT = response.decoded.output.addrData;
	// 		console.log("value0", value0);
	// 	} catch (e) {
	// 		console.log("catch E", e);
	// 	}

	// 	const marketAcc = new Account(NFTMarketContract, {
	// 		address: marketrootAddr,
	// 		signer: signerNone(),
	// 		client,
	// 	});

	// 	console.log(addrDataNFT);

	// 	try {
	// 		const {body} = await client.abi.encode_message_body({
	// 			abi: {type: "Contract", value: NFTMarketContract.abi},
	// 			signer: {type: "None"},
	// 			is_internal: true,
	// 			call_set: {
	// 				function_name: "putOnSale",
	// 				input: {
	// 					addrNft: addrDataNFT,
	// 					price: salePrice,
	// 				},
	// 			},
	// 		});

	// 		const res = await clientAcc.run("sendTransaction", {
	// 			dest: marketrootAddr,
	// 			value: 700000000,
	// 			bounce: true,
	// 			flags: 3,
	// 			payload: body,
	// 		});
	// 		console.log(res);
	// 	} catch (e) {
	// 		console.log(e);
	// 	}

	// 	let addrOffer;

	// 	try {
	// 		const response = await marketAcc.runLocal("resolveAddrOffer", {
	// 			addrNft: addrDataNFT,
	// 		});
	// 		let value0 = response;
	// 		addrOffer = response.decoded.output.addrOffer;
	// 		console.log("value0", value0);
	// 	} catch (e) {
	// 		console.log("catch E", e);
	// 	}

	// 	const dataAcc = new Account(DataContract, {
	// 		address: addrDataNFT,
	// 		signer: signerNone(),
	// 		client,
	// 	});

	// 	try {
	// 		const {body} = await client.abi.encode_message_body({
	// 			abi: {type: "Contract", value: DataContract.abi},
	// 			signer: {type: "None"},
	// 			is_internal: true,
	// 			call_set: {
	// 				function_name: "setAddrApproved",
	// 				input: {
	// 					addrApproved: addrOffer,
	// 				},
	// 			},
	// 		});

	// 		const res = await clientAcc.run("sendTransaction", {
	// 			dest: addrDataNFT,
	// 			value: 300000000,
	// 			bounce: true,
	// 			flags: 3,
	// 			payload: body,
	// 		});
	// 		console.log(res);
	// 	} catch (e) {
	// 		console.log(e);
	// 	}

	// 	try {
	// 		const response = await marketAcc.runLocal("resolveCodeHashOffer", {});
	// 		let value0 = response;
	// 		console.log("value0", value0);
	// 	} catch (e) {
	// 		console.log("catch E", e);
	// 	}

	// 	setSalePrice(0);
	// }

	async function reloadNft() {
		await getHash();
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	async function saleNft(nft) {
		console.log(nft);

		console.log(salePrice);

		if (
			salePrice <= 0 ||
			salePrice == "" ||
			salePrice == undefined ||
			salePrice == null
		) {
			alert("Set Sale Price");
			return;
		}

		window.contractSale = await new nearAPI.Contract(
			window.walletConnection.account(),
			nft.addrCol,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				// viewMethods: ['get_num'],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["nft_approve"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		// let tempAcc = await new nearAPI.Account(walletConnection, walletConnection.getAccountId());

		// console.log(tempAcc);

		// tempAcc.functionCall({
		// 	contractId: "1",
		// 	methodName: "nft_approve",
		// 	args: {
		// 	  token_id: "tokenId",
		// 	  account_id:" marketId",
		// 	  msg: JSON.stringify({
		// 		sale_conditions: {
		// 		  near: parseNearAmount("0.01"),
		// 		},
		// 	  }),
		// 	},
		// 	gas: parseNearAmount("0.001"),
		// 	attachedDeposit: parseNearAmount("0.01"),

		// })

		// contractMarket.storage_minimum_balance().then(async (data)=>{
		// 	let deposit = data;

		// 	let pubKey = JSON.parse(keyStore.localStorage.undefined_wallet_auth_key).allKeys[0];

		// 	console.log(near);

		// 	let status = await near.connection.provider.status();
		// 	console.log(status);

		// 	const accessKey = await near.connection.provider.query(
		// 		`access_key/${window.walletConnection.getAccountId()}/${pubKey.toString()}`,
		// 		"",
		// 	);

		// 	const nonce = ++accessKey.nonce;

		// 	console.log(nonce, accessKey);

		// 	const recentBlockHash = nearAPI.utils.serialize.base_decode(
		// 		accessKey.block_hash,
		// 	);

		// 	console.log(recentBlockHash);

		// 	console.log(nearAPI.utils.key_pair.PublicKey.fromString(pubKey));

		// 	let deployData = JSON.parse(sessionStorage.getItem("details"));

		// 	let actionsTrans = [];

		// 	actionsTrans.push(
		// 		nearAPI.transactions.functionCall(
		// 			"storage_deposit",
		// 			{},
		// 			"30000000000000",
		// 			deposit,
		// 		),
		// 	);

		// 	actionsTrans.push(
		// 		nearAPI.transactions.functionCall(
		// 			"nft_approve",
		// 			{
		// 				token_id: nft.token_id,
		// 				  account_id: marketNft,
		// 				  msg: JSON.stringify({
		// 					sale_conditions: {
		// 					  near: parseNearAmount(salePrice),
		// 					},
		// 				}),
		// 			},
		// 			"30000000000000",
		// 			parseNearAmount("1"),
		// 		),
		// 	);

		// 	console.log(actionsTrans);

		// 	const transaction = nearAPI.transactions.createTransaction(
		// 		walletConnection.getAccountId(),
		// 		nearAPI.utils.key_pair.PublicKey.fromString(pubKey),
		// 		addr,
		// 		nonce,
		// 		actionsTrans,
		// 		recentBlockHash,
		// 	);

		// 	console.log(transaction);

		// });

		window.contractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: [
					"storage_minimum_balance",
					"get_sale",
					"get_sales_by_owner_id",
				],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["storage_deposit"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		contractMarket
			.get_sales_by_owner_id({
				account_id: window.walletConnection.getAccountId(),
				from_index: "0",
				limit: 50,
			})
			.then((data) => {
				console.log(data);
			});

		contractSale
			.nft_approve(
				{
					token_id: nft.token_id,
					account_id: marketNft,
					msg: JSON.stringify({
						sale_conditions: parseNearAmount(salePrice),
					}),
				},
				"30000000000000",
				parseNearAmount("0.01"),
			)
			.catch((err) => {
				alert("Connect Wallet");
			});

		setSalePrice(0);
	}

	async function depositNft() {
		window.contractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["storage_minimum_balance", "storage_balance_of"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["storage_deposit"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		// contractMarket.storage_balance_of({account_id: window.walletConnection.getAccountId()}).then((data)=> {
		// 	console.log(data);
		// })

		contractMarket
			.storage_minimum_balance()
			.then(async (data) => {
				console.log(data);

				contractMarket.storage_deposit({}, "30000000000000", data).catch(() => {
					alert("Connect Wallet");
				});
			})
			.catch(() => {
				alert("Connect Wallet");
			});
	}

	async function removeSale(nft) {
		console.log(nft);

		window.contractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["storage_minimum_balance"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["storage_deposit", "remove_sale"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		contractMarket
			.remove_sale(
				{
					nft_contract_id: nft.addrCol,
					token_id: nft.token_id,
				},
				"30000000000000",
				"1",
			)
			.catch(() => {
				alert("Connect Wallet");
			});
	}

	async function withdraw() {
		window.contractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["storage_minimum_balance"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["storage_withdraw", "remove_sale"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		contractMarket.storage_withdraw({}, "30000000000000", "1").catch(() => {
			alert("Connect Wallet");
		});
	}

	return (
		<Router>
			<div
				className={
					connectWal || !saleModal.hidden || connectWallet ? "error-bg" : "hide"
				}
			>
				{/* <span
					className={connectWal ? "" : "hide"}
					onClick={() => setConnect(false)}
				></span> */}
				<span className={connectWallet ? "" : "hide"} onClick={close}></span>
			</div>
			<div
				className={
					connectWal || !saleModal.hidden || connectWallet
						? "App-error"
						: "App App2"
				}
			>
				<Header activeCat={0}></Header>

				<div className={connectWal ? "" : "hide"}>
					<ConnectWalletPage></ConnectWalletPage>
				</div>

				<div
					className={
						!saleModal.hidden ? "modal-connect modal-connect-sale" : "hide"
					}
				>
					<button
						className="close"
						onClick={() => {
							setSalePrice(0);
							setSaleModal({hidden: true});
						}}
					>
						<span></span>
						<span></span>
					</button>

					<div class="menu-sale">
						<div class="menu-item auction">Auction Sale</div>
						<div class="menu-item regular">Regular Sale</div>
					</div>

					<div class="content auction hide">
						<div class="title">Auction Sale</div>
						<div class="subtitle">
							Enter the starting price, bid amount and duration of the auction
						</div>
						<div class="input-sale">
							<div class="title">Starting price (NEAR)</div>
							<input type="number" />
						</div>
						<div class="input-sale">
							<div class="title">Minimum bet (NEAR)</div>
							<input type="number" />
						</div>
						<div class="input-sale">
							<div class="title">Auction time</div>
							<input type="date" />
						</div>
						<div class="sale">Put up for auction</div>
					</div>

					<div class="content regular">
						<div class="title">Regular Sale</div>
						<div class="subtitle">
							Enter your desired sale price, and use Sale to list the NFT for
							sale on the marketplace
						</div>
						<div class="input-sale">
							<div class="title">Price (NEAR)</div>
							<input
								type="number"
								onChange={(ev) => setSalePrice(ev.target.value)}
							/>
						</div>
						{/* <div class="sale" onClick={()=>depositNft(saleModal.nftInfo)}>Deposit</div> */}
						<div
							class="sale button-1"
							onClick={() => saleNft(saleModal.nftInfo)}
						>
							Sale
						</div>
					</div>
				</div>

				<div class="profile">
					<div class="container">
						<div class="text">Profile</div>

						<div class="addr">
							<span>Address:</span> {addrUser}
						</div>

						<div class="nfts">
							<div class="menu-nft">
								<div class="menu-bar">
									<span
										className={activeCat == 1 ? "active" : ""}
										onClick={() => setActiveCat(1)}
									>
										Collectibles
									</span>
									<span
										className={activeCat == 0 ? "active" : ""}
										onClick={() => setActiveCat(0)}
									>
										On Sale
									</span>

									{/* <span
										className={activeCat == 2 ? "active" : ""}
										onClick={() => setActiveCat(2)}
									>
										Created
									</span> */}
								</div>

								<button class="btn-main" onClick={reloadNft}>
									Reload
								</button>

								{/* <button onClick={()=>{
									

									console.log(document.location);
									console.log(history.location);
									// history.replace(history.location.pathname);
								}}>test</button> */}

								<div className={activeCat == 0 ? "items" : "hide"}>
									{items[0]} items
								</div>
								<div className={activeCat == 1 ? "items" : "hide"}>
									{items[1]} items
								</div>
								<div className={activeCat == 2 ? "items" : "hide"}>
									{items[2]} items
								</div>
							</div>
							<div
								className={activeCat == 0 ? "nft-category collect-nft" : "hide"}
							>
								{nftSale[0].image == "Null" ? (
									<div class="null-nft">No NFT`s</div>
								) : (
									nftSale.map((i) => {
										return (
											<div class="nft">
												<div class="nft-image">
													<img src={i.image} />
												</div>
												<div class="nft-content">
													<div class="name">{i.name}</div>
													<div class="name-nft">{i.name}</div>
													<a href="#/nft-details">View Details</a>
													<button
														class="btn-main"
														onClick={() => removeSale(i)}
													>
														Remove from sale
													</button>
												</div>
											</div>
										);
									})
								)}
							</div>
							<div
								className={activeCat == 1 ? "nft-category collect-nft" : "hide"}
							>
								<div className="deposit">
									Your deposit is enough to store {depositSale.deposit} nft{" "}
									<br />
									You are currently selling {depositSale.sale} nft
									{depositSale.avail ? (
										<div>Sale available!</div>
									) : (
										<div>
											Make a deposit to make a sale <br />
											<button className="button-1-square" onClick={depositNft}>
												Deposit
											</button>
										</div>
									)}
									Want to withdraw your deposit? <br />
									<button className="button-1-square" onClick={withdraw}>
										Withdraw
									</button>
								</div>

								{nftCol[0].image == "Null" ? (
									<div class="null-nft">No NFT`s</div>
								) : (
									nftCol.map((i) => {
										return (
											<div class="nft">
												<div class="nft-image">
													<img
														src={i.image} // "https://gateway.pinata.cloud/ipfs/"
													/>
												</div>
												<div class="nft-content">
													<div class="name">{i.name}</div>
													<div class="name-nft">{i.name}</div>
													<a href="#/nft-details">View Details</a>
													{i.onSale ? (
														<div class="onSale">On Sale</div>
													) : (
														<button
															className={
																depositSale.avail ? "btn-main" : "hide"
															}
															onClick={() =>
																setSaleModal({
																	hidden: false,
																	addrNft: i.addrNft,
																	image: i.image,
																	name: i.name,
																	nftInfo: i,
																})
															}
														>
															Sale
														</button>
													)}
												</div>
											</div>
										);
									})
								)}
							</div>
							<div
								className={activeCat == 2 ? "nft-category collect-nft" : "hide"}
							>
								<div class="null-nft">No NFT`s</div>
							</div>
						</div>
						{/* <button onClick={getHash}>Test</button> */}
					</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default ProfilePage;
