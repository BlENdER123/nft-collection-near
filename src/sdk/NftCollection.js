import React, {useState, useEffect} from "react";
import {HashRouter as Router, useHistory} from "react-router-dom";

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

const {
	contractNft,
	nearConfig,
	contractRootNft,
	marketNft,
} = require("./config.json");
const {parseNearAmount} = require("near-api-js/lib/utils/format");

const {connect, keyStores, WalletConnection} = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const sha256 = require("js-sha256");

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

function NftCollection() {
	let classArr = JSON.parse(localStorage.getItem("class"));

	// let localClass = arr;
	// loading project from localStorage

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

	const [depositSale, setDepositSale] = useState({
		deposit: 0,
		sale: 0,
		avail: false,
	});

	const [collectionCount, setCollectionCount] = useState([0,0]);

	var openRequest = window.indexedDB.open("imgsStore", 1);
	// localClass = JSON.parse(localStorage.getItem("class"))
	openRequest.onsuccess = async (event) => {
		let db = event.target.result;

		let store = db.transaction("imgs").objectStore("imgs");

		for (let i = 0; i < classArr.length; i++) {
			for (let j = 0; j < classArr[i].imgs.length; j++) {
				store.get(classArr[i].imgs[j]).onsuccess = (event) => {
					classArr[i].url[j] = URL.createObjectURL(event.target.result);
				};
			}
		}
	};

	let realSizes = JSON.parse(localStorage.getItem("realSizes"));
	let nftAreaSize = JSON.parse(localStorage.getItem("nftAreaSize"));
	let sizeIndex = JSON.parse(localStorage.getItem("sizeIndex"));

	// let arr = JSON.parse(sessionStorage.getItem("collection"));
	let arrClass = JSON.parse(localStorage.getItem("class"));
	// let arrName = JSON.parse(sessionStorage.getItem("collectionName"));

	

	function getSrc(src) {
		return "https://cloudflare-ipfs.com/ipfs/" + src;
	}

	const [owner, setOwner] = useState("");

	const [isFullDescription, setIsFullDescription] = useState(false);

	async function uploadToNFTStore() {
		const token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGEwMTJGQWNhM0E5ZWQ0ZEI5MGY2ZmMzZUZFQTc1ZjBBMzZBNmE5MWUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTYwNjIwNTY0NiwibmFtZSI6Ik1hcmtldDMifQ.IzBaKMQuQRq9G6Pi5Y-vNKoxVy4-r5KtABSu2S_VL9U";
		const nft = new NFTStorage({
			endpoint: "https://api.nft.storage",
			token,
		});

		const files = await filesToFileList(collection);

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

			var canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			var ctx = canvas.getContext("2d");
			// ctx.drawImage(image, 0, 0, width, height);

			image.setAttribute("crossorigin", "anonymous");

			// ?resolve(img);

			image.onload = function () {
				ctx.drawImage(image, 0, 0, width, height);

				resolve(canvas.toDataURL("image/png"));
			};

			// var dataURL = canvas.toDataURL("image/png");
			// return dataURL;
		});
	}

	let history = useHistory();
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	// useEffect(()=>{
	// 	let uniq = JSON.parse(sessionStorage.getItem("uniqFor"));
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

			let idBlobObj = {}

			let tempArr = []

			const openRequest = window.indexedDB.open("imgsStore", 1);

			openRequest.onsuccess = async (event) => {

				const store = event.target.result.transaction("imgs").objectStore("imgs");
				store.getAll().onsuccess = (event) => {
					console.log(event.target.result);
					const store_data = event.target.result;

					for (let i = 0; i < store_data.length; i++) {
						let tempFile = store_data[i];

						console.log(tempFile);
						// tempFile.arrayBuffer().then((data)=>{
						// 	console.log(data);
						// })

						tempArr.push(tempFile);

						let reader = new FileReader();
						reader.readAsDataURL(tempFile);
						reader.onload = (e) => {
							console.log(e.currentTarget.result);
							let tempId = tempFile.id;
							idBlobObj[tempId] = e.currentTarget.result;
						}
					}
				}

				

			}

			

			setTimeout(()=>{
				console.log(idBlobObj);
					const data = {
						projectName: details.projectName,
						collectionName: details.collectionName,
						projectDescription: details.projectDescription,
						width: localStorage.getItem("width"),
						height: localStorage.getItem("height"),
						classArr: arrClass,
						indexedData: idBlobObj,
					};
		
					e.preventDefault();
					downloadFile({
						data: JSON.stringify(data),
						fileName: details.projectName + ".json",
						fileType: "text/json",
					});

			}, 1000);

			
		}
	};

	

	async function getIndexeedDB() {

		const openRequest = window.indexedDB.open("imgsStore", 1);

		let idBlobObj = {}

		openRequest.onsuccess = async (event) => {

			const store = event.target.result.transaction("imgs").objectStore("imgs");
			store.getAll().onsuccess = (event) => {
				console.log(event.target.result);
				const store_data = event.target.result;

				for (let i = 0; i < store_data.length; i++) {
					let tempFile = store_data[i];

					console.log(tempFile);
					// tempFile.arrayBuffer().then((data)=>{
					// 	console.log(data);
					// })

					let reader = new FileReader();
					reader.readAsDataURL(tempFile);
					reader.onload = (e) => {
						// console.log(e.currentTarget.result);
						let tempId = tempFile.id;
						idBlobObj[tempId] = e.currentTarget.result;
					}
				}
			}

			// console.log(store_data.result);
			console.log(idBlobObj);
		}

		function request(openRequest) {

			let idBlobObj = {};

			return new Promise((resolve, reject) => {
				openRequest.onsuccess = async (event) => {
				
					const store = event.target.result.transaction("imgs").objectStore("imgs");

					const functionsToWait = [];

					functionsToWait.push(
						new Promise((resolve, reject) => {
							store.getAll().onsuccess = (event) => {
								console.log(event.target.result);
								const store_data = event.target.result;

								for (let i = 0; i < store_data.length; i++) {
									let tempFile = store_data[i];

									console.log(tempFile);
									// tempFile.arrayBuffer().then((data)=>{
									// 	console.log(data);
									// })

									let reader = new FileReader();
									reader.readAsDataURL(tempFile);
									reader.onload = (e) => {
										// console.log(e.currentTarget.result);
										let tempId = tempFile.id;
										idBlobObj[tempId] = e.currentTarget.result;
										resolve(true);
									}
								}
							}
						})
					)

					



				};
			})
		}

		setTimeout(()=>{
			console.log(idBlobObj);
		}, 1000);

	}

	useEffect(async () => {
		console.log("UseEffect minted");

		if (
			localStorage.getItem("addrCol") !== undefined &&
			localStorage.getItem("addrCol") !== null &&
			localStorage.getItem("addrCol") !== ""
		) {
			let addr = localStorage.getItem("addrCol");

			if (addr == null || addr == undefined) {
				return;
			}
	

			window.tempContract = await new nearAPI.Contract(
				window.walletConnection.account(),
				addr,
				{
					// View methods are read-only – they don't modify the state, but usually return some value
					viewMethods: [
						"nft_tokens",
						"nft_supply_for_owner",
						"nft_tokens_for_owner",
						"nft_token",
						"nft_remaining_count"
					],
					// Change methods can modify the state, but you don't receive the returned value when called
					// changeMethods: ["new"],
					// Sender is the account ID to initialize transactions.
					// getAccountId() will return empty string if user is still unauthorized
					sender: window.walletConnection.getAccountId(),
				},
			);

			// tempContract.nft_tokens({
			// 	from_index: "0",
			// 	limit: 50
			// }).then((data)=>{
			// 	console.log(data);
			// });

			tempContract.nft_remaining_count({}).then((data)=>{
				console.log(data);
				setCollectionCount([data.total_mintable_tokens_count, data.token_matrix]);
			})

			tempContract
				.nft_tokens_for_owner({
					account_id: window.walletConnection.getAccountId(),
				})
				.then((data) => {
					console.log(data);
					let tempCollectionMinted = [];

					for (let i = 0; i < data.length; i++) {
						tempCollectionMinted.push({
							img: "https://cloudflare-ipfs.com/ipfs/" + data[i].metadata.media,
							name: data[i].metadata.title,
							desc: data[i].metadata.description,
							token_id: data[i].token_id,
						});
					}

					console.log(tempCollectionMinted);

					setCollectionMinted(tempCollectionMinted);
				});
		}

		isSaleAvailiable();
	}, [collectionMinted]);

	useEffect(()=>{
		console.log("UseEffect is sale Avil");
		isSaleAvailiable();
	}, []);

	useEffect(async () => {
		console.log("UseEffect on sale");

		if (
			localStorage.getItem("addrCol") !== undefined &&
			localStorage.getItem("addrCol") !== null &&
			localStorage.getItem("addrCol") !== ""
		) {
			let addr = localStorage.getItem("addrCol");

			if (addr == null || addr == undefined) {
				return;
			}

			fetch(
				"https://helper.testnet.near.org/account/" + window.walletConnection.getAccountId() + "/likelyNFTs",
				{
					method: "get",
					headers: {
						"Content-Type": "application/json; charset=utf-8",
						Connection: "keep-alive",
					},
				},
			).then((data) => {
				return data.json();
			}).then(async (data) => {
				console.log(data);

				for(let i = 0; i < data.length; i++) {
					if(data[i] == addr) {
						console.log(i);

						window.tempContract = await new nearAPI.Contract(
							window.walletConnection.account(),
							addr,
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
									console.log(data, data.length, "Сколько всего во владении");
									setCollectionNotOnSale(data.length);
									// for (let j = 0; j < data.length; j++) {
									// 	let info = data[j].metadata;

									// 	let onSale = false;


									// 	for (let k = 0; k < sales.length; k++) {
									// 		if (
									// 			tempAddr == sales[k].nft_contract_id &&
									// 			data[j].token_id == sales[k].token_id
									// 		) {
									// 			onSale = true;
									// 		}
									// 	}

									// 	let mediaUrl;

									// 	try {
									// 		if (
									// 			info.media.includes("http://") ||
									// 			(info.media.includes("data") &&
									// 				info.media.length > 25) ||
									// 			info.media.includes("https://")
									// 		) {
									// 			mediaUrl = info.media;
									// 		} else {
									// 			mediaUrl =
									// 				"https://cloudflare-ipfs.com/ipfs/" + info.media;
									// 		}
									// 	} catch {
									// 		mediaUrl = info.media;
									// 	}

									// 	tempCol.push({
									// 		addrNft: "addrNFT",
									// 		name: info.title,
									// 		desc: info.description, //"https://cloudflare-ipfs.com/ipfs/"+
									// 		image: mediaUrl,
									// 		token_id: data[j].token_id,
									// 		addrCol: tempAddr,
									// 		onSale,
									// 	});
									// }
								});
						} catch {
							console.log("error");
						}

					}
				}
			});

			let tempCol = [];

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
			}).then(async (data) => {
				console.log(data);
				for(let i = 0; i < data.length; i++) {
					if(data[i].nft_contract_id == addr) {
						// tempCol.push(data[i]);

						window.ContractCollection = await new nearAPI.Contract(
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

						ContractCollection.nft_token({token_id: data[i].token_id}).then((data_token)=>{
							// console.log(data_token);

							tempCol.push({
								img: "https://cloudflare-ipfs.com/ipfs/" + data_token.metadata.media,
								name: data_token.metadata.title,
								desc: data_token.metadata.description,
								token_id: data_token.token_id,
							});
						})
					}
				}

				console.log(tempCol);
			});

			setCollectionOnSale(tempCol);
	

			// window.tempContract = await new nearAPI.Contract(
			// 	window.walletConnection.account(),
			// 	addr,
			// 	{
			// 		// View methods are read-only – they don't modify the state, but usually return some value
			// 		viewMethods: [
			// 			"nft_tokens",
			// 			"nft_supply_for_owner",
			// 			"nft_tokens_for_owner",
			// 			"nft_token",
			// 			"nft_remaining_count"
			// 		],
			// 		// Change methods can modify the state, but you don't receive the returned value when called
			// 		// changeMethods: ["new"],
			// 		// Sender is the account ID to initialize transactions.
			// 		// getAccountId() will return empty string if user is still unauthorized
			// 		sender: window.walletConnection.getAccountId(),
			// 	},
			// );

			// // tempContract.nft_tokens({
			// // 	from_index: "0",
			// // 	limit: 50
			// // }).then((data)=>{
			// // 	console.log(data);
			// // });

			// tempContract.nft_remaining_count({}).then((data)=>{
			// 	console.log(data);
			// 	setCollectionCount([data.total_mintable_tokens_count, data.token_matrix]);
			// })

			// tempContract
			// 	.nft_tokens_for_owner({
			// 		account_id: window.walletConnection.getAccountId(),
			// 	})
			// 	.then((data) => {
			// 		console.log(data);
			// 		let tempCollectionMinted = [];

			// 		for (let i = 0; i < data.length; i++) {
			// 			tempCollectionMinted.push({
			// 				img: "https://cloudflare-ipfs.com/ipfs/" + data[i].metadata.media,
			// 				name: data[i].metadata.title,
			// 				desc: data[i].metadata.description,
			// 				token_id: data[i].token_id,
			// 			});
			// 		}

			// 		console.log(tempCollectionMinted);

			// 		setCollectionMinted(tempCollectionMinted);
			// 	});
		}

		// isSaleAvailiable();
	}, [collectionOnSale]);

	async function isSaleAvailiable() {

		console.log(11111);
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
		console.log(11111);

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
						if (sales.length+JSON.parse(localStorage.getItem("uniqFor")).length <= data / 10000000000000000000000) {
							console.log(sales.length, sales.length+JSON.parse(localStorage.getItem("uniqFor")).length, data / 10000000000000000000000);
							// console.log(sales.length, data / 10000000000000000000000);
							setDepositSale({
								deposit: data / 10000000000000000000000,
								sale: sales.length,
								avail: true,
							});
						} else {
							console.log(sales.length + JSON.parse(localStorage.getItem("uniqFor")).length, data / 10000000000000000000000);
							setDepositSale({
								deposit: data / 10000000000000000000000,
								sale: sales.length,
								avail: false,
							});
						}
					});
			})
			.catch((err) => {
				console.log("err");
			});
	}

	useEffect(async () => {
		console.log("useEff1");
		const {providers} = require("near-api-js");

		const provider = new providers.JsonRpcProvider(
			"https://archival-rpc.testnet.near.org",
		);

		let uniqFor = JSON.parse(localStorage.getItem("uniqFor"));

		// let classArr;

		try {
			setOwner(window.walletConnection.getAccountId());
		} catch {
			setOwner("Null");
		}

		let hashTrans = document.location.search.split("transactionHashes=")[1];

		try {
			hashTrans = hashTrans.split("&errorCode=")[0];
		} catch {

		}
		// let hashTrans = "H1Wh3Kf96NWE56HwGLnajVtQGB55rsXAgTTopHdWX72N";
		if (hashTrans != undefined) {
			console.log(hashTrans, "HASHTRANS");
			async function hashLog() {
				const result = await provider.txStatus(
					hashTrans,
					window.walletConnection.getAccountId(),
				);

				// const transDet = await connectNear();

				// const response = await provider.txStatus(
				// 	hashTrans,
				// 	window.walletConnection.getAccountId()
				// );

				if (result.status.Failure == undefined) {
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
						// return;
					} else if (event == "new") {
						setActiveButtons([false, false, true]);
						// setErrorModal({
						// 	hidden: true,
						// 	message:
						// 		"Collection successfully created, go to profile to view",
						// 	img: "",
						// });
						setCurentCollectionStep(2);
						localStorage.setItem("nft-collection-step", 2);
						// return;
					} else if (event == "nft_mint" && token_id + 1 != collection.length) {
						setActiveButtons([false, false, true]);
						// return;
					} else if (event == "nft_mint") {
						setActiveButtons([false, false, false]);
						// return;
					}
				} else {
					// if(event=="new") {
					// 	setActiveButtons([false,true,false]);
					// 	return;
					// }
					// return;
				}
			}
			hashLog();
		} else {
			console.log("No transaction");
			setActiveButtons([true, false, false]);
			// return;
		}

		let tempCollection = [];

		setTimeout(() => {
			const asyncFunction = async function () {
				return await getResizeMany();
			};
			asyncFunction().then(async (res) => {
				let tempArr = [];
				for (let i = 0; i < classArr.length; i++) {
					let temp = classArr[i];
					temp.src = res[i];
					tempArr.push(temp);
				}
				classArr = tempArr;

				for (let i = 0; i < uniqFor.length; i++) {
					let tempCur = uniqFor[i].split(",");
					// (tempCur);
					//alertM("Saved!");
					let mergeArr = [];

					let indexArr = [];

					for (let i = 0; i < classArr.length; i++) {
						for (let j = 0; j < classArr[i].imgs.length; j++) {
							if (classArr[i].imgs[j] == classArr[i].imgs[tempCur[i]]) {
								mergeArr.push({
									src: classArr[i].url[j],
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

					await mergeImages(mergeArr, {
						width: localStorage.getItem("width"),
						height: localStorage.getItem("height"),
					}).then((b64) => tempCollection.push(b64));
				}

				setCollection(tempCollection);
			});
		}, 1000);
	}, []);

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
	const [collectionMinted, setCollectionMinted] = useState([]);
	const [collectionOnSale, setCollectionOnSale] = useState([]);
	const [collectionNotOnSale, setCollectionNotOnSale] = useState(0);
	const [collectionName, setCollectionName] = useState(arrName);
	const [salePrice, setSalePrice] = useState(0);
	const [errorInput, setErrorInput] = useState();

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	function changeError(input, value) {
		if (value == "" || value < 0 || value == undefined || value == null) {
			setErrorInput(input);
			setSalePrice(value);
		} else {
			if (input == "salePrice") {
				setErrorInput("");
				setSalePrice(value);
			}
		}
	}

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

		// const response = await account.deployContract(fileBuffer);

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
		// 				} catch (e) {
		// 				}
		// 			})
		// 			.catch(function (error) {
		// 				console.error(error);
		// 			});
		// 	});

		// let idLastCol;

		// try {
		// 	const response = await acc.runLocal("getInfo", {});
		// 	let value0 = response;
		// 	idLastCol = response.decoded.output.countColections - 1;
		// } catch (e) {
		// }

		// let nftRoot;

		// try {
		// 	const response = await acc.runLocal("resolveNftRoot", {
		// 		addrOwner: sessionStorage.getItem("address"),
		// 		id: idLastCol,
		// 	});
		// 	let value0 = response;
		// 	nftRoot = response.decoded.output.addrNftRoot;
		// } catch (e) {
		// }

		// const acc1 = new Account(NftRootColectionContract, {
		// 	address: nftRoot,
		// 	signer: signerNone(),
		// 	client,
		// });

		// save imgs to IPFS
	}

	async function depositAll() {
		// if (addr == null || addr == undefined) {
		// 	return;
		// }

		if (collectionMinted.length < 1) {
			return;
		}

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
				console.log(collectionMinted.length);

				let deposit = data * collectionMinted.length;
				console.log(
					deposit.toLocaleString("fullwide", {useGrouping: false}).toString(),
				);

				contractMarket
					.storage_deposit(
						{},
						"30000000000000",
						deposit.toLocaleString("fullwide", {useGrouping: false}).toString(),
					)
					.catch((err) => {
						console.log(err);
						walletAccount.requestSignIn("", "Title");
					});
			})
			.catch(() => {
				walletAccount.requestSignIn("", "Title");
			});
	}

	async function saleAllNft() {
		// const acc = await near.account(addr);

		if (
			salePrice <= 0 ||
			salePrice == "" ||
			salePrice == undefined ||
			salePrice == null
		) {
			// alert("Set Sale Price");
			setErrorInput("salePrice");
			return;
		}

		if (
			localStorage.getItem("addrCol") == null ||
			localStorage.getItem("addrCol") == undefined
		) {
			return;
		}

		if (collectionMinted.length < 1) {
			return;
		}

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

		// let tempGas = "300000000000000"/collectionMinted.length;

		// console.log(tempGas);
		// return;

		let notOnSale = [];


		window.tempContract = await new nearAPI.Contract(
			window.walletConnection.account(),
			localStorage.getItem("addrCol"),
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
					console.log(data, data.length, "Сколько всего");

					for(let i = 0; i < data.length; i++) {
						let found = false;
						// console.log(data[i], data[i+1]);
						// console.log(data[i].token_id, collectionOnSale[i].token_id);
						for(let j = 0; j < collectionOnSale.length; j++) {
							if(data[i].token_id == collectionOnSale[j].token_id) {
								found = true;
								break;
								// notOnSale.push(data[i].token_id);
							}
						}
						if (!found) {
							notOnSale.push(data[i].token_id);
						}
					}

					console.log(notOnSale);

					let amountSale;

					if(notOnSale.length > 10) {
						amountSale = 10;

					} else {
						amountSale = notOnSale.length;
					}


					for (let i = 0; i < amountSale; i++) {
						let tempGas = "300000000000000" / amountSale;
						// console.log(tempGas);
						// return;
						actionsTrans.push(
							nearAPI.transactions.functionCall(
								"nft_approve",
								{
									token_id: notOnSale[i],
									account_id: marketNft,
									msg: JSON.stringify({
										sale_conditions: parseNearAmount(salePrice),
									}),
								},
								tempGas,
								parseNearAmount("0.01"),
							),
						);
					}
			
					const transaction = nearAPI.transactions.createTransaction(
						walletConnection.getAccountId(),
						nearAPI.utils.key_pair.PublicKey.fromString(pubKey),
						localStorage.getItem("addrCol"),
						nonce,
						actionsTrans,
						recentBlockHash,
					);
			
					console.log(actionsTrans);
			
					// return;
			
					if (actionsTrans.length == 0) {
						return;
					}
			
					try {
						const result = await walletConnection.requestSignTransactions([
							transaction,
						]);
					} catch {
						walletAccount.requestSignIn("", "Title");
					}

					
					
				});
		} catch(err) {
			console.log(err);
		}


		

		// window.contractSale = await new nearAPI.Contract(
		// 	window.walletConnection.account(),
		// 	nft.addrCol,
		// 	{
		// 		// View methods are read-only – they don't modify the state, but usually return some value
		// 		// viewMethods: ['get_num'],
		// 		// Change methods can modify the state, but you don't receive the returned value when called
		// 		changeMethods: ["nft_approve"],
		// 		// Sender is the account ID to initialize transactions.
		// 		// getAccountId() will return empty string if user is still unauthorized
		// 		sender: window.walletConnection.getAccountId(),
		// 	},
		// );

		// window.contractMarket = await new nearAPI.Contract(
		// 	window.walletConnection.account(),
		// 	marketNft,
		// 	{
		// 		// View methods are read-only – they don't modify the state, but usually return some value
		// 		viewMethods: [
		// 			"storage_minimum_balance",
		// 			"get_sale",
		// 			"get_sales_by_owner_id",
		// 		],
		// 		// Change methods can modify the state, but you don't receive the returned value when called
		// 		changeMethods: ["storage_deposit"],
		// 		// Sender is the account ID to initialize transactions.
		// 		// getAccountId() will return empty string if user is still unauthorized
		// 		sender: window.walletConnection.getAccountId(),
		// 	},
		// );

		// contractMarket
		// 	.get_sales_by_owner_id({
		// 		account_id: window.walletConnection.getAccountId(),
		// 		from_index: "0",
		// 		limit: 50,
		// 	})
		// 	.then((data) => {
		// 		console.log(data);
		// 	});

		// contractSale
		// 	.nft_approve(
		// 		{
		// 			token_id: nft.token_id,
		// 			account_id: marketNft,
		// 			msg: JSON.stringify({
		// 				sale_conditions: parseNearAmount(salePrice),
		// 			}),
		// 		},
		// 		"30000000000000",
		// 		parseNearAmount("0.01"),
		// 	)
		// 	.catch((err) => {
		// 		alert("Connect Wallet");
		// 	});
	}

	async function multTrans() {
		setActiveButtons([false, false, false]);

		setLoaderMult(true);

		let addr = localStorage.getItem("addrCol");

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
						price: parseNearAmount(price.toString()),
						nft_titles: deployData.projectName,
						nft_descriptions: deployData.projectDescription,
						creator: window.walletConnection.getAccountId(),
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
		// 					// 	});
		// 				})
		// 				.catch(function (error) {
		// 					console.error(error);
		// 				});
		// 		});
		// }

		// const serTx = nearAPI.utils.serialize.serialize(
		// 	nearAPI.transactions.SCHEMA,
		// 	transaction
		// )

		// const serializedTxHash = new Uint8Array(sha256.sha256.array(serTx));

		// const signature = keyPair.sign(serializedTxHash);

		// const bytes = transaction.encode();

		// const msg = new Uint8Array(sha256.sha256.array(bytes));

		// const signature = await signer.signMessage(msg,window.walletConnection.getAccountId(), "default");

		// const signedTx = new SignedTransaction({
		// 	transaction,
		// 	signature: new Signature(signature.signature),
		// })
	}

	async function deployColectionNear() {
		let length = 20;
		let result = "";
		let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
		let charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		localStorage.setItem("addrCol", result + "." + contractRootNft);

		localStorage.setItem("curentAction", "deploy");

		contractRoot
			.deploy_contract_code(
				{
					account_id: result + "." + contractRootNft,
				},
				"30000000000000",
				"7490000000000000000000000",
			)
			.catch((err) => {
				// setErrorModal({
				// 	hidden: true,
				// 	message: "Connect Wallet",
				// 	img: "",
				// });
				console.log(err);
				walletAccount.requestSignIn("", "Title");
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
		let addr = localStorage.getItem("addrCol");
		// let addr = "kadqjgcyjio4tdqdtene.dev-1649955546633-94708956977447";
		if (addr == null || addr == undefined) {
			return;
		}

		if (amountMintNft > collectionCount[1]) {
			return;
		}

		if (collectionCount[0] == 0 || collectionCount[1] == 0) {
			return;
		}

		window.tempContract = await new nearAPI.Contract(
			window.walletConnection.account(),
			addr,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["nft_mint_price", "nft_remaining_count"],
				// Change methods can modify the state, but you don't receive the returned value when called
				// changeMethods: ["new"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		tempContract
			.nft_mint_price({})
			.then(async (mintPrice) => {
				console.log(mintPrice);
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

				// console.log(mintPrice,parseNearAmount(2));

				// console.log(parseNearAmount(2)+1);

				let endPrice = mintPrice + parseInt(parseNearAmount("0.1")); // TODO Не расчитывается колчиество газа для совершение транзакции

				// console.log(parseInt(mintPrice),parseInt(parseNearAmount("0.1")));

				console.log(
					endPrice.toLocaleString("fullwide", {useGrouping: false}).toString(),
				);
				console.log(parseNearAmount("1,1"));

				// return;

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
							endPrice
								.toLocaleString("fullwide", {useGrouping: false})
								.toString(),
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
				} catch (err) {
					// setErrorModal({
					// 	hidden: true,
					// 	message: "Connect Wallet",
					// 	img: "",
					// });
					console.log(err);

					walletAccount.requestSignIn("", "Title");
				}
			})
			.catch((err) => {
				console.log(err);
				walletAccount.requestSignIn("", "Title");
			});

		tempContract.nft_remaining_count({}).then((data) => {
			console.log(data);
		});
	}

	async function initCollection() {
		let addr = localStorage.getItem("addrCol");

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

		localStorage.setItem("curentAction", "init");
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
		let addr = localStorage.getItem("addrCol");

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
			localStorage.setItem("curentAction", "deployNft");
		} else {
			localStorage.setItem("curentAction", "deploingNft");
		}

		let deployData = JSON.parse(localStorage.getItem("details"));

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
									if (curentCollectionStep > 1) {
										localStorage.setItem(
											"nft-collection-step",
											curentCollectionStep - 1,
										);
										setCurentCollectionStep(curentCollectionStep - 1);
									} else {
										history.push("/nft-generate");
									}
								}}
							></button>
						</div>
						<div class="modal-constructor modal-constructor-param">
							{curentCollectionStep == 1 ? (
								<>
									<div class="title">Publish collection into blockchain</div>
									<div class="desc">
										This will make NFT Minting available for you or end-users.
										User can mint random NFTs one-by-one for the fixed price of
										XX.XX NEAR.
									</div>

									<button
										className={
											activeButtons[0]
												? "button-1-square button-arrow"
												: "button-1-square button-1-square-disabled"
										}
										style={{margin: "0px 0px 10px 0px"}}
										onClick={activeButtons[0] ? deployColectionNear : null}
									>
										I. Initialize Collection
									</button>

									<button
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
											<span>
												II. Publish Collection (
												{JSON.parse(localStorage.getItem("uniqFor")).length})
											</span>
										)}
									</button>
									{/* <button onClick={uploadToNFTStore}>Test</button> */}
									<div style={{margin: "0px"}} className="desc">
										Smart-contract one-time fee ~8 NEAR (YYY USD)
									</div>
								</>
							) : null}
							{curentCollectionStep == 2 ? (
								<>
									<div class="title">Mint some NFTs</div>
									<div class="desc">
										Enter amount of starting NFTs to mint for yourself
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
													collectionCount[1],
												);
											}}
										>
											Max
										</button>
									</div>

									<button
										className={amountMintNft > collectionCount[1] || collectionCount[0] == 0 || collectionCount[1] == 0?"button-3-square button-1-square-disabled" : "button-3-square"}
										onClick={() => {
											mint_nft(amountMintNft);
										}}
									>
										Mint{" "}
										<span>
											(
											{(amountMintNft * 0.1 + amountMintNft * price).toFixed(1)}{" "}
											NEAR)
										</span>{" "}
									</button>
									<div style={{textAlign: "center"}} class="desc">
										Estimated fee ~ 0.1 NEAR for each
									</div>

									<div
										style={{opacity: "1", margin: "0px 0px 20px 0px"}}
										class="desc"
									>
										You can choose not to mint NFTs of the collection. Minting
										will be available later on the Collection Page at
										Marketplace.
									</div>

									<button
										className={"button-1-square button-arrow"}
										onClick={() => {
											localStorage.setItem("nft-collection-step", 3);
											setCurentCollectionStep(3);
										}}
										style={{margin: "0px 0px 10px 0px"}}
										// onClick={activeButtons[0] ? deployColectionNear : null}
									>
										Next
									</button>
								</>
							) : null}
							{curentCollectionStep == 3 ? (
								<>
									<div class="title">Open sales</div>
									<div class="desc">
										Put all your new NFTs on sale at Marketplace
									</div>

									<div
										className={collectionNotOnSale - collectionOnSale.length > 0 && depositSale.avail? "price-sale price" : "hide"}
										style={{"margin-bottom":"20px"}}
									>
										<div class="title">Price</div>
										<div className="price-input">
											<input
												value={salePrice}
												onChange={(ev) => {
													changeError("salePrice", ev.target.value);
												}}
												type="number"
												className={errorInput == "salePrice" ? "inputErr" : "price"}
												// className={"price"}
											/>
											<span>NEAR</span>
										</div>
										<span className={errorInput == "salePrice" ? "errMsg" : "hide"}>
											Set Price
										</span>
									</div>

									<button
										onClick={saleAllNft}
										className={collectionNotOnSale - collectionOnSale.length > 0 && depositSale.avail ? "button-3-square" : "hide"}
									>
										Sale <span> NFT’s</span>{" "}
									</button>
									<div
										style={{textAlign: "center"}}
										className={collectionNotOnSale - collectionOnSale.length > 0 && depositSale.avail ? "desc" : "hide"}
									>
										Estimated fee ~ 0.1 NEAR
									</div>

									<button
										onClick={depositAll}
										className={depositSale.avail ? "hide" : "button-1-square"}
									>
										Deposit Funds <span></span>{" "}
									</button>
									<div
										style={{textAlign: "center"}}
										className={depositSale.avail ? "hide" : "desc"}
									>
										No enough funds to sale
									</div>

									<div
										style={{opacity: "1", margin: "0px 0px 100px 0px"}}
										class="desc"
									>
										You can choose not to sale your NFTs now. All of them are
										available in your Profile page.
									</div>

									<button
										className={"button-4-square button-arrow"}
										style={{margin: "0px 0px 10px 0px"}}
										// onClick={activeButtons[0] ? deployColectionNear : null}
										onClick={() => {
											history.push("/profile/" + walletAccount.getAccountId());
										}}
									>
										Go to Profile
									</button>
								</>
							) : null}
						</div>
						<div class="modal-constructor modal-constructor-collection">
							<div class="steps steps-univ">
								<div
									// class="step step1 active"
									className={
										curentCollectionStep == 1
											? "step step1 active"
											: "step step1"
									}
									onClick={() => {
										localStorage.setItem("nft-collection-step", 1);
										setCurentCollectionStep(1);
									}}
								>
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 1</div>
										<div class="desc">Publish collection</div>
									</div>
								</div>
								<div class="line"></div>
								<div
									className={
										curentCollectionStep == 2
											? "step step2 active"
											: "step step2"
									}
									onClick={() => {
										localStorage.setItem("nft-collection-step", 2);
										setCurentCollectionStep(2);
									}}
								>
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 2</div>
										<div class="desc">Mint some NFTs</div>
									</div>
								</div>
								<div class="line"></div>
								<div
									className={
										curentCollectionStep == 3
											? "step step3 active"
											: "step step3"
									}
									onClick={() => {
										isSaleAvailiable();
										localStorage.setItem("nft-collection-step", 3);
										setCurentCollectionStep(3);
									}}
								>
									<div class="img"></div>
									<div class="text">
										<div class="name">Step 3</div>
										<div class="desc">Open sales</div>
									</div>
								</div>
							</div>

							<div class="collection-info">
								<div class="info-1">
									<div class="title">Collection Name</div>
									<div class="text">{details.projectName}</div>
									<div class="title">Description</div>
									<div class="text">{details.projectDescription}</div>
								</div>
								<div class="info-2">
									<div class="owner">
										<div class="avatar">H</div>
										<div class="text">
											<span>Owner</span>
											{owner}
										</div>
									</div>
									<div class="price">
										<div class="subtitle">Mint Price</div>
										<div class="near">
											<span></span> <div class="price">{price} NEAR</div>
										</div>
									</div>
								</div>
							</div>

							<div class="button-4-square" onClick={exportToJson}>
								<span></span>Save project
							</div>

							{/* <div class="button-4-square" onClick={getIndexeedDB}>
								<span></span>Save project test
							</div> */}

							<div className={curentCollectionStep == 1 ? "progress": "hide"}>
								<div class="title">Collection generation process</div>
								<div class="bar">
									<span style={{"width": "100%"}}/>	
								</div>
								<span>
									{JSON.parse(localStorage.getItem("uniqFor")).length}/
									{JSON.parse(localStorage.getItem("uniqFor")).length}
								</span>
							</div>
							<div className={curentCollectionStep == 2 ? "progress": "hide"}>
								<div class="title">Collection minted</div>
								<div class="bar">
									<span style={{"width": (collectionCount[0]-collectionCount[1])/(collectionCount[0]/100)+"%"}}></span>
								</div>
								<span>
									{collectionCount[0]-collectionCount[1]}/
									{collectionCount[0]}
								</span>
							</div>
							<div className={curentCollectionStep == 3 ? "progress": "hide"}>
								<div class="title">Collection on sale</div>
								<div class="bar">
									<span style={{"width": (collectionOnSale.length)/(collectionNotOnSale/100)+"%"}}></span>
								</div>
								<span>
									{collectionOnSale.length}/
									{collectionNotOnSale}
								</span>
							</div>
							
							<div
								className={curentCollectionStep == 1 ? "collection" : "hide"}
							>
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
											<div class="name">
												{details.projectName}&nbsp; #{index + 1}
											</div>
										</div>
									);
								})}
							</div>

							<div className={curentCollectionStep == 2 ? "collection" : "hide"}>
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

							<div className={curentCollectionStep == 3 ? "collection" : "hide"}>
								{collectionOnSale.map((item, index) => {
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
