import React, {useState, useEffect} from "react";
// import {connect} from "react-redux";
import {HashRouter as Router, Redirect, useHistory} from "react-router-dom";
//import {main_screen_bg} from "../sdk/img/screenbg1.png"
import ConnectWalletPage from "./ConnectWalletPage";

import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

import {signerKeys, TonClient, signerNone} from "@tonclient/core";

import {DataContract} from "./collection contracts/DataContract.js";
import {NFTMarketContract} from "./collection contracts/NftMarketContract.js";
import {NftRootColectionContract} from "./collection contracts/NftRootColectionContract.js";

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

const config = require("./config.json");

TonClient.useBinaryLibrary(libWeb);

const client = new TonClient({network: {endpoints: [config.DappServer]}});

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

function CollectionMarket() {
	let history = useHistory();

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	const [connectWal, setConnect] = useState(false);

	const [mintNftData, setMintNftData] = useState({
		hidden: true,
	});

	const [redirect, setRedirect] = useState(false);

	let marketrootAddr = config.marketroot;

	const zeroAddress =
		"0:0000000000000000000000000000000000000000000000000000000000000000";

	let [collections, setCollections] = useState([]);

	async function getCollections() {
		let rootCode;

		const acc = new Account(NFTMarketContract, {
			address: marketrootAddr,
			signer: signerNone(),
			client,
		});

		try {
			const response = await acc.runLocal("resolveCodeHashNftRoot", {});
			let value0 = response;
			rootCode = response.decoded.output.codeHashData.split("0x")[1];
			console.log("value0", value0);
		} catch (e) {
			console.log("catch E", e);
		}

		let tempCols = [];

		await fetch("https://net.ton.dev/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `
					{accounts(
					filter:{
						  code_hash:{
						  eq:"${rootCode}"
						}
					}){
					  id
					}}
				`,
			}),
		})
			.then((r) => r.json())
			.then(async (data) => {
				let tempData = data.data.accounts;

				for (let i = 0; i < tempData.length; i++) {
					let tempAddr = tempData[i].id;

					const tempAcc = new Account(NftRootColectionContract, {
						address: tempAddr,
						signer: signerNone(),
						client,
					});

					try {
						const response = await tempAcc.runLocal("getInfo", {});
						let value0 = response;
						let data = response.decoded.output;
						tempCols.push({
							name: data.name,
							desc: data.description,
							icon: data.icon,
							addrCol: tempAddr,
						});
						console.log("value0", value0);
					} catch (e) {
						console.log("catch E", e);
					}
				}
			});

		console.log(tempCols);
		setCollections(tempCols);
	}

	useEffect(() => {
		getCollections();
	}, []);

	function openCollection(collection) {
		console.log(collection);

		history.push("/collection-market-pack/" + collection);
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	return (
		<Router>
			<div
				className={!mintNftData.hidden || connectWallet ? "error-bg" : "hide"}
			>
				<span onClick={close}></span>
			</div>
			<div
				className={
					!mintNftData.hidden || connectWallet ? "App-error" : "App App2"
				}
			>
				<Header activeCat={2}></Header>

				<div
					className={
						mintNftData.hidden ? "hide" : "modal-connect modal-connect-first"
					}
				>
					<button
						className="close"
						onClick={() => setMintNftData({hidden: true})}
					>
						<span></span>
						<span></span>
					</button>
					<div class="title">Robots Collection</div>
					<div class="mint owner">
						Owner: <span>0:65eb...fe7b</span>{" "}
					</div>
					<div class="mint price">
						Price: <span>149</span>{" "}
					</div>
					<div class="mint royalty">
						Royalty for Author <span>15%</span>{" "}
					</div>
					<div class="button-1-square">Buy & Open Pack</div>
				</div>

				<div class="collections">
					{/* <div class="collection">
						<div class="img">
						</div>
						<div class="content">
							<div class="name">Robot #23245</div>
							<div class="rank">
								<span>Rank:</span>100
							</div>
							<div class="price">
								<span>Price:</span>149000.00
							</div>
							<div class="price-quality">
								<span>Price quality:</span>50%
							</div>
							<div class="button-1-square" onClick={()=>openCollection("owner1", "collection1")}>Buy & Open Pack</div>
						</div>
					</div> */}

					{/* <button onClick={getCollections}>Test</button> */}
					{collections.length > 0
						? collections.map((item, index) => {
								return (
									<div class="collection">
										<div class="img">
											<img
												src={"https://gateway.pinata.cloud/ipfs/" + item.icon}
											/>
										</div>
										<div class="content">
											<div class="name">{item.name}</div>
											<div class="description">
												<span>Description:</span>
												{item.desc}
											</div>
											{/* <div class="rank">
											<span>Rank:</span>100
										</div>
										<div class="price">
											<span>Price:</span>149000.00
										</div>
										<div class="price-quality">
											<span>Price quality:</span>50%
										</div> */}
											<div
												class="button-1-square"
												// onClick={() => setMintNftData({hidden: false})}
												onClick={() => openCollection(item.addrCol)}
											>
												Buy & Open pack
											</div>
										</div>
									</div>
								);
						  })
						: // <button className="button-1-square" onClick={getCollections}>
						  // 	Load Collections
						  // </button>
						  null}

					{redirect ? <Redirect to="/collection-market-pack" /> : ""}
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default CollectionMarket;
