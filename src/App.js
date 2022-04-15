import React, {useEffect, useState} from "react";
import {
	HashRouter as Router,
	Switch,
	Route,
	Redirect,
	useLocation,
	useHistory,
} from "react-router-dom";

import Context from "./sdk/Context";

import ConnectWalletPage from "./sdk/ConnectWalletPage";
import WelcomeNftPage from "./sdk/WelcomeNftPage";
import LoadNftPage from "./sdk/LoadNftPage";
import LoginPage from "./sdk/LoginPage";
import AppPage from "./sdk/AppPage";
import NftCustomization from "./sdk/NftCustomization";
import NftGenerate from "./sdk/NftGenerate";
import NftCollection from "./sdk/NftCollection";
import GettingStarted from "./sdk/GetttingStartedPage";
import CollectioMarket from "./sdk/CollectionMarket";
import OpenPack from "./sdk/OpenPack";
import Header from "./sdk/Header";
import HowPage from "./sdk/HowPage";
import ProfilePage from "./sdk/ProfilePage";
import LoadNftPageSingle from "./sdk/LoadNftPageSingle";
import NftCustomizationSingle from "./sdk/NftCustomizationSingle";
import NftGenerateSingle from "./sdk/NftGenerateSingle";
import NftSingle from "./sdk/NftSingle";
import CollectionMarketPack from "./sdk/CollectionMarketPack";
import NftDetails from "./sdk/NftDetails";
import NftMarket from "./sdk/NftMarket";
import NftMarketPack from "./sdk/NftMarketPack";
import NftMarketAuction from "./sdk/NftMarketAuction";
import NftMarketNft from "./sdk/NftMarketNft";

import {Buffer} from "buffer";
global.Buffer = Buffer;

function App() {
	return (
		<>
			<Router>
				<Context.Provider value={{status: status}}>
					<Switch>
						<Route exact path="/" component={WelcomeNftPage}></Route>
						{/* <Route exact path="/connect-wallet" component={ConnectWalletPage}></Route> */}
						{/* <Route exact path="/welcome-nft" component={WelcomeNftPage}></Route> */}
						<Route exact path="/get-start" component={GettingStarted}></Route>
						<Route exact path="/load-nft" component={LoadNftPage}></Route>
						<Route
							exact
							path="/nft-customization"
							component={NftCustomization}
						></Route>
						<Route exact path="/nft-generate" component={NftGenerate}></Route>
						<Route
							exact
							path="/nft-collection"
							component={NftCollection}
						></Route>
						<Route
							exact
							path="/load-nft-single"
							component={LoadNftPageSingle}
						></Route>
						<Route
							exact
							path="/nft-customization-single"
							component={NftCustomizationSingle}
						></Route>
						<Route
							exact
							path="/nft-generate-single"
							component={NftGenerateSingle}
						></Route>
						<Route exact path="/nft-single" component={NftSingle}></Route>
						<Route
							exact
							path="/collection-market"
							component={CollectioMarket}
						></Route>
						<Route
							exact
							path="/collection-market-pack/:address"
							component={CollectionMarketPack}
						></Route>
						<Route exact path="/nft-market" component={NftMarket}></Route>
						<Route
							exact
							path="/nft-market-pack/:address"
							component={NftMarketPack}
						></Route>
						<Route
							exact
							path="/nft-market-auction"
							component={NftMarketAuction}
						></Route>
						<Route
							exact
							path="/nft-market-nft/:address"
							component={NftMarketNft}
						></Route>
						<Route exact path="/nft-details" component={NftDetails}></Route>
						<Route exact path="/how" component={HowPage}></Route>
						{/* <Route exact path="/open-pack" component={OpenPack}></Route> */}
						{/* <Route exact path="/login" component={LoginPage}></Route> */}
						{/* <Route exact path="/app" component={AppPage}></Route> */}
						<Route
							exact
							path="/profile/:address"
							component={ProfilePage}
						></Route>
					</Switch>
				</Context.Provider>
			</Router>
		</>
	);
}

export default App;
