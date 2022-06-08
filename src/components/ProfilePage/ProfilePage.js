import React, {useState, useEffect} from "react";
import {HashRouter as Router, useParams, useNavigate} from "react-router-dom";

import * as nearAPI from "near-api-js";
import {parseNearAmount} from "near-api-js/lib/utils/format";

import {useDispatch, useSelector} from "react-redux";

import {marketNft, nearConfig} from "../../sdk/config.json";
const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

function ProfilePage() {
	useEffect(() => {
		if (document.location.href.split("transactionHashes=")[1]) {
			let href = document.location.origin + document.location.hash;
			document.location.href = href;
		}
	}, []);

	let navigate = useNavigate();

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

	async function getHash() {
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
				limit: 200,
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
							// console.log(data1);

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
		// })

		let accountName = window.walletConnection.account().accountId;

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
						limit: 200,
					})
					.then(async (sales) => {
						contractMarket
							.storage_balance_of({
								account_id: window.walletConnection.getAccountId(),
							})
							.then((data) => {
								if (sales.length < data / 10000000000000000000000) {
									setDepositSale({
										deposit: data / 10000000000000000000000,
										sale: sales.length,
										avail: true,
									});
								} else {
									setDepositSale({
										deposit: data / 10000000000000000000000,
										sale: sales.length,
										avail: false,
									});
								}
							});

						for (let i = 0; i < data.length; i++) {
							let tempAddr = data[i];

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
										limit: 100,
									})
									.then(async (data) => {
										console.log(data);
										for (let j = 0; j < data.length; j++) {
											let info = data[j].metadata;

											let onSale = false;

											for (let k = 0; k < sales.length; k++) {
												if (
													tempAddr == sales[k].nft_contract_id &&
													data[j].token_id == sales[k].token_id
												) {
													onSale = true;
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

	async function saleNft(nft) {
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
				limit: 100,
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
				if (err.name == "Error") {
					walletAccount.requestSignIn("", "Title");
				} else {
					console.log(err);
				}
			});

		setSalePrice(0);
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
		<>
			<div className={"App App2"}>
				{/*<Header activeCat={0}></Header>*/}

				<div className="profile">
					<div className="container">
						<div className="text">Profile</div>

						<div className="addr">
							<span>Address:</span> {addrUser}
						</div>

						<div className="nfts">
							<div className="menu-nft">
								<div className="menu-bar">
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

								{/* <button className="btn-main" onClick={reloadNft}>
									Reload
								</button> */}

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
									<div className="null-nft">No NFT`s</div>
								) : (
									nftSale.map((i) => {
										return (
											<div
												className="nft"
												onClick={() => {
													navigate(
														"/nft-market-nft/" +
															i.addrCol +
															"!token!" +
															i.token_id,
													);
												}}
											>
												<div className="nft-image">
													<img src={i.image} />
												</div>
												<div className="nft-content">
													<div className="name">{i.name}</div>
													<div className="name-nft">{i.name}</div>
												</div>
											</div>
										);
									})
								)}
							</div>
							<div
								className={activeCat == 1 ? "nft-category collect-nft" : "hide"}
							>
								{nftCol[0].image == "Null" ? (
									<div className="null-nft">No NFT`s</div>
								) : (
									nftCol.map((i) => {
										return (
											<div
												className="nft"
												onClick={() => {
													navigate(
														"/nft-market-nft/" +
															i.addrCol +
															"!token!" +
															i.token_id,
													);
												}}
											>
												<div className="nft-image">
													<img
														src={i.image} // "https://gateway.pinata.cloud/ipfs/"
													/>
												</div>
												<div className="nft-content">
													<div className="name">{i.name}</div>
													<div className="name-nft">{i.name}</div>
												</div>
											</div>
										);
									})
								)}
							</div>
							<div
								className={activeCat == 2 ? "nft-category collect-nft" : "hide"}
							>
								<div className="null-nft">No NFT`s</div>
							</div>
						</div>
					</div>
				</div>

				{/*<Footer></Footer>*/}
			</div>
		</>
	);
}

export default ProfilePage;
