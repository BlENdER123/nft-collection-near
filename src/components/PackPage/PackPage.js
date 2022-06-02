import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";


const {nearConfig, contractRootNft} = require("../../sdk/config.json");
const {parseNearAmount} = require("near-api-js/lib/utils/format");



Object.defineProperty(window, "indexedDB", {
	value:
		window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB,
});

function PackPage() {
	// let localClass = arr;
	// loading project from localStorage

	const params = useParams();
	let addrCol = params.address;

	const [collectionName, setCollectionName] = useState("No Name");

	if (
		localStorage.getItem("nft-collection-step") === null ||
		localStorage.getItem("nft-collection-step") === undefined ||
		isNaN(parseInt(localStorage.getItem("nft-collection-step"), 10))
	) {
		localStorage.setItem("nft-collection-step", 1);
	}

	const [amountMintNft, setAmountMintNft] = useState(1);

	const [collectionCount, setCollectionCount] = useState([0,0]);

	const [mintPrice, setMintPrice] = useState("0");

	const [owner, setOwner] = useState("123");

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
			setOwner(data.creator);
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
				// setOwner(data[0].owner_id);
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
	let arrClass = JSON.parse(localStorage.getItem("class"));

	let navigate = useNavigate();
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

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

	let details = JSON.parse(localStorage.getItem("details"));
	if (details === {} || details === undefined || details === null) {
		details = {
			projName: "No Name",
			projectName: "No Name",
			projectDescription: "No Description",
		};
	}
	if (details.projName === undefined) {
		details.projName = "No Name";
	}
	if (details.projectName === undefined) {
		details.projectName = "No Name";
	}
	if (details.projectDescription === undefined) {
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

	const [nearInit, setNearInit] = useState(false);

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

	




	function closeError() {
		setErrorModal({
			hidden: false,
			message: "",
		});
	}


	function close() {
		dispatch({type: "closeConnect"});
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

				<div class="construtors constructors-col">
					<div class="container-header">
						<div
							className={
								errorModal.hidden === true ? "error-modal-img" : "hide"
							}
						>
							{/* <span onClick={closeError}></span> */}
							<button className="close" onClick={closeError}>
								<span/>
								<span/>
							</button>
							{errorModal.img ? <img src={errorModal.img}/> : null}

							<div className="message">{errorModal.message}</div>
						</div>

						<div class="modal-constructor modal-constructor-back">
							<button
								onClick={() => {
									navigate(-1);
								}}
							/>
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
									<span/>{" "}
									<div class="price">
										{(mintPrice / 1000000000000000000000000).toFixed(1)} NEAR
									</div>
								</div>
							</div>

							<div style={{margin: "0px 0px 40px 0px"}} class="progress">
								<div class="title">Minted</div>
								<div class="bar">
									<span style={{"width": (collectionCount[0]-collectionCount[1])/(collectionCount[0]/100)+"%"}}/>
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

				{/*<Footer></Footer>*/}
			</div>
		</>
	);
}

export default PackPage;
