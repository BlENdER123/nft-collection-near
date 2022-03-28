import React, {useState} from "react";
import {HashRouter as Router, Redirect} from "react-router-dom";
//import {main_screen_bg} from "../sdk/img/screenbg1.png"

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

function HowPage() {
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);
	const [curentMode, setCurentMode] = useState(0);

	const [redirect, setRedirect] = useState([false, false]);

	function next() {
		let temp = [];
		for (let i = 0; i < redirect.length; i++) {
			let tempVal = redirect[i];
			if (i == curentMode) {
				tempVal = true;
			} else {
				tempVal = false;
			}
			temp.push(tempVal);
		}
		setRedirect(temp);
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
			<div className={connectWallet ? "App-error" : "App2"}>
				<Header activeCat={3}></Header>

				<div class="start-screen">
					<div
						class="container-header"
						style={{display: "flex", justifyContent: "center"}}
					>
						<div style={{width: "700px"}}>
							<div class="title">How to Use NFTour Collection Generator?</div>
							<br />
							<div class="text how-text">
								NFTour collection generator is a special software by which you
								can easily create thousands of unique NFT arts. The software
								application will generate a series of digital collectibles based
								on the specification given by the user. Here are the steps you
								need to follow in order to use it.
								<br />
								<br />
								<span>
									• Step 1: Select NFT Generator or NFT Collection Market
									Software
								</span>
								<br />
								The first thing you need to do is select option. You can choose
								NFT Generator to create your own NFT or you can use NFT
								collection market software.
								<br />
								<br />
								<span>• Step 2: Upload File</span>
								<br />
								If you chose NFT Generator option, you need to upload an
								original and unique base file. There is no need to create a
								complete base artwork. You can simply upload parts of the
								artwork. The software will use the parts to create unique art
								combinations.
								<br />
								<br />
								<span>• Step 3: Adjust Settings</span>
								<br />
								After uploading the file, you need to adjust the settings to
								customize the artwork. The rarity settings help you to adjust
								different attributes as well as characters of the NFT
								collection.
								<br />
								<br />
								<span>• Step 4: Title and Description</span>
								<br />
								You also need to add a title for the NFT collection along with a
								description. It will help to create metadata for the NFTs.
								<br />
								<br />
								<span>• Step 5: Create NFT</span>
								<br />
								Now, you will be able to see the preview of the NFT collection.
								<br />
								<br />
								<span>• Step 6: Connect your wallet</span>
								<br />
								NFTs should be stored in a secure location such as your software
								Everscale wallet. Your wallet will prompt you to “Sign” the
								transaction. When you sign your artwork, it will forever link
								the NFT to your unique Everscale address and wallet, which
								allows collectors to verify the work is yours—and ensure that
								you’re always listed as the original artist who receives royalty
								payments.
								<br />
								<br />
								<span>• Step 7: Approve gas</span>
								<br />
								A gas fee will need to be approved in your wallet to complete
								the minting. Gas fees are the cost of interacting with the
								Everscale blockchain.
								<br />
								<br />
								<span>• Step 8: Create NFT Collection</span>
								<br />
								(https://graphictutorials.net/undoing-changes-made-to-your-computer/)Once
								you are satisfied with the preview, you can approve it and
								software will generate the NFT collection. Now, you can mint it
								and start selling it online.
								<br />
								<br />
								<span>How to Use NFT Collection Market Software?</span>
								<br />
								<br />
								<span>• Step 1: Choose Collection</span>
								<br />
								You can choose NFT Collection from which you want mint NFT.
								<br />
								<span>• Step 2: Connect your Wallet</span>
								<br />
								<span>• Step 3: Buy&Open Pack</span>
								<br />
								When you chose NFT Collection, you can unpack and buy your
								unique NFT. Now you can purchase and trade it in the market.
							</div>
						</div>
					</div>
				</div>

				{redirect[0] ? <Redirect to="/load-nft" /> : ""}
				{redirect[1] ? <Redirect to="/collection-market" /> : ""}

				<Footer></Footer>
			</div>
		</Router>
	);
}

export default HowPage;
