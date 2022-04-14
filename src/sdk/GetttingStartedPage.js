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

			<div className={connectWallet ? "App-error" : "App App2"}>
				<Header activeCat={0}></Header>

				<div className="start-screen">
					<div className="container-header">
						<div class="content content-market">
							<div class="content_1">
								<div className="title">Getting Started</div>
								<div className="text">Select layout type</div>
							</div>
							<div class="content_2">
								<button
									className="button-4-square"
									onClick={() => {
										history.push("/collection-market");
									}}
								>
									<span></span>Collection Market
								</button>
								<button
									className="button-4-square"
									onClick={() => {
										history.push("/nft-market");
									}}
								>
									<span></span>NFT Market
								</button>
							</div>
						</div>

						<div class="video-start">
							Not sure where to start?{" "}
							<span onClick={() => setVideoPlay(true)}>
								Check out our intro video here.
							</span>
						</div>

						<div class="content content-generator">
							<div
								className={curentMode == 0 ? "content_1 active" : "content_1"}
								onClick={() => setCurentMode(0)}
							>
								<div class="hint hint--left" aria-label="Hint"></div>
								<div class="img"></div>
								<div class="desc">
									<div class="title">NFT Generator Collections</div>
									<div class="text">
										Create your own NFT collection in a simple constructor
									</div>
								</div>
							</div>
							<div
								className={curentMode == 2 ? "content_2 active" : "content_2"}
								onClick={() => setCurentMode(2)}
							>
								<div class="hint hint--left" aria-label="Hint"></div>
								<div class="img"></div>
								<div class="desc">
									<div class="title">NFT Generator Single</div>
									<div class="text">
										Create your own unique NFT in a simple constructor
									</div>
								</div>
							</div>
						</div>

						<button className="button-1-square" onClick={next}>
							Go Next
						</button>
					</div>
				</div>

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default GettingStarted;
