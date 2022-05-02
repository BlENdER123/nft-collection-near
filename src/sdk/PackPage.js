import React, {useState, useEffect} from "react";
import {HashRouter as Router, useHistory, useParams} from "react-router-dom";

import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {signerKeys, TonClient, signerNone} from "@tonclient/core";

import mergeImages from "merge-images";

import * as JSZIP from "jszip";

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";

import {NFTStorage} from "nft.storage";

// const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGEwMTJGQWNhM0E5ZWQ0ZEI5MGY2ZmMzZUZFQTc1ZjBBMzZBNmE5MWUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDY2ODgzNjI1OCwibmFtZSI6Ik1hcmtldCJ9.sWJK68Mh8EIHUYusyqoB19mkAsP_KcwnBd7jqq7BZuU'
// const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

const {contractNft, nearConfig, contractRootNft} = require("./config.json");
const {parseNearAmount} = require("near-api-js/lib/utils/format");

const {connect, keyStores, WalletConnection} = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const sha256 = require("js-sha256");

// console.log(config);

const axios = require("axios");

const pidCrypt = require("pidcrypt");
require("pidcrypt/aes_cbc");
const aes = new pidCrypt.AES.CBC();

Object.defineProperty(window, "indexedDB", {
	value:
		window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB,
});

function PackPage() {
	let classArr = JSON.parse(localStorage.getItem("class"));

	// let localClass = arr;
	// loading project from localStorage

	const params = useParams();
	let addrCol = params.address;

	const [collectionName, setCollectionName] = useState("No Name");

	if (
		localStorage.getItem("nft-collection-step") == null ||
		localStorage.getItem("nft-collection-step") == undefined ||
		isNaN(parseInt(localStorage.getItem("nft-collection-step"), 10))
	) {
		localStorage.setItem("nft-collection-step", 1);
	}

	const [curentCollectionStep, setCurentCollectionStep] = useState(
		localStorage.getItem("nft-collection-step"),
	);

	const [amountMintNft, setAmountMintNft] = useState(1);

	const [collectionCount, setCollectionCount] = useState([0,0]);

	const [mintPrice, setMintPrice] = useState("0");

	const [owner, setOwner] = useState("123");

	// console.log(1);

	var openRequest = window.indexedDB.open("imgsStore", 1);
	// localClass = JSON.parse(localStorage.getItem("class"))
	// openRequest.onsuccess = async (event) => {
	// 	let db = event.target.result;

	// 	let store = db.transaction("imgs").objectStore("imgs");

	// 	for (let i = 0; i < classArr.length; i++) {
	// 		for (let j = 0; j < classArr[i].imgs.length; j++) {
	// 			store.get(classArr[i].imgs[j]).onsuccess = (event) => {
	// 				classArr[i].url[j] = URL.createObjectURL(event.target.result);
	// 			};
	// 		}
	// 	}
	// };

	useEffect(async () => {
		console.log("UseEffect minted");

		window.tempContract = await new nearAPI.Contract(
			window.walletConnection.account(),
			addrCol,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: [
					"nft_tokens",
					"nft_supply_for_owner",
					"nft_tokens_for_owner",
					"nft_token",
					"nft_metadata",
					"nft_mint_price",
					"nft_remaining_count",
				],
				// Change methods can modify the state, but you don't receive the returned value when called
				// changeMethods: ["new"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		tempContract.nft_remaining_count({}).then((data) => {
			console.log(data);
			setCollectionCount([data.total_mintable_tokens_count, data.token_matrix]);
		});

		tempContract
			.nft_metadata({})
			.then((data) => {
				console.log(data);
				setCollectionName(data.name);
			})
			.catch((err) => {
				console.log(err);
			});

		// tempContract.nft_tokens({
		// 	from_index: "0",
		// 	limit: 50
		// }).then((data)=>{
		// 	console.log(data);
		// });
		tempContract.nft_mint_price({}).then((data) => {
			console.log(data);
			let endPrice = (data + parseInt(parseNearAmount("0.1")))
				.toLocaleString("fullwide", {useGrouping: false})
				.toString();

			// console.log(endPrice);
			setMintPrice(endPrice);
		});

		tempContract
			.nft_tokens({
				from_index: "0",
				limit: 50,
			})
			.then((data) => {
				console.log(data);
				setOwner(data[0].owner_id);
				let tempCollectionMinted = [];

				for (let i = 0; i < data.length; i++) {
					tempCollectionMinted.push({
						img: "https://cloudflare-ipfs.com/ipfs/" + data[i].metadata.media,
						name: data[i].metadata.title,
						desc: data[i].metadata.description,
						token_id: data[i].token_id,
						
					});
				}

				setCollectionMinted(tempCollectionMinted);
			});
	}, [collectionMinted]);

	const [collectionMinted, setCollectionMinted] = useState([]);

	let realSizes = JSON.parse(localStorage.getItem("realSizes"));
	let nftAreaSize = JSON.parse(localStorage.getItem("nftAreaSize"));
	let sizeIndex = JSON.parse(localStorage.getItem("sizeIndex"));

	// let arr = JSON.parse(sessionStorage.getItem("collection"));
	let arrClass = JSON.parse(localStorage.getItem("class"));
	// let arrName = JSON.parse(sessionStorage.getItem("collectionName"));

	function getSrc(src) {
		return "https://cloudflare-ipfs.com/ipfs/" + src;
	}


	const [isFullDescription, setIsFullDescription] = useState(false);

	async function uploadToNFTStore() {
		const token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGEwMTJGQWNhM0E5ZWQ0ZEI5MGY2ZmMzZUZFQTc1ZjBBMzZBNmE5MWUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDY2ODgzNjI1OCwibmFtZSI6Ik1hcmtldCJ9.sWJK68Mh8EIHUYusyqoB19mkAsP_KcwnBd7jqq7BZuU";
		const nft = new NFTStorage({
			endpoint: "https://api.nft.storage",
			token,
		});

		const files = await filesToFileList(collection);

		//console.log("newnew file", files);

		const directoryHashCID = await nft.storeDirectory(files);
		console.log("NFTStorage CID Directory Hash", directoryHashCID);
		// return await directoryHashCID;
		return new Promise((resolve, reject) => {
			resolve(directoryHashCID);
		});
	}

	async function filesToFileList(dataURLarray) {
		var fileList = new DataTransfer();
		await Promise.all([
			...dataURLarray.map((e, i) =>
				dataURLtoFile(e, i + 1).then((file) => {
					fileList.items.add(file);
				}),
			),
		]);
		return await fileList.files;
	}

	async function dataURLtoFile(dataurl, filename) {
		const arr = dataurl.split(",");
		const mime = arr[0].match(/:(.*?);/)[1];
		const fileExtension = mime.split("/");

		//console.log("mime", fileExtension);
		return await fetch(dataurl)
			.then((res) => {
				return res.blob();
			})
			.then((blob) => {
				return new File([blob], filename + "." + fileExtension[1], {
					type: mime,
				});
			});
	}

	async function getResizeMany() {
		let tempArr = [];
		for (let i = 0; i < classArr.length; i++) {
			let tempArrImg = [];
			for (let j = 0; j < classArr[i].imgs.length; j++) {
				// let res = await getResize(
				// 	classArr[i].imgs[j],
				// 	classArr[i].width,
				// 	classArr[i].height,
				// );
				let res = await getResize(
					// classArr[i].imgs[j],
					classArr[i].url[j],
					realSizes[i].width[j] * sizeIndex,
					realSizes[i].height[j] * sizeIndex,
				);
				tempArrImg.push(res);
			}
			tempArr.push(tempArrImg);
		}

		return tempArr;
	}

	function getResize(img, width, height) {
		return new Promise((resolve, reject) => {
			var image = new Image();
			image.src = img;
			// image.src = getSrc(img);
			// console.log(getSrc(img));

			var canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			var ctx = canvas.getContext("2d");
			// ctx.drawImage(image, 0, 0, width, height);

			// console.log(canvas);

			image.setAttribute("crossorigin", "anonymous");

			resolve(img);

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

	let history = useHistory();
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	// useEffect(()=>{
	// 	let uniq = JSON.parse(sessionStorage.getItem("uniqFor"));
	// 	console.log(uniq);
	// },[]);

	const downloadFile = ({data, fileName, fileType}) => {
		// Create a blob with the data we want to download as a file
		const blob = new Blob([data], {type: fileType});
		// Create an anchor element and dispatch a click event on it
		// to trigger a download
		const a = document.createElement("a");
		a.download = fileName;
		a.href = window.URL.createObjectURL(blob);
		const clickEvt = new MouseEvent("click", {
			view: window,
			bubbles: true,
			cancelable: true,
		});
		a.dispatchEvent(clickEvt);
		a.remove();
	};

	const exportToJson = (e) => {
		if (details.projectName === undefined) {
			setErrorModal({
				hidden: true,
				message: "Project name is empty!",
			});
			return;
		} else {
			const data = {
				projectName: details.projectName,
				collectionName: details.collectionName,
				projectDescription: details.projectDescription,
				width: localStorage.getItem("width"),
				height: localStorage.getItem("height"),
				classArr: arrClass,
			};

			e.preventDefault();
			downloadFile({
				data: JSON.stringify(data),
				fileName: details.projectName + ".json",
				fileType: "text/json",
			});
		}
	};

	// useEffect(async () => {
	// 	console.log("useEff1");
	// 	const {providers} = require("near-api-js");

	// 	const provider = new providers.JsonRpcProvider(
	// 		"https://archival-rpc.testnet.near.org",
	// 	);

	// 	let uniqFor = JSON.parse(localStorage.getItem("uniqFor"));
	// 	// console.log(uniq);

	// 	// let classArr;

	// 	// try {
	// 	// 	setOwner(window.walletConnection.getAccountId());
	// 	// } catch {
	// 	// 	setOwner("Null");
	// 	// }

	// 	let tempCollection = [];

	// 	setTimeout(() => {
	// 		const asyncFunction = async function () {
	// 			return await getResizeMany();
	// 		};
	// 		asyncFunction().then(async (res) => {
	// 			let tempArr = [];
	// 			for (let i = 0; i < classArr.length; i++) {
	// 				let temp = classArr[i];
	// 				temp.src = res[i];
	// 				tempArr.push(temp);
	// 			}
	// 			classArr = tempArr;

	// 			for (let i = 0; i < uniqFor.length; i++) {
	// 				let tempCur = uniqFor[i].split(",");
	// 				// console.log(tempCur);
	// 				//alertM("Saved!");
	// 				let mergeArr = [];

	// 				let indexArr = [];

	// 				for (let i = 0; i < classArr.length; i++) {
	// 					for (let j = 0; j < classArr[i].imgs.length; j++) {
	// 						if (classArr[i].imgs[j] == classArr[i].imgs[tempCur[i]]) {
	// 							mergeArr.push({
	// 								src: classArr[i].url[j],
	// 								x: classArr[i].x,
	// 								y: classArr[i].y,
	// 							});
	// 							indexArr.push(classArr[i].z_index);
	// 						}
	// 					}
	// 				}

	// 				for (let i = 0; i < indexArr.length; i++) {
	// 					for (let j = 0; j < indexArr.length; j++) {
	// 						if (indexArr[j] > indexArr[j + 1]) {
	// 							let temp = indexArr[j];
	// 							let temp1 = mergeArr[j];
	// 							indexArr[j] = indexArr[j + 1];
	// 							mergeArr[j] = mergeArr[j + 1];
	// 							indexArr[j + 1] = temp;
	// 							mergeArr[j + 1] = temp1;
	// 						}
	// 					}
	// 				}

	// 				await mergeImages(mergeArr, {
	// 					width: localStorage.getItem("width"),
	// 					height: localStorage.getItem("height"),
	// 				}).then((b64) => tempCollection.push(b64));
	// 			}

	// 			setCollection(tempCollection);

	// 			let hashTrans = document.location.search.split("transactionHashes=")[1];
	// 			// let hashTrans = "H1Wh3Kf96NWE56HwGLnajVtQGB55rsXAgTTopHdWX72N";
	// 			if (hashTrans != undefined) {
	// 				async function hashLog() {
	// 					const result = await provider.txStatus(
	// 						hashTrans,
	// 						window.walletConnection.getAccountId(),
	// 					);

	// 					// const transDet = await connectNear();

	// 					// console.log(provider);

	// 					// const response = await provider.txStatus(
	// 					// 	hashTrans,
	// 					// 	window.walletConnection.getAccountId()
	// 					// );

	// 					if (result.status.Failure == undefined) {
	// 						let event;
	// 						let token_id;
	// 						try {
	// 							event = JSON.parse(
	// 								result.receipts_outcome[0].outcome.logs[0].split(
	// 									"EVENT_JSON:",
	// 								)[1],
	// 							).event;
	// 							token_id = JSON.parse(
	// 								result.receipts_outcome[0].outcome.logs[0].split(
	// 									"EVENT_JSON:",
	// 								)[1],
	// 							).token_ids[0];
	// 						} catch {
	// 							event = result.transaction.actions[0].FunctionCall.method_name;
	// 						}

	// 						if (event == "deploy_contract_code") {
	// 							setActiveButtons([false, true, false]);
	// 							return;
	// 						}
	// 						if (event == "new") {
	// 							setActiveButtons([false, true, true]);
	// 							setErrorModal({
	// 								hidden: true,
	// 								message:
	// 									"Collection successfully created, go to profile to view",
	// 								img: "",
	// 							});
	// 							return;
	// 						}
	// 						if (event == "nft_mint" && token_id + 1 != collection.length) {
	// 							setActiveButtons([false, false, true]);
	// 							return;
	// 						}
	// 						if (event == "nft_mint") {
	// 							setActiveButtons([false, false, false]);
	// 							return;
	// 						}
	// 					} else {
	// 						// if(event=="new") {
	// 						// 	setActiveButtons([false,true,false]);
	// 						// 	return;
	// 						// }
	// 						return;
	// 					}
	// 				}
	// 				hashLog();
	// 			} else {
	// 				console.log("No transaction");
	// 				setActiveButtons([true, false, false]);
	// 				console.log("dep");
	// 				return;
	// 			}
	// 		});
	// 	}, 1000);

	// 	// console.log(classArr);
	// }, []);

	let arr = JSON.parse(localStorage.getItem("collection"));
	let arrName = JSON.parse(localStorage.getItem("collectionName"));

	let details = JSON.parse(localStorage.getItem("details"));
	if (details == {} || details == undefined || details == null) {
		details = {
			projName: "No Name",
			projectName: "No Name",
			projectDescription: "No Description",
		};
	}
	if (details.projName == undefined) {
		details.projName = "No Name";
	}
	if (details.projectName == undefined) {
		details.projectName = "No Name";
	}
	if (details.projectDescription == undefined) {
		details.projectDescription = "No Description";
	}
	let price;

	try {
		price = JSON.parse(localStorage.getItem("colPrice"));
	} catch {
		price = "0";
	}

	const [collection, setCollection] = useState([]);
	// const [collectionName, setCollectionName] = useState(arrName);

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

		let deployData = JSON.parse(localStorage.getItem("details"));

		const account = await near.account(walletConnection.getAccountId());

		const bal = await account.getAccountBalance();

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

		let addr = sessionStorage.getItem("addrCol");

		// let addr = "g1go05b6cyzsgxu9vs6v.dev-1649955546633-94708956977447";

		let hash_folder = uploadToNFTStore();

		hash_folder.then(async (res) => {
			const acc = await near.account(addr);

			let pubKey = JSON.parse(keyStore.localStorage.undefined_wallet_auth_key)
				.allKeys[0];

			let status = await near.connection.provider.status();

			const accessKey = await near.connection.provider.query(
				`access_key/${window.walletConnection.getAccountId()}/${pubKey.toString()}`,
				"",
			);

			const nonce = ++accessKey.nonce;

			const recentBlockHash = nearAPI.utils.serialize.base_decode(
				accessKey.block_hash,
			);

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

			actionsTrans.push(
				nearAPI.transactions.functionCall(
					"declare_collection_items",
					{
						total_mintable_tokens_count: JSON.parse(
							localStorage.getItem("uniqFor"),
						).length,
						ipfs_path: res + "/",
						extension: "png",
						price: "1600000000000000000",
						nft_titles: deployData.projectName,
						nft_descriptions: deployData.projectDescription,
					},
					"30000000000000",
					"0",
				),
			);

			const transaction = nearAPI.transactions.createTransaction(
				walletConnection.getAccountId(),
				nearAPI.utils.key_pair.PublicKey.fromString(pubKey),
				addr,
				nonce,
				actionsTrans,
				recentBlockHash,
			);

			try {
				const result = await walletConnection.requestSignTransactions([
					transaction,
				]);
			} catch {
				setErrorModal({
					hidden: true,
					message: "Connect Wallet",
					img: "",
				});
			}
		});

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

		// actionsTrans.push(
		// 	nearAPI.transactions.functionCall(
		// 		"nft_mint",
		// 		{
		// 			token_id: "token-13",
		// 			receiver_id: "blender2.testnet",
		// 		},
		// 		"300000000000000",
		// 		parseNearAmount("2"),
		// 	),
		// );

		// const pinataKey = "0a2ed9f679a6c395f311";
		// const pinataSecretKey =
		// 	"7b53c4d13eeaf7063ac5513d4c97c4f530ce7e660f0c147ab5d6aee6da9a08b9";

		// for (let i = 0; i < collection.length; i++) {
		// 	const url = collection[i];
		// 	await fetch(url)
		// 		.then((res) => res.blob())
		// 		.then((blob) => {
		// 			const file = new File([blob], "File name", {type: "image/png"});

		// 			const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

		// 			let data = new FormData();

		// 			data.append("file", file);

		// 			return axios
		// 				.post(url, data, {
		// 					maxBodyLength: "Infinity",
		// 					headers: {
		// 						"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
		// 						pinata_api_key: pinataKey,
		// 						pinata_secret_api_key: pinataSecretKey,
		// 					},
		// 				})
		// 				.then(async function (response) {
		// 					console.log(response.data.IpfsHash);

		// 					actionsTrans.push(
		// 						nearAPI.transactions.functionCall(
		// 							"nft_mint",
		// 							{
		// 								token_id: i.toString(),
		// 								metadata: {
		// 									title: deployData.projectName + "#" + i,
		// 									description: deployData.projectDescription,
		// 									media: response.data.IpfsHash,
		// 									copies: 1,
		// 								},
		// 								receiver_id: walletConnection.getAccountId(),
		// 							},
		// 							"30000000000000",
		// 							"7490000000000000000000",
		// 						),
		// 					);

		// 					// contractCollection
		// 					// 	.nft_mint(
		// 					// 		{
		// 					// 			token_id: nft[1].toString(),
		// 					// 			metadata: {
		// 					// 				title: collectionName[nft[1]],
		// 					// 				description: deployData.projectDescription,
		// 					// 				media: response.data.IpfsHash,
		// 					// 				copies: 1,
		// 					// 			},
		// 					// 			receiver_id: walletConnection.getAccountId(),
		// 					// 		},
		// 					// 		"30000000000000",
		// 					// 		"7490000000000000000000",
		// 					// 	)
		// 					// 	.then((data) => {
		// 					// 		console.log(data);
		// 					// 	});
		// 				})
		// 				.catch(function (error) {
		// 					console.error(error);
		// 				});
		// 		});
		// }

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
	}

	async function deployColectionNear() {
		let length = 20;
		let result = "";
		let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
		let charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		sessionStorage.setItem("addrCol", result + "." + contractRootNft);

		sessionStorage.setItem("curentAction", "deploy");

		// console.log(sessionStorage.getItem("collection"));

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

	async function mint_nft(amount) {
		// let addr = sessionStorage.getItem("addrCol");

		let addr = addrCol;

		const acc = await near.account(addr);

		let keys = keyStore.localStorage.undefined_wallet_auth_key;
		// console.log(keys);

		if (keys == undefined) {
			return;
		}

		let pubKey = JSON.parse(keys).allKeys[0];

		console.log(pubKey, "pubkey");

		let status = await near.connection.provider.status();

		const accessKey = await near.connection.provider.query(
			`access_key/${window.walletConnection.getAccountId()}/${pubKey.toString()}`,
			"",
		);

		const nonce = ++accessKey.nonce;

		const recentBlockHash = nearAPI.utils.serialize.base_decode(
			accessKey.block_hash,
		);

		let deployData = JSON.parse(localStorage.getItem("details"));

		let actionsTrans = [];

		for (let i = 0; i < amount; i++) {
			let length = 7;
			let result = "";
			let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
			let charactersLength = characters.length;

			let tempGas = "300000000000000" / amount;

			// if(i==amount) {
			// 	tempGas = "300000000000000";
			// }

			for (let j = 0; j < length; j++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength),
				);
			}

			actionsTrans.push(
				nearAPI.transactions.functionCall(
					"nft_mint",
					{
						token_id: "token-" + result,
						receiver_id: walletConnection.getAccountId(),
					},
					tempGas,
					mintPrice,
				),
			);
		}

		const transaction = nearAPI.transactions.createTransaction(
			walletConnection.getAccountId(),
			nearAPI.utils.key_pair.PublicKey.fromString(pubKey),
			addr,
			nonce,
			actionsTrans,
			recentBlockHash,
		);

		try {
			const result = await walletConnection.requestSignTransactions([
				transaction,
			]);
		} catch {
			setErrorModal({
				hidden: true,
				message: "Connect Wallet",
				img: "",
			});
		}
	}

	async function initCollection() {
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

		let deployData = JSON.parse(localStorage.getItem("details"));

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

		let deployData = JSON.parse(localStorage.getItem("details"));

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
			const url = collection[i];
			await fetch(url)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], "File name", {type: "image/png"});

					zip.file(collectionName[i] + ".png", file, {base64: true});

					// let data = new FormData();

					// data.append("file", file);

					// console.log(data);
				});
		}

		zip.generateAsync({type: "blob"}).then(function (content) {
			// see FileSaver.js

			var link = document.createElement("a");

			// link.setAttribute('href', URL.createObjectURL(content));

			// link.setAttribute('download', 'collection.zip');

			link.href = URL.createObjectURL(content);
			link.download = "collection.zip";

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
									history.goBack();
								}}
							></button>
						</div>
						<div class="modal-constructor modal-constructor-param">
							<div class="title">{collectionName}</div>
							<div class="desc">
								NFT art creator’s main goal is to invent, and using NFTour
								artists
							</div>

							<div style={{margin: "0px 0px 40px 0px"}} class="owner">
								<div class="avatar">H</div>
								<div class="text">
									<span>Author</span>
									{owner}
									{/* {nft} */}
								</div>
							</div>

							{/* <div class="desc">
								<div class="title">Description</div>
								Description
								<div class="hide">Show full description </div>
							</div> */}

							<div style={{margin: "0px 0px 40px 0px"}} class="price">
								<div class="subtitle">Mint Price</div>
								<div class="near">
									<span></span>{" "}
									<div class="price">
										{(mintPrice / 1000000000000000000000000).toFixed(1)} NEAR
									</div>
								</div>
							</div>

							<div style={{margin: "0px 0px 40px 0px"}} class="progress">
								<div class="title">Minted</div>
								<div class="bar">
									<span style={{"width": (collectionCount[0]-collectionCount[1])/(collectionCount[0]/100)+"%"}}></span>
								</div>
								<span> {collectionCount[0]-collectionCount[1]}/{collectionCount[0]}</span>
							</div>

							<div class="mint">
								<input
									type="number"
									onChange={(ev) => {
										setAmountMintNft(ev.target.value);
									}}
									value={amountMintNft}
									min="1"
								/>
								<button
									className="min"
									onClick={() => {
										setAmountMintNft(1);
									}}
								>
									Min
								</button>
								<button
									className="max"
									onClick={() => {
										setAmountMintNft(
											JSON.parse(localStorage.getItem("uniqFor")).length,
										);
									}}
								>
									Max
								</button>
							</div>

							<button
								className="button-3-square"
								onClick={() => {
									mint_nft(amountMintNft);
								}}
							>
								Mint{" "}
								<span>
									(
									{(
										(amountMintNft * mintPrice) /
										1000000000000000000000000
									).toFixed(1)}{" "}
									NEAR)
								</span>{" "}
							</button>
							<div style={{textAlign: "center"}} class="desc">
								Estimated fee ~ 0.1 NEAR
							</div>

							{/* <button
										className={
											"button-1-square button-arrow"
										}
										onClick={() => {
											localStorage.setItem("nft-collection-step", 3);
											setCurentCollectionStep(3);
										}}
										style={{margin: "0px 0px 10px 0px"}}
										// onClick={activeButtons[0] ? deployColectionNear : null}
									>
										Next
									</button> */}
						</div>
						<div class="modal-constructor modal-constructor-collection">
							<div class="collection">
								{/* {collection.map((item, index) => {
									console.log(collection, "123");
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
											<div class="name">
												{details.projectName}&nbsp; #{index + 1}
											</div>
										</div>
									);
								})} */}

								{collectionMinted.map((item, index) => {
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
												<img src={item.img} />
											</div>
											<div class="nameCol">{item.desc}</div>
											<div class="name">{item.name}</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default PackPage;
