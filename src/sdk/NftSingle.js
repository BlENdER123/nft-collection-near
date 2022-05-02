import React, {useState, useEffect} from "react";
import {HashRouter as Router} from "react-router-dom";

import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {signerKeys, TonClient, signerNone} from "@tonclient/core";

//contracts
// import {DeployerColectionContract} from "./collection contracts/nftour/src/build/DeployerColectionContract.js";
// import {NftRootContract} from "./collection contracts/nftour/src/build/NftRootContract.js";
// import {CollectionRoot} from "./collection contracts/nftour/src/build/NftRootContract.js";
// import {StorageContract} from "./collection contracts/nftour/src/build/StorageContract.js";
import {DEXRootContract} from "./test net contracts/DEXRoot.js";

import {DEXClientContract} from "./test net contracts/DEXClient.js";
import {Collections, InsertEmoticon} from "@material-ui/icons";

import {DataContract} from "./collection contracts/DataContract.js";
import {NftMarketContract} from "./collection contracts/NftMarketContract.js";
import {NftRootColectionContract} from "./collection contracts/NftRootColectionContract.js";

import Header from "./Header";
import Footer from "./Footer";

import * as JSZIP from "jszip";

import {useDispatch, useSelector} from "react-redux";

import * as nearAPI from "near-api-js";

const {
	contractNft,
	singleNFt,
	nearConfig,
	contractRootNft,
} = require("./config.json");

const {connect, keyStores, WalletConnection} = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

TonClient.useBinaryLibrary(libWeb);

const axios = require("axios");

const client = new TonClient({network: {endpoints: ["net.ton.dev"]}});

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

function base64ToHex(str) {
	const raw = atob(str);
	let result = "";
	for (let i = 0; i < raw.length; i++) {
		const hex = raw.charCodeAt(i).toString(16);
		result += hex.length === 2 ? hex : "0" + hex;
	}
	return result.toUpperCase();
}

function NftSingle() {
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	let arr = JSON.parse(localStorage.getItem("collection"));

	const [collection, setCollection] = useState(arr);

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	const [activeButtons, setActiveButtons] = useState([false, false, false]);

	const [nearInit, setNearInit] = useState(false);

	const [loaderMult, setLoaderMult] = useState(false);

	// let dexrootAddr = "0:65988b6da6392ce4d9ce1f79b5386e842c33b4161a2bbe76bdae170db711da31";

	let dexrootAddr =
		"0:65988b6da6392ce4d9ce1f79b5386e842c33b4161a2bbe76bdae170db711da31";

	const zeroAddress =
		"0:0000000000000000000000000000000000000000000000000000000000000000";

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

	useEffect(() => {
		const {providers} = require("near-api-js");

		const provider = new providers.JsonRpcProvider(
			"https://archival-rpc.testnet.near.org",
		);

		let hashTrans = document.location.search.split("transactionHashes=")[1];
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
					if (event == "nft_mint") {
						setActiveButtons([false, false, true]);
						setErrorModal({
							hidden: true,
							message: "NFT successfully created, go to profile to view",
							img: "",
						});
						console.log(1);
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
	}, []);

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
		contractRoot
			.deploy_contract_code(
				{
					account_id: result + "." + contractRootNft,
				},
				"30000000000000",
				"17490000000000000000000000",
			)
			.catch((err) => {
				setErrorModal({
					hidden: true,
					message: "Connect Wallet",
					img: "",
				});
			});
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

		let deployData = JSON.parse(localStorage.getItem("details"));

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
						icon: null,
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
											title: deployData.projectName,
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

	// let functionCallResult = await walletConnection.account().functionCall({
	// 	contractId: contractRootNft,
	// 	methodName: 'deploy_contract_code',
	// 	args: {account_id: "234ertervbfsddf23rf1."+contractRootNft},
	// 	// gas: DEFAULT_FUNCTION_CALL_GAS, // optional param, by the way
	// 	attachedDeposit: 0,
	// 	// walletMeta: '', // optional param, by the way
	// 	// walletCallbackUrl: '' // optional param, by the way
	//   });

	async function deployCollection() {
		// const acc = new Account(DeployerColectionContract, {
		// 	address: dexrootAddr,
		// 	signer: signerNone(),
		// 	client,
		// });

		let decrypted = aes.decryptText(sessionStorage.getItem("seedHash"), "5555");

		console.log(sessionStorage.getItem("address"));
		console.log(decrypted);

		const acc = new Account(NftMarketContract, {
			address: dexrootAddr,
			signer: signerNone(),
			client,
		});

		const clientAcc = new Account(DEXClientContract, {
			address: sessionStorage.getItem("address"),
			signer: signerKeys(await getClientKeys(decrypted)),
			client,
		});

		try {
			const {body} = await client.abi.encode_message_body({
				abi: {type: "Contract", value: NftMarketContract.abi},
				signer: {type: "None"},
				is_internal: true,
				call_set: {
					function_name: "deployColection",
					input: {
						name: "test",
						description: "desc",
					},
				},
			});

			const res = await clientAcc.run("sendTransaction", {
				dest: dexrootAddr,
				value: 1200000000,
				bounce: true,
				flags: 3,
				payload: body,
			});
			console.log(res);
		} catch (e) {
			console.log(e);
		}

		// console.log(sessionStorage.getItem("address"));

		// const response = await acc.runLocal("resolveCodeHashNftRoot", {});
		// let value0 = response;
		// console.log("value0", value0);

		try {
			const response = await acc.runLocal("resolveNftRoot", {
				addrNftMarket: dexrootAddr,
				addrOwner: sessionStorage.getItem("address"),
			});
			let value0 = response;
			console.log("value0", value0);
			// return value0;
		} catch (e) {
			console.log("catch E", e);
			//return e;
		}

		let nftRoot =
			"0:1b92bf5db79cd48a79bd4c23259f7a043219e103b292d369439f8489ed10b482";

		const acc1 = new Account(NftRootColectionContract, {
			address: nftRoot,
			signer: signerNone(),
			client,
		});

		try {
			const {body} = await client.abi.encode_message_body({
				abi: {type: "Contract", value: NftRootColectionContract.abi},
				signer: {type: "None"},
				is_internal: true,
				call_set: {
					function_name: "deployMetadata",
					input: {
						wid: 1,
						name: "name",
						descriprion: "desc",
						contentHash: 1,
						mimeType: "test",
						chunks: 1,
						chunkSize: 1,
						size: 1,
						meta: {
							height: 1,
							width: 1,
							duration: 1,
							extra: "test",
							json: "{IPFS}",
						},
					},
				},
			});

			const res = await clientAcc.run("sendTransaction", {
				dest: nftRoot,
				value: 1200000000,
				bounce: true,
				flags: 3,
				payload: body,
			});
			console.log(res);
		} catch (e) {
			console.log(e);
		}

		//

		// let collectionAddr;

		// try {
		// 	const response = await acc.runLocal("getAddressColections", {});
		// 	let value0 = response.decoded.output.addreses;
		// 	collectionAddr = value0[value0.length - 1];
		// 	console.log("value0", value0);
		// 	//return value0;
		// } catch (e) {
		// 	console.log("catch E", e);
		// 	//return e;
		// }

		// //

		// console.log(collectionAddr);
		// for (let i = 0; i < collection.length; i++) {
		// 	let temp = collection[i].replace(/^data:image\/(png|jpg);base64,/, "");

		// 	//const pattern = new RegExp(".{1," + 10000 + "}", "g");
		// 	let result = temp;

		// 	try {
		// 		const {body} = await client.abi.encode_message_body({
		// 			abi: {type: "Contract", value: NftRootContract.abi},
		// 			signer: {type: "None"},
		// 			is_internal: true,
		// 			call_set: {
		// 				function_name: "deployMetadata",
		// 				input: {
		// 					name: "test",
		// 					description: "test",
		// 					dna: "test",
		// 					attributes: [{_type: "test", value: "string", rarity: 5}],
		// 					chunks: result.length,
		// 					mimeType: "test",
		// 				},
		// 			},
		// 		});

		// 		console.log(collectionAddr, body);

		// 		const res = await clientAcc.run("sendTransaction", {
		// 			dest: collectionAddr,
		// 			value: 2600000000,
		// 			bounce: true,
		// 			flags: 3,
		// 			payload: body,
		// 		});
		// 		console.log(res);
		// 	} catch (e) {
		// 		console.log(e);
		// 	}

		// 	//

		// 	const clientAcc1 = new Account(NftRootContract, {
		// 		address: collectionAddr,
		// 		signer: signerNone(),
		// 		client,
		// 	});

		// 	let imgAddr;
		// 	try {
		// 		const response = await clientAcc1.runLocal("resolveStorage", {
		// 			addrRoot: collectionAddr,
		// 			id: 0,
		// 			addrAuthor: localStorage.address,
		// 		});

		// 		imgAddr = response;
		// 		console.log("value0", imgAddr);

		// 		//return value0;
		// 	} catch (e) {
		// 		console.log("catch E", e);
		// 		//return e;
		// 	}

		// 	const clientStorage = new Account(StorageContract, {
		// 		address: imgAddr,
		// 		signer: signerNone(),
		// 		client,
		// 	});

		// 	for (let j = 0; j < result.length; j++) {
		// 		console.log(typeof TonClient.toHex(result[j]));
		// 		try {
		// 			const {body} = await client.abi.encode_message_body({
		// 				abi: {type: "Contract", value: StorageContract.abi},
		// 				signer: {type: "None"},
		// 				is_internal: true,
		// 				call_set: {
		// 					function_name: "fillContent",
		// 					input: {
		// 						chankNumber: j,
		// 						part: TonClient.toHex(result[j]),
		// 					},
		// 				},
		// 			});

		// 			const res = await clientAcc.run("sendTransaction", {
		// 				dest: imgAddr,
		// 				value: 500000000,
		// 				bounce: true,
		// 				flags: 3,
		// 				payload: body,
		// 			});
		// 			console.log(res);
		// 		} catch (e) {
		// 			console.log(e);
		// 		}
		// 	}

		// 	try {
		// 		const response = await clientStorage.runLocal("getInfo");
		// 		console.log(response);
		// 		//return value0;
		// 	} catch (e) {
		// 		console.log("catch E", e);
		// 		//return e;
		// 	}
		// }

		// try {
		// 	const response = await clientAcc1.runLocal("resolveMetadata", {
		// 		addrRoot: '0:0774b502850fa0ed104a4ed805914782552651c98d45f36272eecf4ac5e67f36',
		// 		id: 0
		// 	});

		// 	let value0 = response;
		// 	console.log("value0", value0);
		// 	//return value0;
		// } catch (e) {
		// 	console.log("catch E", e);
		// 	//return e;
		// }

		// try {
		// 	const response = await clientAcc1.runLocal("getInfo", {});
		// 	let value0 = response;
		// 	console.log("value0", value0);
		// } catch (e) {
		// 	console.log("catch E", e);
		// }

		// let response = await client.processing.process_message(params);
		// //console.log(1);
		// console.log(response);
		// console.log(`Сontract run transaction with output ${response.decoded.output}, ${response.transaction.id}`);
	}

	function closeError() {
		console.log(1);
		setErrorModal({
			hidden: false,
			message: "",
		});
	}

	function test() {
		let bs64;

		var img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = function () {
			var canvas = document.createElement("CANVAS");
			var ctx = canvas.getContext("2d");
			var dataURL;
			canvas.height = this.naturalHeight;
			canvas.width = this.naturalWidth;
			ctx.drawImage(this, 0, 0);
			dataURL = canvas.toDataURL(
				"https://gateway.pinata.cloud/ipfs/Qmbvi4pcWt22YpopW6XfPxtxi4jftABQpoaoqTLtWaZftg",
			);
			console.log(dataURL);
			bs64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
			//callback(dataURL);

			const pattern = new RegExp(".{1," + 15000 + "}", "g");
			let res = bs64.match(pattern);

			console.log(res);
		};
		img.src =
			"https://gateway.pinata.cloud/ipfs/Qmbvi4pcWt22YpopW6XfPxtxi4jftABQpoaoqTLtWaZftg";
		if (img.complete || img.complete === undefined) {
			img.src =
				"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			img.src =
				"https://gateway.pinata.cloud/ipfs/Qmbvi4pcWt22YpopW6XfPxtxi4jftABQpoaoqTLtWaZftg";
		}
	}

	async function saveZip() {
		var zip = new JSZIP();

		for (let i = 0; i < collection.length; i++) {
			const url = collection[i];
			await fetch(url)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], "File name", {type: "image/png"});

					console.log(file);

					zip.file("nft.png", file, {base64: true});

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
			link.download = "single.zip";

			console.log(link.click());

			link.click();
			return false;
			// saveAs(content, "example.zip");
		});
	}

	function savePinata() {
		const pinataKey = "0a2ed9f679a6c395f311";
		const pinataSecretKey =
			"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";
		//console.log(collection);
		for (let i = 0; i < collection.length; i++) {
			//let buff = new Buffer(collection[i], 'base64');

			const url = collection[i];
			fetch(url)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], "File name", {type: "image/png"});

					const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

					let data = new FormData();

					data.append("file", file);

					return axios
						.post(url, data, {
							maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
							headers: {
								"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
								pinata_api_key: pinataKey,
								pinata_secret_api_key: pinataSecretKey,
							},
						})
						.then(function (response) {
							//handle response here
							console.log(response.data.IpfsHash);
						})
						.catch(function (error) {
							//handle error here
							console.error(error);
						});
				});

			// let buff = base64toBlob(collection[i], "img");

			// console.log(buff);
			// fetch(buff)
			// .then(response => response.body)
			// .then(body => {
			// 	console.log(body);
			// 	const reader = body.getReader();
			// 	console.log(reader);

			// 	const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

			// 	let data = new FormData();

			// 	data.append("file", reader);

			// 	return axios
			// 		.post(url, data, {
			// 			maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
			// 			headers: {
			// 				"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
			// 				pinata_api_key: pinataKey,
			// 				pinata_secret_api_key: pinataSecretKey,
			// 			},
			// 		})
			// 		.then(function (response) {
			// 			//handle response here
			// 			console.log(response.data.IpfsHash);

			// 		})
			// 		.catch(function (error) {
			// 			//handle error here
			// 			console.error(error);
			// 		});
			// });
		}
	}

	async function deploySingle() {
		setLoaderMult(true);

		window.contractCollection = await new nearAPI.Contract(
			window.walletConnection.account(),
			singleNFt,
			{
				// View methods are read-only – tfey don't modify the state, but usually return some value
				viewMethods: ["nft_total_supply"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["new", "nft_mint"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		contractCollection.nft_total_supply().then(async (data) => {
			let token_id = data;

			const pinataKey = "0a2ed9f679a6c395f311";
			const pinataSecretKey =
				"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";

			let deployData = JSON.parse(localStorage.getItem("details"));

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

								contractCollection
									.nft_mint(
										{
											token_id: token_id,
											metadata: {
												title: deployData.projectName,
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

								// actionsTrans.push(
								// 	nearAPI.transactions.functionCall(
								// 		"nft_mint",
								// 		{
								// 			token_id: i.toString(),
								// 			metadata: {
								// 				title: deployData.projectName,
								// 				description: deployData.projectDescription,
								// 				media: response.data.IpfsHash,
								// 				copies: 1,
								// 			},
								// 			receiver_id: walletConnection.getAccountId(),
								// 		},
								// 		"30000000000000",
								// 		"7490000000000000000000",
								// 	),
								// );
							})
							.catch(function (error) {
								console.error(error);
							});
					});
			}
		});
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

				<div className="collection">
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

					<div className="title">Your NFT</div>
					<div className="text">
						NFT art creator’s main goal is to invent, and using NFTour artists
					</div>

					{/* <div
						className={
							activeButtons[0]
								? "button-1-square"
								: "button-1-square button-1-square-disabled"
						}
						onClick={activeButtons[0] ? deployColectionNear : null}
					>
						Deploy Storage
					</div> */}

					<div
						className={
							activeButtons[0]
								? "button-1-square"
								: "button-1-square button-1-square-disabled"
						}
						onClick={activeButtons[0] ? deploySingle : null}
					>
						{loaderMult ? (
							<div className="loader">
								<div></div>
								<div></div>
								<div></div>
							</div>
						) : (
							<span>Deploy NFT</span>
						)}
					</div>

					{/* <div onClick={deploySingle}> Deploy 2</div> */}

					<div className="button-3-square" onClick={saveZip}>
						Save As
					</div>

					<div className="nft-collection">
						{collection.map((item, index) => {
							return (
								<div
									key={"uniqueId" + index}
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

export default NftSingle;
