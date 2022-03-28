import React, {useState} from "react";
import {HashRouter as Router, Redirect, useHistory} from "react-router-dom";
//import {main_screen_bg} from "../sdk/img/screenbg1.png"
import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

function GettingStarted() {
	let history = useHistory();
	const [curentMode, setCurentMode] = useState(0);

	const [redirect, setRedirect] = useState([false, false, false, false]);

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	const [videoPlay, setVideoPlay] = useState(false);

	function next() {
		if (curentMode == 0) {
			history.push("/load-nft");
		}

		if (curentMode == 1) {
			history.push("/collection-market");
		}

		if (curentMode == 2) {
			history.push("/load-nft-single");
		}

		if (curentMode == 3) {
			history.push("/nft-market");
		}
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	return (
		<Router>
			<div className={connectWallet ? "error-bg" : "hide"}>
				<span onClick={close}></span>
			</div>

			<div className={videoPlay ? "video-player" : "hide"}>
				<button className="close" onClick={() => setVideoPlay(false)}>
					<span></span>
					<span></span>
				</button>

				<div class="video">
					<iframe
						src="https://www.youtube.com/embed/YHatcktJM8I"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			</div>

			<div className={connectWallet ? "App-error" : "App"}>
				<Header activeCat={0}></Header>

				<div class="start-screen">
					<div class="container-header">
						<div class="content-1">
							<div class="title">Getting Started</div>
							<div class="text">Select layout type</div>
							<div class="modes">
								<div
									className={
										curentMode == 0
											? "mode mode-generator active"
											: "mode mode-generator"
									}
									onClick={() => setCurentMode(0)}
								>
									<div class="img"></div>

									<span>NFT Generator Collections</span>
								</div>
								<div
									className={
										curentMode == 2
											? "mode mode-generator active"
											: "mode mode-generator"
									}
									onClick={() => setCurentMode(2)}
								>
									<div class="img"></div>

									<span>NFT Generator Single</span>
								</div>
								<div
									className={
										curentMode == 1
											? "mode mode-constructor active"
											: "mode mode-constructor"
									}
									onClick={() => setCurentMode(1)}
								>
									{/* <div class="soon">Coming Soon</div> */}
									<div class="img"></div>
									<div class="break"></div>
									<span>NFT Collection Market</span>
								</div>
								<div
									className={
										curentMode == 3
											? "mode mode-constructor active"
											: "mode mode-constructor"
									}
									onClick={() => setCurentMode(3)}
								>
									{/* <div class="soon">Coming Soon</div> */}
									<div class="img"></div>
									<div class="break"></div>
									<span>NFT Market</span>
								</div>
							</div>
							<div onClick={next} class="button-1-square">
								Next
							</div>
							<a href="https://www.youtube.com/watch?v=YHatcktJM8I">
								<div class="button-3-square">
									Not sure where to start? Check out our intro video here.
								</div>
							</a>
						</div>
						<div class="content-2">
							<div class="title">How to Use NFTour Collection Generator?</div>
							<div class="text">
								NFTour collection generator is a special software by which you
								can easily create thousands of unique NFT arts. The software
								application will generate a series of digital collectibles based
								on the specification given by the user. Here are the steps you
								need to follow in order to use it.
								<br />
								<a href="#/how">
									<button class="button-1-square">How to use?</button>
								</a>
								<button
									class="button-2-square"
									onClick={() => setVideoPlay(true)}
								>
									Video Instructions
								</button>
							</div>
						</div>
					</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default GettingStarted;
