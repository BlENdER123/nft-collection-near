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

const CONTRACT_NAME = "dev-1586706630629";

const nearConfig = {
	networkId: "testnet",
	nodeUrl: "https://rpc.testnet.near.org",
	contractName: CONTRACT_NAME,
	walletUrl: "https://wallet.testnet.near.org",
	helperUrl: "https://helper.testnet.near.org",
};

function Header({activeCat}) {
	let history = useHistory();

	const [openMenu, setOpenMenu] = useState(false);

	const [mobMenu, setMobMenu] = useState(false);

	const dispatch = useDispatch();

	const connectWallet = useSelector((state) => state.connectWallet);

	function logOut(e) {
		e.preventDefault();
		console.log(1);
		sessionStorage.clear();
		location.reload();
	}

	function open() {
		dispatch({type: "openConnect"});
		console.log(connectWallet);
	}

	async function connectNear() {
		console.log(1);

		window.near = await nearAPI.connect({
			deps: {
				keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
			},
			...nearConfig,
		});

		// Needed to access wallet login
		window.walletConnection = new nearAPI.WalletConnection(window.near);

		// Initializing our contract APIs by contract name and configuration.
		window.contract1 = await new nearAPI.Contract(
			window.walletConnection.account(),
			nearConfig.contractName,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["get_num"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["increment", "decrement", "reset"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);
	}

	function connectWal() {
		walletConnection.requestSignIn(CONTRACT_NAME, "Rust Counter Example");
	}

	window.nearInitPromise = connectNear().then(() => {
		console.log("test");
	});

	function contractF() {
		contract1.get_num().then((count) => {
			console.log(count);
		});
	}

	function contractP() {
		contract1.increment();
	}

	return (
		<Router>
			<div className="header header2">
				<div className="container-header">
					<div className="acc-info">
						<div className={mobMenu ? "hide" : "acc-info1"}>
							<a href="#/">
								<div class="name">NFTour</div>
							</a>
							{sessionStorage.address ? (
								<div class="wallet">
									<div className="acc-status">Connected:</div>
									<div className="acc-wallet">{sessionStorage.address}</div>
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
												history.push(
													"/profile/" + sessionStorage.getItem("address"),
												);
											}}
										>
											Your Profile
										</a>
										<a onClick={logOut}>Log out</a>
									</div>
								</div>
							) : (
								<div class="wallet">
									<div class="button-1-square" onClick={connectWal}>
										Connect
									</div>
									{/* <button onClick={connectWal}>test</button>
									<button onClick={contractF}>contract</button>
									<button onClick={contractP}>plus</button> */}
								</div>
							)}
						</div>

						<div class="pages">
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
									NFT Generator
								</div>
							</a>
							<a href="#/collection-market">
								<div
									className={
										activeCat == 2 ? "page-element active" : "page-element"
									}
								>
									NFT Collection Market
								</div>
							</a>
							<div class="page-element">FAQ</div>
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
									NFT Generator
								</div>
							</a>
							<a href="#/collection-market">
								<div
									className={
										activeCat == 2 ? "page-element active" : "page-element"
									}
								>
									NFT Collection Market
								</div>
							</a>
							<a>
								<div class="page-element">FAQ</div>
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
