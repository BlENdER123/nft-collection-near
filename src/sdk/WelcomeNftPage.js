import React, {useState, PropTypes} from "react";
// import {connect, useSelector} from "react-redux";
import {HashRouter as Router, useHistory} from "react-router-dom";
//import {main_screen_bg} from "../sdk/img/screenbg1.png"
import ConnectWalletPage from "./ConnectWalletPage";
import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

import {
	Link,
	Button,
	Element,
	Events,
	animateScroll as scroll,
	scrollSpy,
	scroller,
} from "react-scroll";

const pidCrypt = require("pidcrypt");
require("pidcrypt/aes_cbc");

function WelcomeNftPage() {
	let history = useHistory();

	const dispatch = useDispatch();

	const connectWallet = useSelector((state) => state.connectWallet);

	const [connectWal, setConnect] = useState(false);

	function handleConnectClick() {
		console.log(1);
		setConnect(true);
	}

	const [openMenu, setOpenMenu] = useState(false);

	const aes = new pidCrypt.AES.CBC();

	function logOut(e) {
		e.preventDefault();
		console.log(1);
		sessionStorage.clear();
		location.reload();
	}

	function addCash() {
		dispatch({type: "openConnect"});
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	function logCash() {
		console.log(connectWallet);
	}

	return (
		<Router>
			<div className={connectWallet ? "error-bg" : "hide"}>
				<span onClick={close}></span>
			</div>
			<div className={connectWallet ? "App-error" : "App"}>
				<Header activeCat={0}></Header>

				<div className="main-screen">
					<div className="container">
						<div className="content">
							<div className="title">
								Create your own NFT collections easy and fast
							</div>
							<div className="text">
								Download or generate more than 15,000 unique NFT arts with no
								code in user-friendly interface.
							</div>
							<div className="buttons">
								<a
									onClick={(ev) => {
										ev.preventDefault();
										history.push("/load-nft");
									}}
								>
									<button className="button-1">Get started</button>
								</a>
								<Link to="video">
									<button className="button-2">How it work</button>
								</Link>
								{/* <button onClick={()=>{
									let temp = aes.decryptText(sessionStorage.getItem("seedHash"), "5555");
									console.log(temp);

								}}>test</button> */}
							</div>
						</div>
					</div>
				</div>

				<div className="quality-screen">
					<div className="container">
						<div className="content">
							<div className="title">Pure Creativity</div>
							<div className="text">
								NFT art creator’s main goal is to invent, and using NFTour
								artists and designers can do just that without wasting precious
								time on trying to understand code. You can create your NFT
								collection using our base with pics or upload your own NFT arts
								by setting different parameters.
							</div>

							<div className="quality-list">
								<div className="quality-element">
									<div className="quality-title">Simple to use</div>
									<div className="quality-text">
										No need for coding. All you need to do is create your own
										layers and indicate your assets then click generate.
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Upload images</div>
									<div className="quality-text">
										You will be able to compile the NFT collection from our base
										or convey your own arts. In any case you will be able to
										create a collection in your favorite format.
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Layer Uniqueness </div>
									<div className="quality-text">
										In a huge collection you might not want to put layers in
										every NFT. You can compose a level of rarity and then will
										be bid only certain number of times.
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Characteristic rarity</div>
									<div className="quality-text">
										You can configure certain traits to be more rarer than
										others the same way as with layers. It will be easy to
										differentiate the changes of the characteristics that will
										be applied.
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Autosaving</div>
									<div className="quality-text">
										Your work will automatically be saved in the browser, so
										that when you get back, your layers, configurations and
										files will still be there.{" "}
									</div>
								</div>
								<div className="quality-element">
									<div className="quality-title">Customer support</div>
									<div className="quality-text">
										You can connect with us on Telegram and get support in case
										you need help or have any questions.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="video-screen">
					<div className="container">
						<div className="content">
							<div className="title">Watch how it works</div>
							<div className="text">
								NFT art creator’s main goal is to invent, and using NFTour
								artists
							</div>
							<Element name="video" className="element"></Element>
							<div className="video">
								<iframe
									src="https://www.youtube.com/embed/YHatcktJM8I"
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
						</div>
					</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default WelcomeNftPage;
