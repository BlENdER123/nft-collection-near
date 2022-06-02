import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {signerKeys, TonClient, signerNone} from "@tonclient/core";

//contracts
// import {DeployerColectionContract} from "./collection contracts/nftour/src/build/DeployerColectionContract.js";
// import {NftRootContract} from "./collection contracts/nftour/src/build/NftRootContract.js";
// import {CollectionRoot} from "./collection contracts/nftour/src/build/NftRootContract.js";
// import {StorageContract} from "./collection contracts/nftour/src/build/StorageContract.js";
import {DEXClientContract} from "../../sdk/collection contracts/DEXClient.js";
import {DataContract} from "../../sdk/collection contracts/DataContract.js";
import {OfferContract} from "../../sdk/collection contracts//OfferContract.js";

import Header from "../../Pages/Header/Header";
import Footer from "../../Pages/Footer/Footer";

import {useDispatch, useSelector} from "react-redux";

TonClient.useBinaryLibrary(libWeb);



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

function NftMarketAuction() {
	// const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);
	// const params = useParams();
	// console.log(params);
	// let addrCol = params.address;
	// let arr = JSON.parse(localStorage.getItem("collection"));

	// const [collection, setCollection] = useState(arr);

	const [collection, setCol] = useState({
		addrAuth: "null",
		addrOwner: "null",
		desc: "null",
		name: "null",
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

	return (
		<>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "error-bg" : "hide"
				}
			>
				<span onClick={close}/>
			</div>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "App-error" : "App App2"
				}
			>
				{/*<Header activeCat={2}></Header>*/}

				<div class="container auction-sale">
					<div class="img">
						<div class="img"/>
						<div class="text">
							<div class="title">Contract Address</div>
							0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec
						</div>
						<div class="text">
							<div class="title">Token ID</div>
							100300666241
						</div>
					</div>
					<div class="content">
						<div class="title-col">Untitled Coolection #1239239</div>
						<div class="title-nft">Roboto #20542040</div>
						<div class="desc">
							<div class="title">Description</div>
							Tattooed Kitty Gang (“TKG”) is a collection of 666 badass kitty
							gangsters, with symbol of tattoos, living in the Proud Kitty Gang
							(“PKG”) metaverse. Each TKG is an 1/1 ID as gangster member & all
							the joint rights.
						</div>
						<div class="price">
							<div class="title">Current Bid</div>
							<div class="price">269.8 BUSD</div>
							<div class="buttons">
								<div class="button">Place a Bid</div>
								<div class="button">Buyout price</div>
							</div>
						</div>
						<div class="time">
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
						</div>

						<div class="history">
							<div class="menu-history">
								<div class="menu-item">Bid History</div>
								<div class="menu-item">Provenance</div>
							</div>
							<div class="content">
								<div class="item">
									<div class="name">
										HAL <span>Placed a bid</span>
									</div>
									<div class="price">242 BUSD</div>
									<div class="date">3 hours ago</div>
									<div class="price-rub">≈ ₽ 16,982.40</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/*<Footer></Footer>*/}
			</div>
		</>
	);
}

export default NftMarketAuction;
