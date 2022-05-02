import React, {useState} from "react";
import {connect} from "react-redux";
import {HashRouter as Router} from "react-router-dom";
//import {main_screen_bg} from "../sdk/img/screenbg1.png"
import ConnectWalletPage from "./ConnectWalletPage";

import Header from "./Header";
import Footer from "./Footer";

function OpenPack() {
	const [connectWal, setConnect] = useState(false);

	return (
		<Router>
			<div className={connectWal ? "error-bg" : "hide"}></div>
			<div className={connectWal ? "App-error" : "App App2"}>
				<Header activeCat={2}></Header>

				<div class="pack">
					<div class="title">Robots Collection</div>
					<div class="info">
						<div>
							Owner: <span>0:65eb...fe7b</span>
						</div>
						<div>
							Price: <span>149000.00</span>
						</div>
						<div>
							Royalty for Author : <span>15%</span>
						</div>
					</div>
					<div class="text">
						By purchasing and opening a pack of a collection, you get one of the
						NFTs from the selected collection
					</div>
					<div class="button-1-square">Buy & Open Pack</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default OpenPack;
