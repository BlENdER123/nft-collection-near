import React, {useState, useEffect} from "react";
import {HashRouter as Router, useParams, useHistory} from "react-router-dom";

import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {signerKeys, TonClient, signerNone} from "@tonclient/core";

//contracts
// import {DeployerColectionContract} from "./collection contracts/nftour/src/build/DeployerColectionContract.js";
// import {NftRootContract} from "./collection contracts/nftour/src/build/NftRootContract.js";
// import {CollectionRoot} from "./collection contracts/nftour/src/build/NftRootContract.js";
// import {StorageContract} from "./collection contracts/nftour/src/build/StorageContract.js";

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

const {
	contractNft,
	nearConfig,
	contractRootNft,
	marketNft,
} = require("./config.json");

import * as nearAPI from "near-api-js";
const {parseNearAmount} = require("near-api-js/lib/utils/format");

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

function NftMarketNft() {
	let history = useHistory();
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);
	const params = useParams();
	console.log(params);
	let addrCol = params.address.split("!token!")[0];
	let token_id = params.address.split("!token!")[1];
	console.log(addrCol, token_id);
	const [isFullDescription, setIsFullDescription] = useState(false);

	// let arr = JSON.parse(localStorage.getItem("collection"));

	// const [collection, setCollection] = useState(arr);

	const [collection, setCol] = useState({
		addrAuth: "null",
		addrOwner: "null",
		desc: "null",
		name: "null",
	});

	const [nftInfo, setNftInfo] = useState({
		name: "No Name",
		desc: "No Description",
		img: null,
		owner: "No Owner",
		price: 0,
		width: 0,
		height: 0,
		size: 0,
	});

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	// let dexrootAddr = "0:65988b6da6392ce4d9ce1f79b5386e842c33b4161a2bbe76bdae170db711da31";

	let dexrootAddr =
		"0:11e33ea0bb68da5a1af69b406d7739c461c6a7d38ac79d670b6f0742c1f1b3d5";

	const zeroAddress =
		"0:0000000000000000000000000000000000000000000000000000000000000000";

	async function getNft() {
		window.near = await nearAPI.connect({
			deps: {
				keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
			},
			...nearConfig,
		});

		window.walletConnection = new nearAPI.WalletConnection(window.near);
		window.accountId = window.walletConnection.getAccountId();

		window.ContractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["get_sale"],
				changeMethods: ["offer"],
				// Change methods can modify the state, but you don't receive the returned value when called
				// changeMethods: ["new"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		let tempPrice;

		await ContractMarket.get_sale({
			nft_contract_token: addrCol + "." + token_id,
		}).then((data) => {
			console.log(data);
			tempPrice = data.sale_conditions;
		});

		window.ContractCol = await new nearAPI.Contract(
			window.walletConnection.account(),
			addrCol,
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

		ContractCol.nft_token({
			token_id: token_id,
		}).then((data) => {
			let info = data.metadata;

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

			let img = new Image();
			img.src = mediaUrl;

			img.onload = async function () {
				let tempW = this.width;
				let tempH = this.height;
				// console.log(this.size);
				await fetch(mediaUrl).then((r) => {
					r.blob().then((res) => {
						console.log(res);
						setNftInfo({
							name: info.title,
							desc: info.description,
							// desc: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
							img: mediaUrl,
							owner: data.owner_id,
							price: tempPrice / 1000000000000000000000000,
							width: tempW,
							height: tempH,
							size: res.size / 1024 / 1024,
						});
					});
				});
			};

			console.log(mediaUrl);
			console.log(data);
		});
	}

	useEffect(() => {
		getNft();
	}, []);

	async function getCollection() {
		console.log(addrCol);

		let tempCol;

		const tempOffer = new Account(OfferContract, {
			address: addrCol,
			signer: signerNone(),
			client,
		});

		let addrData;

		try {
			const response = await tempOffer.runLocal("getInfo", {});
			let value0 = response;
			addrData = response.decoded.output.addrNft;
			console.log("value0", value0);
		} catch (e) {
			console.log("catch E", e);
		}

		const tempAcc = new Account(DataContract, {
			address: addrData,
			signer: signerNone(),
			client,
		});

		try {
			const response = await tempAcc.runLocal("getInfo", {});
			let value0 = response;
			let data = response.decoded.output;
			tempCol = {
				name: data.name,
				desc: data.descriprion,
				addrAuth: data.addrAuthor,
				addrOwner: data.addrOwner,
			};
			console.log("value0", value0);
		} catch (e) {
			console.log("catch E", e);
		}

		setCol(tempCol);
	}

	// useEffect(() => {
	// 	getCollection();
	// }, []);

	function closeError() {
		console.log(1);
		setErrorModal({
			hidden: false,
			message: "",
		});
	}

	async function buyPack() {
		let decrypted = aes.decryptText(sessionStorage.getItem("seedHash"), "5555");

		const clientAcc = new Account(DEXClientContract, {
			address: sessionStorage.getItem("address"),
			signer: signerKeys(await getClientKeys(decrypted)),
			client,
		});

		try {
			const {body} = await client.abi.encode_message_body({
				abi: {type: "Contract", value: OfferContract.abi},
				signer: {type: "None"},
				is_internal: true,
				call_set: {
					function_name: "Buy",
					input: {},
				},
			});

			const res = await clientAcc.run("sendTransaction", {
				dest: addrCol,
				value: 1000000000,
				bounce: true,
				flags: 3,
				payload: body,
			});
			console.log(res);
		} catch (e) {
			console.log(e);
		}
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	async function buyNft() {
		await ContractMarket.offer(
			{
				nft_contract_id: addrCol,
				token_id: token_id,
			},
			"300000000000000",
			parseNearAmount(nftInfo.price.toString()),
		);
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
				<Header activeCat={2}></Header>

				<div class="container auction-sale">
					<div className="back" onClick={() => history.goBack()}>
						{/* <button ></button> */}
					</div>
					<div class="img">
						<div class="img">
							<img src={nftInfo.img} />
						</div>
						<div class="text">
							{nftInfo.width} x {nftInfo.height} px.IMAGE(
							{nftInfo.size.toFixed(2)}MB)
						</div>
						<div class="text">
							<div class="title">Contract Address</div>
							{addrCol}
						</div>
						<div class="text">
							<div class="title">Token ID</div>
							{token_id}
						</div>
					</div>
					<div class="content">
						<div
							class="title-col"
							onClick={() => history.push("/pack/" + addrCol)}
						>
							Collection Name (static)
						</div>
						<div class="title-nft">
							{nftInfo.name}
							<span className="share">
								<div class="img"></div>
								Share
							</span>
						</div>
						<div class="users">
							<div class="user">
								<div class="img">H</div>
								<div class="text">
									<span>Creator</span>Hellow World
								</div>
							</div>
							<div class="user">
								<div class="img">M</div>
								<div class="text">
									<span>Owner</span>
									{nftInfo.owner}
								</div>
							</div>
						</div>
						<div class="desc">
							<div class="title">Description</div>
							{isFullDescription ? nftInfo.desc : nftInfo.desc.slice(0, 40)}
							<br />
							<div
								className={nftInfo.desc.length > 40 ? "show" : "hide"}
								onClick={() => setIsFullDescription(!isFullDescription)}
							>
								Show full description{" "}
							</div>
						</div>
						<div class="price">
							<div class="title">Price</div>
							<div class="price">
								<span></span>
								{nftInfo.price.toFixed(3)} NEAR
							</div>
							<div class="buttons">
								<div class="button button-1-square" onClick={buyNft}>
									Buy now
								</div>
							</div>
						</div>
						{/* <div class="time">
							<div class="title">Auction ends in</div>
							<div class="timer">
								<div class="timer-item">
									<div class="num">02</div>
									<div class="text">Days</div>
								</div>
								<div class="timer-item">
									<div class="num">02</div>
									<div class="text">Hours</div>
								</div>
								<div class="timer-item">
									<div class="num">02</div>
									<div class="text">Minutes</div>
								</div>
								<div class="timer-item">
									<div class="num">02</div>
									<div class="text">Seconds</div>
								</div>
							</div>
						</div> */}

						<div class="history">
							<div class="menu-history">
								<div class="menu-item">Item Activity</div>
								<div class="menu-item">Provenance</div>
							</div>
							<div class="content">
								<div class="item">
									<div class="name">
										radiance.testnet <span>Mint</span>
									</div>
									<div class="price">242 BUSD</div>
									<div class="date">3 hours ago</div>
									<div class="price-rub">≈ ₽ 16,982.40</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default NftMarketNft;
