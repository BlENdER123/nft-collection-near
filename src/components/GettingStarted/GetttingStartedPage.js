import React, {useState} from "react";
import {HashRouter as Router, useNavigate} from "react-router-dom";


import {useDispatch, useSelector} from "react-redux";

function GettingStarted() {
	let navigate = useNavigate();
	const [curentMode, setCurentMode] = useState(0);

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	const [videoPlay, setVideoPlay] = useState(false);

	function next() {
		if (curentMode === 0) {
      navigate("/load-nft");
		}

		if (curentMode === 1) {
      navigate("/collection-market");
		}

		if (curentMode === 2) {
      navigate("/load-nft-single");
		}

		if (curentMode === 3) {
      navigate("/nft-market");
		}
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	return (
		<div>
			<div className={connectWallet ? "error-bg" : "hide"}>
				<span onClick={close}/>
			</div>

			<div className={videoPlay ? "video-player" : "hide"}>
				<button className="close" onClick={() => setVideoPlay(false)}>
					<span/>
					<span/>
				</button>

				<div className="video">
					<iframe
						src="https://www.youtube.com/embed/YHatcktJM8I"
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
			</div>

			<div className={connectWallet ? "App-error" : "App App2"}>
				{/*<Header activeCat={0}/>*/}

				<div className="start-screen">
					<div className="container-header">
						<div className="content content-market">
							<div className="content_1">
								<div className="title">Getting Started</div>
								<div className="text">Select layout type</div>
							</div>
							<div className="content_2">
								<button
									className="button-4-square"
									onClick={() => {
                    navigate("/collection-market");
									}}
								>
									<span/>Collection Market
								</button>
								<button
									className="button-4-square"
									onClick={() => {
                    navigate("/nft-market");
									}}
								>
									<span/>NFT Market
								</button>
							</div>
						</div>

						<div className="video-start">
							Not sure where to start?{" "}
							<span onClick={() => setVideoPlay(true)}>
								Check out our intro video here.
							</span>
						</div>

						<div className="content content-generator">
							<div
								className={curentMode == 0 ? "content_1 active" : "content_1"}
								onClick={() => setCurentMode(0)}
							>
								<div className="hint hint--left" aria-label="Hint"></div>
								<div className="img"></div>
								<div className="desc">
									<div className="title">NFT Generator Collections</div>
									<div className="text">
										Create your own NFT collection in a simple constructor
									</div>
								</div>
							</div>
							<div
								className={curentMode === 2 ? "content_2 active" : "content_2"}
								onClick={() => setCurentMode(2)}
							>
								<div className="hint hint--left" aria-label="Hint"></div>
								<div className="img"></div>
								<div className="desc">
									<div className="title">NFT Generator Single</div>
									<div className="text">
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

				{/*<Footer/>*/}
			</div>
		</div>
	);
}

export default GettingStarted;
