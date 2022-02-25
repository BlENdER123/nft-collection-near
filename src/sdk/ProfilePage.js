import React, {useState, useEffect, PropTypes} from "react";
import {connect} from "react-redux";
import {HashRouter as Router, useParams} from "react-router-dom";
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

import {useDispatch, useSelector} from "react-redux";

const config = require("./config.json");

TonClient.useBinaryLibrary(libWeb);

const client = new TonClient({network: {endpoints: [config.DappServer]}});

const pidCrypt = require("pidcrypt");
require("pidcrypt/aes_cbc");
const aes = new pidCrypt.AES.CBC();

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

function ProfilePage() {
	const params = useParams();

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	let addrUser = params.address;

	const [connectWal, setConnect] = useState(false);

	const [openMenu, setOpenMenu] = useState(false);

	const [activeCat, setActiveCat] = useState(0);

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

	let marketrootAddr = config.marketroot;

	async function getHash() {
		const acc = new Account(NFTMarketContract, {
			address: marketrootAddr,
			signer: signerNone(),
			client,
		});

		// sale nft`s

		let offerCode;

		try {
			const response = await acc.runLocal("resolveCodeHashIndexOffer", {
				addrMarket: marketrootAddr,
				addrOwner: addrUser,
			});
			let value0 = response;
			// offerCode = response.decoded.output.codeHashIndexOffer.split("0x")[1];
			console.log("value0", value0);
		} catch (e) {
			console.log("catch E", e);
		}

		await fetch("https://net.ton.dev/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `
					{accounts(
					filter:{
						  code_hash:{
						  eq:"${offerCode}"
						}
					}){
					  id
					}}
				`,
			}),
		})
			.then((r) => r.json())
			.then(async (data) => {
				let tempData = data.data.accounts;

				console.log(tempData);
			});

		// collectible nft`s

		let rootCode;

		try {
			const response = await acc.runLocal("resolveCodeHashNftRoot", {});
			let value0 = response;
			rootCode = response.decoded.output.codeHashData.split("0x")[1];
			console.log("value0", value0);
		} catch (e) {
			console.log("catch E", e);
		}

		await fetch("https://net.ton.dev/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `
					{accounts(
					filter:{
						  code_hash:{
						  eq:"${rootCode}"
						}
					}){
					  id
					}}
				`,
			}),
		})
			.then((r) => r.json())
			.then(async (data) => {
				let tempData = data.data.accounts;

				console.log(tempData);

				let tempAddr = tempData[0].id;

				const tempAcc = new Account(NftRootColectionContract, {
					address: tempAddr,
					signer: signerNone(),
					client,
				});

				let hashNFT;

				try {
					const response = await tempAcc.runLocal("resolveCodeHashIndex", {
						addrRoot:
							"0:0000000000000000000000000000000000000000000000000000000000000000",
						addrOwner: addrUser,
					});
					let value0 = response;
					hashNFT = response.decoded.output.codeHashIndex.split("0x")[1];
					console.log("value0", value0);
				} catch (e) {
					console.log("catch E", e);
				}

				console.log(hashNFT);

				await fetch("https://net.ton.dev/graphql", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: `
						{accounts(
						filter:{
							code_hash:{
							eq:"${hashNFT}"
							}
						}){
						id
						}}
					`,
					}),
				})
					.then((r) => r.json())
					.then(async (data) => {
						console.log(data);

						// set nft length
						let tempItems = items;
						tempItems[1] = data.data.accounts.length;
						setItems(tempItems);

						if (data.data.accounts.length == 0) {
							return;
						}

						let tempCol = [];

						for (let j = 0; j < data.data.accounts.length; j++) {
							let addrNFT = data.data.accounts[j].id;

							console.log(addrNFT);

							const tempAccIndNFT = new Account(IndexContract, {
								address: addrNFT,
								signer: signerNone(),
								client,
							});

							let addrDataNFT;

							try {
								const response = await tempAccIndNFT.runLocal("getInfo", {});
								let value0 = response;
								addrDataNFT = response.decoded.output.addrData;
								console.log("value0", value0);
							} catch (e) {
								console.log("catch E", e);
							}

							const tempAccDataNFT = new Account(DataContract, {
								address: addrDataNFT,
								signer: signerNone(),
								client,
							});

							try {
								const response = await tempAccDataNFT.runLocal("getInfo", {});
								let value0 = response.decoded.output;
								tempCol.push({
									addrNft: addrNFT,
									name: value0.name,
									desc: value0.description,
									image: value0.meta.json,
								});
								console.log("value0", value0);
							} catch (e) {
								console.log("catch E", e);
							}
						}

						setNftCol(tempCol);
					});

				let test1;

				try {
					const response = await tempAcc.runLocal("resolveData", {
						addrRoot: tempData[4].id,
						id: 1,
					});
					let value0 = response;
					test1 = response.decoded.output.addrData;
					console.log("value0", value0);
				} catch (e) {
					console.log("catch E", e);
				}

				console.log(test1);

				const tempAccData = new Account(DataContract, {
					address: test1,
					signer: signerNone(),
					client,
				});

				try {
					const response = await tempAccData.runLocal("getInfo", {});
					let value0 = response;
					console.log("value0", value0);
				} catch (e) {
					console.log("catch E", e);
				}
			});
	}

	useEffect(() => {
		getHash();
	}, []);

	async function saleNft() {
		console.log(salePrice);
		console.log(saleModal);

		if (salePrice == 0) {
			alert("Set Sale Price");
			return;
		}

		let decrypted = aes.decryptText(sessionStorage.getItem("seedHash"), "5555");

		const clientAcc = new Account(DEXClientContract, {
			address: sessionStorage.getItem("address"),
			signer: signerKeys(await getClientKeys(decrypted)),
			client,
		});

		const indNftAcc = new Account(IndexContract, {
			address: saleModal.addrNft,
			signer: signerNone(),
			client,
		});

		let addrDataNFT;

		try {
			const response = await indNftAcc.runLocal("getInfo", {});
			let value0 = response;
			addrDataNFT = response.decoded.output.addrData;
			console.log("value0", value0);
		} catch (e) {
			console.log("catch E", e);
		}

		const marketAcc = new Account(NFTMarketContract, {
			address: marketrootAddr,
			signer: signerNone(),
			client,
		});

		console.log(addrDataNFT);

		try {
			const {body} = await client.abi.encode_message_body({
				abi: {type: "Contract", value: NFTMarketContract.abi},
				signer: {type: "None"},
				is_internal: true,
				call_set: {
					function_name: "putOnSale",
					input: {
						addrNft: addrDataNFT,
						price: salePrice,
					},
				},
			});

			const res = await clientAcc.run("sendTransaction", {
				dest: marketrootAddr,
				value: 700000000,
				bounce: true,
				flags: 3,
				payload: body,
			});
			console.log(res);
		} catch (e) {
			console.log(e);
		}

		let addrOffer;

		try {
			const response = await marketAcc.runLocal("resolveAddrOffer", {
				addrNft: addrDataNFT,
			});
			let value0 = response;
			addrOffer = response.decoded.output.addrOffer;
			console.log("value0", value0);
		} catch (e) {
			console.log("catch E", e);
		}

		const dataAcc = new Account(DataContract, {
			address: addrDataNFT,
			signer: signerNone(),
			client,
		});

		try {
			const {body} = await client.abi.encode_message_body({
				abi: {type: "Contract", value: DataContract.abi},
				signer: {type: "None"},
				is_internal: true,
				call_set: {
					function_name: "setAddrApproved",
					input: {
						addrApproved: addrOffer,
					},
				},
			});

			const res = await clientAcc.run("sendTransaction", {
				dest: addrDataNFT,
				value: 300000000,
				bounce: true,
				flags: 3,
				payload: body,
			});
			console.log(res);
		} catch (e) {
			console.log(e);
		}

		try {
			const response = await marketAcc.runLocal("resolveCodeHashOffer", {});
			let value0 = response;
			console.log("value0", value0);
		} catch (e) {
			console.log("catch E", e);
		}

		setSalePrice(0);
	}

	async function reloadNft() {
		await getHash();
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
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
					<div class="title">{saleModal.name}</div>
					<div class="image">
						<img src={"https://gateway.pinata.cloud/ipfs/" + saleModal.image} />
					</div>
					<div class="mint owner">
						NFT address: <span>{saleModal.addrNft}</span>
					</div>
					<div class="mint price">
						Set Price
						<input
							type="number"
							onChange={(e) => setSalePrice(e.target.value)}
						/>
					</div>

					<div class="button-1-square" onClick={saleNft}>
						Sale
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
										className={activeCat == 0 ? "active" : ""}
										onClick={() => setActiveCat(0)}
									>
										On Sale
									</span>
									<span
										className={activeCat == 1 ? "active" : ""}
										onClick={() => setActiveCat(1)}
									>
										Collectibles
									</span>
									<span
										className={activeCat == 2 ? "active" : ""}
										onClick={() => setActiveCat(2)}
									>
										Created
									</span>
								</div>

								<button class="btn-main" onClick={reloadNft}>
									Reload
								</button>

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
													<img
														src={"https://gateway.pinata.cloud/ipfs/" + i.image}
													/>
												</div>
												<div class="nft-content">
													<div class="name">{i.name}</div>
													<div class="name-nft">{i.name}</div>
													<a href="#/nft-details">View Details</a>
													<button
														class="btn-main"
														onClick={() =>
															setSaleModal({
																hidden: false,
																addrNft: i.addrNft,
																image: i.image,
																name: i.name,
															})
														}
													>
														Sale
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
								{nftCol[0].image == "Null" ? (
									<div class="null-nft">No NFT`s</div>
								) : (
									nftCol.map((i) => {
										return (
											<div class="nft">
												<div class="nft-image">
													<img
														src={"https://gateway.pinata.cloud/ipfs/" + i.image}
													/>
												</div>
												<div class="nft-content">
													<div class="name">{i.name}</div>
													<div class="name-nft">{i.name}</div>
													<a href="#/nft-details">View Details</a>
													<button
														class="btn-main"
														onClick={() =>
															setSaleModal({
																hidden: false,
																addrNft: i.addrNft,
																image: i.image,
																name: i.name,
															})
														}
													>
														Sale
													</button>
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
