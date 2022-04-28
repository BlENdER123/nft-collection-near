import React, {useState} from "react";
//import "../index.scss";
//import './App.css';
//import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";
import logo from "./img/radiance logo.png";
import {
	HashRouter as Router,
	Switch,
	Route,
	useHistory,
} from "react-router-dom";
import ConnectWalletPage from "./ConnectWalletPage";
import {useDispatch, useSelector} from "react-redux";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";

const CONTRACT_NAME = "dev-1646972874579-36142488542328";

const nearConfig = {
	networkId: "testnet",
	nodeUrl: "https://rpc.testnet.near.org",
	contractName: CONTRACT_NAME,
	walletUrl: "https://wallet.testnet.near.org",
	helperUrl: "https://helper.testnet.near.org",
};

const {connect, keyStores, WalletConnection} = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const config = {
	networkId: "testnet",
	keyStore, // optional if not signing transactions
	nodeUrl: "https://rpc.testnet.near.org",
	walletUrl: "https://wallet.testnet.near.org",
	helperUrl: "https://helper.testnet.near.org",
	explorerUrl: "https://explorer.testnet.near.org",
};

function Header({activeCat}) {
	let history = useHistory();

	const [openMenu, setOpenMenu] = useState(false);

	const [mobMenu, setMobMenu] = useState(false);

	const dispatch = useDispatch();

	const connectWallet = useSelector((state) => state.connectWallet);

	const [nearInit, setNearInit] = useState(false);

	function logOut(e) {
		walletAccount.signOut();
		// localStorage.clear();
		localStorage.removeItem("undefined_wallet_auth_key");
		location.reload();
	}

	async function connectNear() {
		window.nearConfig = {
			networkId: "default",
			nodeUrl: "https://rpc.testnet.near.org",
			walletUrl: "https://wallet.testnet.near.org",
		};

		// Initializing connection to the NEAR DevNet.
		window.near = await nearAPI.connect(
			Object.assign(
				{deps: {keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()}},
				window.nearConfig,
			),
		);

		// Needed to access wallet login
		window.walletAccount = new nearAPI.WalletAccount(window.near);

		// Getting the Account ID. If unauthorized yet, it's just empty string.
		window.accountId = window.walletAccount.getAccountId();
	}

	function connectWal() {
		walletAccount.requestSignIn("", "Title");
		console.log(nearAPI);
		console.log(walletAccount);
	}

	const [walletAddress, setWalletAddress] = useState();

	if (!nearInit) {
		window.nearInitPromise = connectNear().then(() => {
			try {
				setWalletAddress(walletAccount.getAccountId());
			} catch {
				setWalletAddress(undefined);
			}
			console.log(walletAddress);
			setNearInit(true);
		});
	}

	function initContract() {
		contract1.new_default_meta({owner_id: "blender.testnet"});
	}

	function test123() {
		contract1
			.nft_supply_for_owner({account_id: "blender.testnet"})
			.then((data) => {
				console.log(data);
			});
		contract1.nft_tokens({from_index: "0", limit: 50}).then((data) => {
			console.log(data);
		});
	}

	function contractF() {
		console.log(1);
		contract1
			.nft_mint(
				{
					token_id: "1",
					receiver_id: "blender.testnet",
					token_metadata: {
						title: "Olympus Mons",
						description: "Tallest mountain in charted solar system",
						media:
							"https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg",
						copies: 1,
					},
				},
				"30000000000000",
				"7090000000000000000000",
			)
			.then((data) => {
				console.log(data);
			});
	}

	function contractP() {
		contract1.nft_metadata().then((data) => {
			console.log(data);
		});
	}

	function test321() {
		console.log(walletConnection.getAccountId());
	}

	function new_init() {
		contract1
			.new({
				owner_id: window.walletConnection.getAccountId(),
				metadata: {
					spec: "nft-1.0.0",
					name: "NFT Contract test",
					symbol: "RTEAMTEST",
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

	function mint_new() {
		contract1
			.nft_mint(
				{
					token_id: "2",
					metadata: {
						title: "Olympus Mons11111111",
						description: "Tallest mountain in charted solar system",
						media:
							"https://www.abisoft.ru/upload/iblock/12a/12a6eeadebe9565939234b1747c36c51.jpg",
						copies: 1,
					},
					receiver_id: "blender.testnet",
				},
				"30000000000000",
				"7490000000000000000000",
			)
			.then((data) => {
				console.log(data);
			});
	}

	return (
		<Router>
			<span
				style={{
					position: "absolute",
					bottom: "0px",
					left: "0px",
					color: "#fff",
				}}
			>
				V28.04/11:00
			</span>
			<div className="header header2">
				<div className="container-header">
					<div className="acc-info">
						<div className={mobMenu ? "hide" : "acc-info1"}>
							<a href="#/">
								<div className="name">NFT Art Generator</div>
							</a>
							{localStorage.undefined_wallet_auth_key ? (
								<div className="wallet">
									<div className="acc-status">Connected:</div>
									<div className="acc-wallet">{walletAddress}</div>
									<div
										className={
											openMenu ? "btn-menu btn-menu-active" : "btn-menu"
										}
										onClick={() => setOpenMenu(!openMenu)}
									></div>

									<div className={openMenu ? "menu-info" : "hide"}>
										<a
											onClick={(ev) => {
												ev.preventDefault();
												history.push("/profile/" + walletAddress);
											}}
										>
											Your Profile
										</a>
										<a onClick={logOut}>Log out</a>
									</div>

									{/* <button onClick={new_init}>init Collection</button>
									<button onClick={mint_new}>mint Collection</button> */}
								</div>
							) : (
								<div className="wallet">
									<div className="button-1-square" onClick={connectWal}>
										Connect
									</div>

									{/* <button onClick={test321}>test</button> */}
									{/* <button onClick={initContract}>init Call</button>
									<button onClick={contractF}>contract Call</button>
									<button onClick={contractP}>contract View</button>
									<button onClick={test123}>view1</button> */}
								</div>
							)}
						</div>

						<div className="pages">
							<a href="#/">
								<div
									className={
										activeCat == 0 ? "page-element active" : "page-element"
									}
								>
									Home
								</div>
							</a>
							<a href="#/load-nft">
								<div
									className={
										activeCat == 1 ? "page-element active" : "page-element"
									}
								>
									Collection Editor
								</div>
							</a>
							<a href="#/nft-market">
								<div
									className={
										activeCat == 2 ? "page-element active" : "page-element"
									}
								>
									Marketplace
								</div>
							</a>
							<a href="#/how">
								<div
									className={
										activeCat == 3 ? "page-element active" : "page-element"
									}
								>
									FAQ
								</div>
							</a>
						</div>

						<div className={mobMenu ? "pages-m pages-m-active" : "pages-m"}>
							<a href="#/">
								<div
									className={
										activeCat == 0 ? "page-element active" : "page-element"
									}
								>
									Home
								</div>
							</a>
							<a href="#/load-nft">
								<div
									className={
										activeCat == 1 ? "page-element active" : "page-element"
									}
								>
									Collection Editor
								</div>
							</a>
							<a href="#/nft-market">
								<div
									className={
										activeCat == 2 ? "page-element active" : "page-element"
									}
								>
									Marketplace
								</div>
							</a>
							<a href="#/how">
								<div
									className={
										activeCat == 3 ? "page-element active" : "page-element"
									}
								>
									FAQ
								</div>
							</a>

							<span
								onClick={() => setMobMenu(!mobMenu)}
								className={mobMenu ? "menu-m menu-m-active" : "menu-m"}
							></span>
						</div>
					</div>
				</div>
			</div>

			<div className={connectWallet ? "" : "hide"}>
				<ConnectWalletPage></ConnectWalletPage>
			</div>
		</Router>
	);
}

export default Header;
