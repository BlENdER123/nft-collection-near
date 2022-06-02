import React, {useState, useEffect} from "react";

import * as JSZIP from "jszip";

import {useDispatch, useSelector} from "react-redux";

import * as nearAPI from "near-api-js";

const {
	contractNft,
	singleNFt,
	nearConfig,
	contractRootNft,
} = require("../../sdk/config.json");



const axios = require("axios");


// function base64ToHex(str) {
// 	const raw = atob(str);
// 	let result = "";
// 	for (let i = 0; i < raw.length; i++) {
// 		const hex = raw.charCodeAt(i).toString(16);
// 		result += hex.length === 2 ? hex : "0" + hex;
// 	}
// 	return result.toUpperCase();
// }

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
		if (hashTrans !== undefined) {
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

				if (result.status.Failure === undefined) {
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

					if (event === "deploy_contract_code") {
						setActiveButtons([false, true, false]);
						console.log(1);
						return;
					}
					if (event === "nft_mint") {
						setActiveButtons([false, false, true]);
						setErrorModal({
							hidden: true,
							message: "NFT successfully created, go to profile to view",
							img: "",
						});
						console.log(1);
						return;
					}
					if (event === "nft_mint" && token_id + 1 != collection.length) {
						setActiveButtons([false, false, true]);
						console.log("dep");
						return;
					}
					if (event === "nft_mint") {
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
					
				}
			}
			hashLog();
		} else {
			console.log("No trans");
			setActiveButtons([true, false, false]);
			console.log("dep");
			
		}
	}, []);

	
	function closeError() {
		console.log(1);
		setErrorModal({
			hidden: false,
			message: "",
		});
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
		<>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "error-bg" : "hide"
				}
			>
				<span className={connectWallet ? "" : "hide"} onClick={close}/>
			</div>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "App-error" : "App App2"
				}
			>
				{/*<Header activeCat={1}></Header>*/}

				<div className="collection">
					<div
						className={errorModal.hidden === true ? "error-modal-img" : "hide"}
					>
						<button className="close" onClick={closeError}>
							<span/>
							<span/>
						</button>
						{errorModal.img ? <img src={errorModal.img}/> : null}

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
								<div/>
								<div/>
								<div/>
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

				{/*<Footer></Footer>*/}
			</div>
		</>
	);
}

export default NftSingle;
