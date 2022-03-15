import React, {useState} from "react";
import {HashRouter as Router} from "react-router-dom";

import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {signerKeys, TonClient, signerNone} from "@tonclient/core";

// import fs from 'fs'

// import wasmFile from "./nearWasm/main.wasm";

// const wasmFile = require("./nearWasm/main.wasm");

// import * as wasmFile from "nft_simple";
// const wasmFile = require("wasm-package-near");

// const fs = require("fs");

// console.log(fs.readFileSync(wasmFile));

// console.log(wasmFile);
// console.log(1);

// wasmFile.then((data)=>{
// 	console.log(data);
// 	console.log(1);

// });

//contracts
// import {DeployerColectionContract} from "./collection contracts/nftour/src/build/DeployerColectionContract.js";
// import {NftRootContract} from "./collection contracts/nftour/src/build/NftRootContract.js";
// import {CollectionRoot} from "./collection contracts/nftour/src/build/NftRootContract.js";
// import {StorageContract} from "./collection contracts/nftour/src/build/StorageContract.js";
import {DEXRootContract} from "./test net contracts/DEXRoot.js";

import {DEXClientContract} from "./test net contracts/DEXClient.js";
import {Collections, InsertEmoticon} from "@material-ui/icons";

import {DataContract} from "./collection contracts/DataContract.js";
import {NFTMarketContract} from "./collection contracts/NftMarketContract.js";
import {NftRootColectionContract} from "./collection contracts/NftRootColectionContract.js";

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";

const {contractNft, nearConfig} = require("./config.json");

const {connect, keyStores, WalletConnection} = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

// console.log(config);

const axios = require("axios");

const pidCrypt = require("pidcrypt");
require("pidcrypt/aes_cbc");
const aes = new pidCrypt.AES.CBC();

// function base64ToHex(str) {
// 	const raw = atob(str);
// 	let result = "";
// 	for (let i = 0; i < raw.length; i++) {
// 		const hex = raw.charCodeAt(i).toString(16);
// 		result += hex.length === 2 ? hex : "0" + hex;
// 	}
// 	return result.toUpperCase();
// }

function NftCollection() {
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	let arr = JSON.parse(sessionStorage.getItem("collection"));
	let arrName = JSON.parse(sessionStorage.getItem("collectionName"));

	const [collection, setCollection] = useState(arr);
	const [collectionName, setCollectionName] = useState(arrName);

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	const [avatar, setAvatar] = useState();

	// let marketrootAddr = config.marketroot;

	async function connectNear() {
		console.log(1);

		window.near = await nearAPI.connect({
			deps: {
				keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
			},
			...nearConfig,
		});

		// Needed to access wallet login
		window.walletConnection = new nearAPI.WalletConnection(window.near);

		// Initializing our contract APIs by contract name and configuration.
		// window.contract = await new nearAPI.Contract(
		// 	window.walletConnection.account(),
		// 	nearConfig.contractName,
		// 	{
		// 		// View methods are read-only – they don't modify the state, but usually return some value
		// 		viewMethods: ["nft_metadata", "nft_supply_for_owner", "nft_tokens"],
		// 		// Change methods can modify the state, but you don't receive the returned value when called
		// 		changeMethods: ["nft_mint", "new_default_meta", "new", "mint"],
		// 		// Sender is the account ID to initialize transactions.
		// 		// getAccountId() will return empty string if user is still unauthorized
		// 		sender: window.walletConnection.getAccountId(),
		// 	},
		// );

		// console.log(contract);
	}

	window.nearInitPromise = connectNear();

	async function deployCollection() {
		const pinataKey = "0a2ed9f679a6c395f311";
		const pinataSecretKey =
			"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";

		let deployData = JSON.parse(sessionStorage.getItem("details"));
		console.log(deployData);

		const account = await near.account(walletConnection.getAccountId());

		console.log(fs);

		const response = await account.deployContract(
			fs.readFileSync("./nearWasm/main.wasm"),
		);

		console.log(response);
		// contract
		// 	.new({
		// 		owner_id: window.walletConnection.getAccountId(),
		// 		metadata: {
		// 			spec: "nft-1.0.0",
		// 			name: deployData.projectName,
		// 			symbol: "RTEAMTEST",
		// 			icon: null,
		// 			base_uri: null,
		// 			reference: null,
		// 			reference_hash: null,
		// 		},
		// 	})
		// 	.then(async (data) => {
		// 		console.log(data);

		// 		for (let i = 0; i < collection.length; i++) {
		// 			const url = collection[i];
		// 			await fetch(url)
		// 				.then((res) => res.blob())
		// 				.then((blob) => {
		// 					const file = new File([blob], "File name", {type: "image/png"});

		// 					const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

		// 					let data = new FormData();

		// 					data.append("file", file);

		// 					return axios
		// 						.post(url, data, {
		// 							maxBodyLength: "Infinity",
		// 							headers: {
		// 								"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
		// 								pinata_api_key: pinataKey,
		// 								pinata_secret_api_key: pinataSecretKey,
		// 							},
		// 						})
		// 						.then(async function (response) {
		// 							console.log(response.data.IpfsHash);

		// 							contract
		// 								.nft_mint(
		// 									{
		// 										token_id: i.toString(),
		// 										metadata: {
		// 											title: collectionName[i],
		// 											description: deployData.projectDescription,
		// 											media:
		// 												"https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
		// 											copies: 1,
		// 										},
		// 										receiver_id: walletConnection.getAccountId(),
		// 									},
		// 									"30000000000000",
		// 									"7490000000000000000000",
		// 								)
		// 								.then((data) => {
		// 									console.log(data);
		// 								});

		// 						})
		// 						.catch(function (error) {
		// 							console.error(error);
		// 						});
		// 				});
		// 		}

		// 	});

		// let decrypted = aes.decryptText(sessionStorage.getItem("seedHash"), "5555");

		// const acc = new Account(NFTMarketContract, {
		// 	address: marketrootAddr,
		// 	signer: signerNone(),
		// 	client,
		// });

		// const clientAcc = new Account(DEXClientContract, {
		// 	address: sessionStorage.getItem("address"),
		// 	signer: signerKeys(await getClientKeys(decrypted)),
		// 	client,
		// });

		// save avatar to IPFS

		// if (avatar == undefined || avatar == "") {
		// 	console.log("Enter avatar");
		// 	return;
		// }

		// await fetch(avatar)
		// 	.then((res) => res.blob())
		// 	.then((blob) => {
		// 		const file = new File([blob], "File name", {type: "image/png"});

		// 		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

		// 		let data = new FormData();

		// 		data.append("file", file);

		// 		return axios
		// 			.post(url, data, {
		// 				maxBodyLength: "Infinity",
		// 				headers: {
		// 					"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
		// 					pinata_api_key: pinataKey,
		// 					pinata_secret_api_key: pinataSecretKey,
		// 				},
		// 			})
		// 			.then(async function (response) {
		// 				console.log(response.data.IpfsHash);
		// 				//deploy Collection
		// 				try {
		// 					const {body} = await client.abi.encode_message_body({
		// 						abi: {type: "Contract", value: NFTMarketContract.abi},
		// 						signer: {type: "None"},
		// 						is_internal: true,
		// 						call_set: {
		// 							function_name: "deployColection",
		// 							input: {
		// 								name: deployData.projectName,
		// 								description: deployData.projectDescription,
		// 								icon: response.data.IpfsHash,
		// 							},
		// 						},
		// 					});

		// 					const res = await clientAcc.run("sendTransaction", {
		// 						dest: marketrootAddr,
		// 						value: 1200000000,
		// 						bounce: true,
		// 						flags: 3,
		// 						payload: body,
		// 					});
		// 					console.log(res);
		// 				} catch (e) {
		// 					console.log(e);
		// 				}
		// 			})
		// 			.catch(function (error) {
		// 				console.error(error);
		// 			});
		// 	});

		// console.log(1);

		// let idLastCol;

		// try {
		// 	const response = await acc.runLocal("getInfo", {});
		// 	let value0 = response;
		// 	idLastCol = response.decoded.output.countColections - 1;
		// 	console.log("value0", value0);
		// } catch (e) {
		// 	console.log("catch E", e);
		// }

		// console.log(idLastCol);

		// let nftRoot;

		// try {
		// 	const response = await acc.runLocal("resolveNftRoot", {
		// 		addrOwner: sessionStorage.getItem("address"),
		// 		id: idLastCol,
		// 	});
		// 	let value0 = response;
		// 	nftRoot = response.decoded.output.addrNftRoot;
		// 	console.log("value0", value0);
		// } catch (e) {
		// 	console.log("catch E", e);
		// }

		// console.log(nftRoot);

		// const acc1 = new Account(NftRootColectionContract, {
		// 	address: nftRoot,
		// 	signer: signerNone(),
		// 	client,
		// });

		// save imgs to IPFS
	}

	function closeError() {
		console.log(1);
		setErrorModal({
			hidden: false,
			message: "",
		});
	}

	function test(event) {
		let file = event.target.files[0];

		if (event.target.files[0].size / 1024 / 1024 > 1) {
			setErrorModal({
				hidden: true,
				message: "Image is larger than 1MB",
			});
			return;
		}

		var image = new Image();
		image.src = URL.createObjectURL(file);
		image.onload = function () {
			setAvatar(image.src);
		};
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	return (
		<Router>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "error-bg" : "hide"
				}
			>
				<span onClick={close}></span>
			</div>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "App-error" : "App App2"
				}
			>
				<Header activeCat={1}></Header>

				<div class="collection">
					<div
						className={errorModal.hidden === true ? "error-modal-img" : "hide"}
					>
						<button className="close" onClick={closeError}>
							<span></span>
							<span></span>
						</button>
						<img src={errorModal.message}></img>
						{/* <div className="message">{errorModal.message}</div> */}
					</div>

					<div class="title">Your Collection</div>
					<div class="text">
						NFT art creator’s main goal is to invent, and using NFTour artists
					</div>

					<div class="button-1-square" onClick={deployCollection}>
						Deploy Collection
					</div>

					{/* <div class="button-3-square" onClick={savePinata}>Save As</div> */}

					<div class="nft-avatar">
						<input
							type="file"
							id="input_avatar"
							accept=".png,.jpg,.jpeg"
							onChange={test}
						/>

						<div class="nft-img">
							<img src={avatar} />
							<label for="input_avatar" class="input-avatar-btn">
								<span>1</span>
							</label>
						</div>

						<div class="title">Collection avatar</div>
					</div>

					<div class="nft-collection">
						{collection.map((item, index) => {
							return (
								<div
									class="nft-element"
									onClick={() =>
										setErrorModal({
											hidden: true,
											message: item,
										})
									}
								>
									<img src={item} />
									<div class="title">{collectionName[index]}</div>
								</div>
							);
						})}
					</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default NftCollection;
