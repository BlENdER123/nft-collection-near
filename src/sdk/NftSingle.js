import React, {useState} from "react";
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

	// let dexrootAddr = "0:65988b6da6392ce4d9ce1f79b5386e842c33b4161a2bbe76bdae170db711da31";

	let dexrootAddr =
		"0:65988b6da6392ce4d9ce1f79b5386e842c33b4161a2bbe76bdae170db711da31";

	const zeroAddress =
		"0:0000000000000000000000000000000000000000000000000000000000000000";

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

					<div class="title">Your NFT</div>
					<div class="text">
						NFT art creator’s main goal is to invent, and using NFTour artists
					</div>

					<div class="button-1-square" onClick={deployCollection}>
						Deploy NFT
					</div>

					<div class="button-3-square" onClick={saveZip}>
						Save As
					</div>

					<div class="nft-collection">
						{collection.map((item) => {
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
