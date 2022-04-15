import React, {useState, useEffect} from "react";
import {HashRouter as Router, useHistory} from "react-router-dom";

import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {signerKeys, TonClient, signerNone} from "@tonclient/core";

import mergeImages from "merge-images";

// import radIco from "./img/radiance.ico";

// const fileBuffer = Buffer.from("./main.wasm", 'base64');

// console.log(fileBuffer);
// console.log(1);

// function readFile() {
// 	const reader = new FileReader();
// 	reader.readAsDataURL("./main.wasm");
// 	reader.onload = function () {
// 		const fileBuffer = Buffer.from(reader.result, 'base64');
// 		console.log(fileBuffer);
// 	};
// 	reader.onerror = function (error) {
// 		console.log('Error: ', error);
// 	  };
// }
// readFile();

// import fs from 'fs'

// import wasmFile from "./nearWasm/factorial.wasm";

// wasmFile().then(instance => {
// 	const factorial = instance.instance.exports._Z4facti;

// 	console.log(factorial(1)); // 1
// 	console.log(factorial(2)); // 2
// 	console.log(factorial(3)); // 6
// });

// wasmFile().then();

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

import * as JSZIP from "jszip";

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";

const {contractNft, nearConfig, contractRootNft} = require("./config.json");

const {connect, keyStores, WalletConnection} = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const sha256 = require("js-sha256");

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

let classArr = JSON.parse(localStorage.getItem("class"));

function getSrc(src) {
	return "https://cloudflare-ipfs.com/ipfs/" + src;
}

async function getResizeMany() {
	let tempArr = [];
	for (let i = 0; i < classArr.length; i++) {
		let tempArrImg = [];
		for (let j = 0; j < classArr[i].imgs.length; j++) {
			let res = await getResize(
				classArr[i].imgs[j],
				classArr[i].width,
				classArr[i].height,
			);
			tempArrImg.push(res);
		}
		tempArr.push(tempArrImg);
	}

	console.log(tempArr);
	return tempArr;
}

function getResize(img, width, height) {
	return new Promise((resolve, reject) => {
		var image = new Image();
		image.src = getSrc(img);
		console.log(getSrc(img));

		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		var ctx = canvas.getContext("2d");
		// ctx.drawImage(image, 0, 0, width, height);

		// console.log(canvas);

		image.setAttribute("crossorigin", "anonymous");

		image.onload = function () {
			ctx.drawImage(image, 0, 0, width, height);
			resolve(canvas.toDataURL("image/png"));
		};

		//console.log(canvas.toDataURL("image/png"));

		// var dataURL = canvas.toDataURL("image/png");
		// console.log(dataURL);
		// return dataURL;
	});
}

function NftCollection() {
	let history = useHistory();
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	// useEffect(()=>{
	// 	let uniq = JSON.parse(sessionStorage.getItem("uniqFor"));
	// 	console.log(uniq);
	// },[]);

	useEffect(async () => {
		const {providers} = require("near-api-js");

		const provider = new providers.JsonRpcProvider(
			"https://archival-rpc.testnet.near.org",
		);

		let uniqFor = JSON.parse(sessionStorage.getItem("uniqFor"));
		// console.log(uniq);

		// let classArr;

		let tempCollection = [];

		const asyncFunction = async function () {
			return await getResizeMany();
		};
		asyncFunction().then(async (res) => {
			let tempArr = [];
			console.log(res);
			console.log(classArr.length);
			for (let i = 0; i < classArr.length; i++) {
				let temp = classArr[i];
				temp.src = res[i];
				tempArr.push(temp);
			}
			console.log(tempArr);
			classArr = tempArr;

			console.log(classArr);

			for (let i = 0; i < uniqFor.length; i++) {
				let tempCur = uniqFor[i].split(",");
				// console.log(tempCur);
				//alertM("Saved!");
				let mergeArr = [];

				let indexArr = [];

				for (let i = 0; i < classArr.length; i++) {
					for (let j = 0; j < classArr[i].imgs.length; j++) {
						if (classArr[i].imgs[j] == classArr[i].imgs[tempCur[i]]) {
							mergeArr.push({
								src: classArr[i].src[j],
								x: classArr[i].x,
								y: classArr[i].y,
							});
							indexArr.push(classArr[i].z_index);
						}
					}
				}

				for (let i = 0; i < indexArr.length; i++) {
					for (let j = 0; j < indexArr.length; j++) {
						if (indexArr[j] > indexArr[j + 1]) {
							let temp = indexArr[j];
							let temp1 = mergeArr[j];
							indexArr[j] = indexArr[j + 1];
							mergeArr[j] = mergeArr[j + 1];
							indexArr[j + 1] = temp;
							mergeArr[j + 1] = temp1;
						}
					}
				}

				console.log(indexArr);
				console.log(mergeArr);

				await mergeImages(mergeArr, {
					width: localStorage.getItem("width"),
					height: localStorage.getItem("height"),
				}).then((b64) => tempCollection.push(b64));
			}

			console.log(tempCollection);

			setCollection(tempCollection);

			let hashTrans = document.location.search.split("?transactionHashes=")[1];
			// let hashTrans = "H1Wh3Kf96NWE56HwGLnajVtQGB55rsXAgTTopHdWX72N";
			if (hashTrans != undefined) {
				console.log(hashTrans);
				async function hashLog() {
					const result = await provider.txStatus(
						hashTrans,
						window.walletConnection.getAccountId(),
					);

					// const transDet = await connectNear();

					// console.log(provider);

					// const response = await provider.txStatus(
					// 	hashTrans,
					// 	window.walletConnection.getAccountId()
					// );

					if (result.status.Failure == undefined) {
						console.log(result);
						let event;
						let token_id;
						try {
							event = JSON.parse(
								result.receipts_outcome[0].outcome.logs[0].split(
									"EVENT_JSON:",
								)[1],
							).event;
							token_id = JSON.parse(
								result.receipts_outcome[0].outcome.logs[0].split(
									"EVENT_JSON:",
								)[1],
							).token_ids[0];
						} catch {
							event = result.transaction.actions[0].FunctionCall.method_name;
						}

						console.log(event);

						if (event == "deploy_contract_code") {
							setActiveButtons([false, true, false]);
							console.log(1);
							return;
						}
						if (event == "new") {
							setActiveButtons([false, false, true]);
							console.log(1);
							setErrorModal({
								hidden: true,
								message:
									"Collection successfully created, go to profile to view",
								img: "",
							});
							return;
						}
						if (event == "nft_mint" && token_id + 1 != collection.length) {
							setActiveButtons([false, false, true]);
							console.log("dep");
							return;
						}
						if (event == "nft_mint") {
							setActiveButtons([false, false, false]);
							console.log("complete");
							return;
						}
					} else {
						console.log("error");
						// if(event=="new") {
						// 	setActiveButtons([false,true,false]);
						// 	return;
						// }
						return;
					}
				}
				hashLog();
			} else {
				console.log("No trans");
				setActiveButtons([true, false, false]);
				console.log("dep");
				return;
			}
		});

		// console.log(classArr);
	}, []);

	let arr = JSON.parse(sessionStorage.getItem("collection"));
	let arrName = JSON.parse(sessionStorage.getItem("collectionName"));

	let details = JSON.parse(sessionStorage.getItem("details"));

	console.log(arrName);

	const [collection, setCollection] = useState([]);
	const [collectionName, setCollectionName] = useState(arrName);

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	const [activeButtons, setActiveButtons] = useState([false, false, false]);

	const [nearInit, setNearInit] = useState(false);

	// const [addrCol, setAddrCol] = useState();

	const [avatar, setAvatar] = useState();

	const [loaderMult, setLoaderMult] = useState(false);

	// let marketrootAddr = config.marketroot;

	async function connectNear() {
		// Initializing connection to the NEAR DevNet.
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

		window.contractRoot = await new nearAPI.Contract(
			window.walletConnection.account(),
			contractRootNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				// viewMethods: ['get_num'],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["deploy_contract_code"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);
	}

	if (!nearInit) {
		window.nearInitPromise = connectNear().then(() => {
			console.log(1);
			setNearInit(true);
		});
	}

	async function deployCollection() {
		const pinataKey = "0a2ed9f679a6c395f311";
		const pinataSecretKey =
			"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";

		const {keyStores} = nearAPI;
		const keyStore = new keyStores.BrowserLocalStorageKeyStore();

		const {connect} = nearAPI;

		const config = {
			networkId: "testnet",
			keyStore, // optional if not signing transactions
			nodeUrl: "https://rpc.testnet.near.org",
			walletUrl: "https://wallet.testnet.near.org",
			helperUrl: "https://helper.testnet.near.org",
			explorerUrl: "https://explorer.testnet.near.org",
		};
		const near = await connect(config);

		let deployData = JSON.parse(sessionStorage.getItem("details"));
		console.log(deployData);

		const account = await near.account(walletConnection.getAccountId());

		console.log(account);
		console.log(walletConnection.isSignedIn());

		const bal = await account.getAccountBalance();

		console.log(bal);

		// const res = await account.sendMoney(
		// 	"radiance.testnet", // receiver account
		// 	"100000000000000000000000" // amount in yoctoNEAR
		//   );

		// console.log(res);

		// const response = await account.deployContract(fileBuffer);

		// console.log(response);
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

	async function multTrans() {
		setActiveButtons([false, false, false]);

		setLoaderMult(true);

		console.log(1);

		let addr = sessionStorage.getItem("addrCol");

		// window.contractCollection = await new nearAPI.Contract(
		// 	window.walletConnection.account(),
		// 	addr,
		// 	{
		// 		// View methods are read-only – tfey don't modify the state, but usually return some value
		// 		// viewMethods: ['get_num'],
		// 		// Change methods can modify the state, but you don't receive the returned value when called
		// 		changeMethods: ["new", "nft_mint"],
		// 		// Sender is the account ID to initialize transactions.
		// 		// getAccountId() will return empty string if user is still unauthorized
		// 		sender: window.walletConnection.getAccountId(),
		// 	},
		// );

		const acc = await near.account(addr);

		let pubKey = JSON.parse(keyStore.localStorage.undefined_wallet_auth_key)
			.allKeys[0];

		console.log(near);

		let status = await near.connection.provider.status();
		console.log(status);

		const accessKey = await near.connection.provider.query(
			`access_key/${window.walletConnection.getAccountId()}/${pubKey.toString()}`,
			"",
		);

		const nonce = ++accessKey.nonce;

		console.log(nonce, accessKey);

		const recentBlockHash = nearAPI.utils.serialize.base_decode(
			accessKey.block_hash,
		);

		console.log(recentBlockHash);

		console.log(nearAPI.utils.key_pair.PublicKey.fromString(pubKey));

		let deployData = JSON.parse(sessionStorage.getItem("details"));

		let actionsTrans = [];

		actionsTrans.push(
			nearAPI.transactions.functionCall(
				"new",
				{
					owner_id: window.walletConnection.getAccountId(),
					metadata: {
						spec: "nft-1.0.0",
						name: deployData.projectName,
						symbol: "RTEAM",
						icon: "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8Ap6alAKekngB+g5QAQV64OxtL7tclVPPPJFLw0hlM+/IbTfn0Fkr9+h5P9+guVMdsaoXWABobMgAAAAAA////AIODfgCck3MAX3S+VApE//8YTf//Klbr1RZK//8SR///GEv8/yNS8/kdT/j7E0j7+k919G8ZFhcAAAAAAP///wAVEyMALTdqKh1W//8QR///KFXrxh1M9+8LQ///J1Tt1CZU8sgcT/zoJVTz2x9M6+AbUv/6Jzh8QDMyNQD///8AsqmfADVa4aYDQP//G0z6/yRV/esgUvXhTG3YXnCDvgBKY68tIk/t0wdC//8XS///EEf9/yld//ZXY4wF////AHqT0hopWPjhEUb//xdM/f8sTd2YVXe8DGmFwABtgskAWWqRAFxjfQBCXLd0HVL89hhM/f8LRv//PFi5Yf///wAiUueGIVDz/iFQ9O8OSP//R1y0NW57ngBsgcAAaoDGAEdhsQCCjrwAh5TBACtW6cQdTfXqDkb//zFc9Jr///8AH1H/pRxN9f8wWOe5Az7//4qXw0zPwJcAu7GZAIaSwAAlVvsALF7/ACZX/x0dTvf0L1jmwR9P+f4ZTPew////ACpV7IoQR///JFL03yNS8uJfdsMyi5OtAJqdqwBYZp0AQGLlAGeB3ABpg98KFUn+/x9P9fMqVez3Gkz4r////wBJZ+VQD0f//xdK/f8ZTPfvNVbHVl9wtgCJkbcAOEyOAGJywQCLjZcAc4fFNxNH/f8SR///HU/5/Etp0Vn///8AgI+2BC1d/+8ORP//E0j9/xdL//86X+Wkgo67IU9ZfwBidMYAMlbVfxxM8d4cTvj4FUn//xRI9/tyfJAA////AE1JLwA2TIFMFFD//yNS9u8eT/bxEkj//y9Y5rQ2VcNzJFP21BBH//8lUe3VHE/6/QQ///8uVNiVgIWfAP///wAwL24ATEZsAENk1HsfVP/1JlPv1iNR8NYbTfjrFEv//w5G//8mU+/VJ1Pr0AA9//8gTvTV0NPnA97f8wD///8AXV3CAGJetgBhYocALFDFlRFL//8MRf//EUb9/xpN/P8WS///JFH27hBH//8iUOS3Z3qzCP///wD///8A////AFRUqwBYWbAAWFl/AGVthABngdIzK1PikyVV+dYYS/nuLlbjpipR149NcuJXb4PDAGV5pADy7/8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//8AAOAPAADABwAAgAMAAIEBAAADwQAAB+EAAAfBAAAHwQAAB8EAAAGDAACAAwAAwAMAAOAHAADwHwAA//8AAA==",
						base_uri: null,
						reference: null,
						reference_hash: null,
					},
				},
				"30000000000000",
				"0",
			),
		);

		const pinataKey = "0a2ed9f679a6c395f311";
		const pinataSecretKey =
			"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";

		for (let i = 0; i < collection.length; i++) {
			const url = collection[i];
			await fetch(url)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], "File name", {type: "image/png"});

					const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

					let data = new FormData();

					data.append("file", file);

					return axios
						.post(url, data, {
							maxBodyLength: "Infinity",
							headers: {
								"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
								pinata_api_key: pinataKey,
								pinata_secret_api_key: pinataSecretKey,
							},
						})
						.then(async function (response) {
							console.log(response.data.IpfsHash);

							actionsTrans.push(
								nearAPI.transactions.functionCall(
									"nft_mint",
									{
										token_id: i.toString(),
										metadata: {
											title: collectionName[i],
											description: deployData.projectDescription,
											media: response.data.IpfsHash,
											copies: 1,
										},
										receiver_id: walletConnection.getAccountId(),
									},
									"30000000000000",
									"7490000000000000000000",
								),
							);

							// contractCollection
							// 	.nft_mint(
							// 		{
							// 			token_id: nft[1].toString(),
							// 			metadata: {
							// 				title: collectionName[nft[1]],
							// 				description: deployData.projectDescription,
							// 				media: response.data.IpfsHash,
							// 				copies: 1,
							// 			},
							// 			receiver_id: walletConnection.getAccountId(),
							// 		},
							// 		"30000000000000",
							// 		"7490000000000000000000",
							// 	)
							// 	.then((data) => {
							// 		console.log(data);
							// 	});
						})
						.catch(function (error) {
							console.error(error);
						});
				});
		}

		console.log(actionsTrans);

		const transaction = nearAPI.transactions.createTransaction(
			walletConnection.getAccountId(),
			nearAPI.utils.key_pair.PublicKey.fromString(pubKey),
			addr,
			nonce,
			actionsTrans,
			recentBlockHash,
		);

		console.log(transaction);
		// console.log(nearAPI.sha256("123"));

		// const serTx = nearAPI.utils.serialize.serialize(
		// 	nearAPI.transactions.SCHEMA,
		// 	transaction
		// )

		// const serializedTxHash = new Uint8Array(sha256.sha256.array(serTx));

		// const signature = keyPair.sign(serializedTxHash);

		// const bytes = transaction.encode();
		// console.log(bytes);

		// const msg = new Uint8Array(sha256.sha256.array(bytes));
		// console.log(msg);

		// const signature = await signer.signMessage(msg,window.walletConnection.getAccountId(), "default");

		// const signedTx = new SignedTransaction({
		// 	transaction,
		// 	signature: new Signature(signature.signature),
		// })

		// console.log(signedTx);

		// console.log(nearAPI.transactions.createTransaction);

		try {
			const result = await walletConnection.requestSignTransactions([
				transaction,
			]);

			console.log(result);
		} catch {
			setErrorModal({
				hidden: true,
				message: "Connect Wallet",
				img: "",
			});
		}
	}

	async function deployColectionNear() {
		console.log(1);

		let length = 20;
		let result = "";
		let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
		let charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		console.log(result + contractRootNft);

		sessionStorage.setItem("addrCol", result + "." + contractRootNft);

		sessionStorage.setItem("curentAction", "deploy");

		console.log(sessionStorage.getItem("collection"));

		contractRoot
			.deploy_contract_code(
				{
					account_id: result + "." + contractRootNft,
				},
				"30000000000000",
				"7490000000000000000000000",
			)
			.catch((err) => {
				setErrorModal({
					hidden: true,
					message: "Connect Wallet",
					img: "",
				});
			});

		// let functionCallResult = await walletConnection.account().functionCall({
		// 	contractId: contractRootNft,
		// 	methodName: 'deploy_contract_code',
		// 	args: {account_id: "234ertervbfsddf23rf1."+contractRootNft},
		// 	// gas: DEFAULT_FUNCTION_CALL_GAS, // optional param, by the way
		// 	attachedDeposit: 0,
		// 	// walletMeta: '', // optional param, by the way
		// 	// walletCallbackUrl: '' // optional param, by the way
		//   });
	}

	async function initCollection() {
		console.log(2);
		let addr = sessionStorage.getItem("addrCol");

		window.contractCollection = await new nearAPI.Contract(
			window.walletConnection.account(),
			addr,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				// viewMethods: ['get_num'],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["new"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		sessionStorage.setItem("curentAction", "init");
		//?transactionHashes=Eo49vvUqQZ9NwC8abasWYzcsyaMLHHHcUdsVXYS9ZH9L

		let deployData = JSON.parse(sessionStorage.getItem("details"));

		contractCollection
			.new({
				owner_id: window.walletConnection.getAccountId(),
				metadata: {
					spec: "nft-1.0.0",
					name: deployData.projectName,
					symbol: "RTEAM",
					icon: null,
					base_uri: null,
					reference: null,
					reference_hash: null,
				},
			})
			.then((data) => {
				console.log(data);
			});
	}

	async function deployNft(nft) {
		console.log(nft);

		let addr = sessionStorage.getItem("addrCol");

		window.contractCollection = await new nearAPI.Contract(
			window.walletConnection.account(),
			addr,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				// viewMethods: ['get_num'],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["new", "nft_mint"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		if (nft[1] + 1 == collection.length) {
			sessionStorage.setItem("curentAction", "deployNft");
		} else {
			sessionStorage.setItem("curentAction", "deploingNft");
		}

		let deployData = JSON.parse(sessionStorage.getItem("details"));

		// console.log(nft[1]+1, collection.length);

		const pinataKey = "0a2ed9f679a6c395f311";
		const pinataSecretKey =
			"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";

		const url = collection[nft[1]];
		await fetch(url)
			.then((res) => res.blob())
			.then((blob) => {
				const file = new File([blob], "File name", {type: "image/png"});

				const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

				let data = new FormData();

				data.append("file", file);

				return axios
					.post(url, data, {
						maxBodyLength: "Infinity",
						headers: {
							"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
							pinata_api_key: pinataKey,
							pinata_secret_api_key: pinataSecretKey,
						},
					})
					.then(async function (response) {
						console.log(response.data.IpfsHash);

						contractCollection
							.nft_mint(
								{
									token_id: nft[1].toString(),
									metadata: {
										title: collectionName[nft[1]],
										description: deployData.projectDescription,
										media: response.data.IpfsHash,
										copies: 1,
									},
									receiver_id: walletConnection.getAccountId(),
								},
								"30000000000000",
								"7490000000000000000000",
							)
							.then((data) => {
								console.log(data);
							});
					})
					.catch(function (error) {
						console.error(error);
					});
			});
	}

	function closeError() {
		console.log(1);
		setErrorModal({
			hidden: false,
			message: "",
		});
	}

	async function saveZip() {
		var zip = new JSZIP();
		// zip.file("Hello.txt", "Hello World\n");
		// var img = zip.folder("images");

		for (let i = 0; i < collection.length; i++) {
			console.log(collectionName[i]);
			const url = collection[i];
			await fetch(url)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], "File name", {type: "image/png"});

					console.log(file);

					zip.file(collectionName[i] + ".png", file, {base64: true});

					// let data = new FormData();

					// data.append("file", file);

					// console.log(data);
				});
		}

		zip.generateAsync({type: "blob"}).then(function (content) {
			// see FileSaver.js
			console.log(URL.createObjectURL(content));

			var link = document.createElement("a");

			// link.setAttribute('href', URL.createObjectURL(content));

			// link.setAttribute('download', 'collection.zip');

			link.href = URL.createObjectURL(content);
			link.download = "collection.zip";

			console.log(link.click());

			link.click();
			return false;
			// saveAs(content, "example.zip");
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
				<span className={connectWallet ? "" : "hide"} onClick={close}></span>
			</div>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "App-error" : "App App2"
				}
			>
				<Header activeCat={1}></Header>

				<div class="construtors constructors-col">
					<div class="container-header">
						<div
							className={
								errorModal.hidden === true ? "error-modal-img" : "hide"
							}
						>
							{/* <span onClick={closeError}></span> */}
							<button className="close" onClick={closeError}>
								<span></span>
								<span></span>
							</button>
							{errorModal.img ? <img src={errorModal.img}></img> : null}

							<div className="message">{errorModal.message}</div>
						</div>

						<div class="modal-constructor modal-constructor-back">
							<button
								onClick={() => {
									history.push("/nft-generate");
								}}
							></button>
						</div>
						<div class="modal-constructor modal-constructor-param">
							<div class="title">Your Collection</div>
							<div class="desc">
								NFT art creator’s main goal is to invent, and using NFTour
								artists
							</div>
							<div class="owner">
								<div class="avatar">H</div>
								<div class="text">
									<span>Owner</span>
									Hello World
								</div>
							</div>
							<div class="subtitle">Collection Name</div>
							<div style={{margin: "0px 0px 20px 0px"}} class="desc">
								New Collection
							</div>
							<div class="subtitle">Description</div>
							<div class="desc">
								Tattooed Kitty Gang (“TKG”) is a collection of 666 badass kitty
								gangsters, with symbol of tattoos, living in the Proud Kitty
								Gang (“PKG”) metaverse. Each TKG is an{" "}
							</div>
							<div class="show">Show full description </div>
							<div class="price">
								<div class="subtitle">Mint Price</div>
								<div class="near">
									<span></span> <div class="price">10,50 NEAR</div>
								</div>
							</div>
							<div class="button-4-square">
								<span></span>Download project
							</div>
							{/* <div class="button-1-square">Publish Collection</div> */}

							<div
								className={
									activeButtons[0]
										? "button-1-square"
										: "button-1-square button-1-square-disabled"
								}
								style={{margin: "0px 0px 10px 0px"}}
								onClick={activeButtons[0] ? deployColectionNear : null}
							>
								Publish Collection
							</div>

							<div
								className={
									activeButtons[1]
										? "button-1-square"
										: "button-1-square button-1-square-disabled"
								}
								onClick={activeButtons[1] ? multTrans : null}
							>
								{loaderMult ? (
									<div className="loader">
										<div></div>
										<div></div>
										<div></div>
									</div>
								) : (
									<span>Publish NFT`s</span>
								)}
							</div>
						</div>
						<div class="modal-constructor modal-constructor-collection">
							<div class="progress">
								<div class="title">Collection generation process</div>
								<div class="bar"></div>
								<span>100/100</span>
							</div>
							<div class="collection">
								{collection.map((item, index) => {
									return (
										<div
											key={"uniqueId" + index}
											className="element"
											// onClick={() =>
											// 	setErrorModal({
											// 		hidden: true,
											// 		message: "",
											// 		img: item,
											// 	})
											// }
										>
											<div class="img">
												<img src={item} />
											</div>
											<div class="nameCol">{details.projectName}</div>
											<div class="name">{details.projectDescription}</div>
										</div>
									);
								})}

								{/* <div class="element">
									<div class="img"></div>
									<div class="nameCol">Untitled Coolection #1239239</div>
									<div class="name">Roboto #2103</div>
								</div> */}
							</div>
						</div>
					</div>
				</div>

				{/* <div className="collection">
					<div
						className={errorModal.hidden === true ? "error-modal-img" : "hide"}
					>
						<button className="close" onClick={closeError}>
							<span></span>
							<span></span>
						</button>
						{errorModal.img ? <img src={errorModal.img}></img> : null}

						<div className="message">{errorModal.message}</div>
					</div>

					<div className="title">Your Collection</div>
					<div className="text">
						NFT art creator’s main goal is to invent, and using NFTour artists
					</div>


					<div
						className={
							activeButtons[0]
								? "button-1-square"
								: "button-1-square button-1-square-disabled"
						}
						onClick={activeButtons[0] ? deployColectionNear : null}
					>
						Deploy Collection
					</div>

					

					<div
						className={
							activeButtons[1]
								? "button-1-square"
								: "button-1-square button-1-square-disabled"
						}
						onClick={activeButtons[1] ? multTrans : null}
					>
						{loaderMult ? (
							<div className="loader">
								<div></div>
								<div></div>
								<div></div>
							</div>
						) : (
							<span>Deploy NFT`s</span>
						)}
					</div>

					

					<div className="button-3-square" onClick={saveZip}>
						Save As
					</div>

					<div className="nft-avatar">
						<input
							type="file"
							id="input_avatar"
							accept=".png,.jpg,.jpeg"
							onChange={test}
						/>

						<div className="nft-img">
							<img src={avatar} />
							<label htmlFor="input_avatar" className="input-avatar-btn">
								<span>1</span>
							</label>
						</div>

						<div className="title">Collection avatar</div>
					</div>

					<div className="nft-collection">
						{collection.map((item, index) => {
							return (
								<div
									key={"uniqueId"+index}
									className="nft-element"
									onClick={() =>
										setErrorModal({
											hidden: true,
											message: "",
											img: item,
										})
									}
								>
									<img src={item} />
									<div className="title">{collectionName[index]}</div>
								</div>
							);
						})}
					</div>
				</div> */}

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default NftCollection;
