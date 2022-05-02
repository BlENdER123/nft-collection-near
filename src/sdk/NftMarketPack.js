import React, {useState, useEffect} from "react";
import {HashRouter as Router, useParams} from "react-router-dom";

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
import {NFTMarketContract} from "./collection contracts/NftMarketContract.js";
import {NftRootColectionContract} from "./collection contracts/NftRootColectionContract.js";
import {OfferContract} from "./collection contracts/OfferContract.js";

import Header from "./Header";
import Footer from "./Footer";

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

function NftMarketPack() {
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);
	const params = useParams();
	console.log(params);
	let addrCol = params.address;
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

	useEffect(() => {
		getCollection();
	}, []);

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

					<div class="title">{collection.name}</div>
					<div className="text">
						<div>
							Description:<span>{collection.desc}</span>
						</div>
					</div>
					<div className="text">
						<div>
							Owner:<span>{collection.addrOwner}</span>
						</div>
					</div>
					<div className="text">
						<div>
							Author:<span>{collection.addrAuth}</span>
						</div>
					</div>
					<div class="text">
						By purchasing and opening a pack of a collection, you get one of the
						NFTs from the selected collection
					</div>

					<div class="button-1-square" onClick={buyPack}>
						Buy
					</div>

					{/* <div class="nft-collection">
						{collection.map((item) => {
							return (
								<div class="nft-element" onClick={()=>setErrorModal({
									hidden: true,
									message: item
								})}>
									<img src={item} />
								</div>
							);
						})}
					</div> */}
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default NftMarketPack;
