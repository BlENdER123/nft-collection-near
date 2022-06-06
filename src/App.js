import React, {useEffect, useState} from "react";
import {Routes, Route, BrowserRouter as Router} from "react-router-dom";
import WelcomeNftPage from "./components/WelcomeNFT/WelcomeNftPage";
// import ConnectWalletPage from "./components/ConnectWallet/ConnectWallet";
import GettingStarted from "./components/GettingStarted/GetttingStartedPage";
import NftCustomization from "./components/NFTCustomization/NftCustomization";
import NftGenerate from "./components/NFTGenerate/NftGenerate";
import NftCollection from "./components/NFTCollection/NftCollection";
import LoadNftPageSingle from "./components/LoadNFTPageSingle/LoadNftPageSingle";
import NftCustomizationSingle from "./components/NftCustomizationSingle/NftCustomizationSingle";
import NftGenerateSingle from "./components/NftGenerateSingle/NftGenerateSingle";
import NftSingle from "./components/NftSingle/NftSingle";
import CollectionMarket from "./components/CollectionMarket/CollectionMarket";
import CollectionMarketPack from "./components/CollectionMarketPack/CollectionMarketPack";
import NftMarket from "./components/NftMarket/NftMarket";
import NftMarketPack from "./components/NftMarketPack/NftMarketPack";
import NftMarketAuction from "./components/NftMarketAuction/NftMarketAuction";
import HowPage from "./components/HowPage/HowPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import NftDetails from "./components/NftDetails/NftDetails";
import PackPage from "./components/PackPage/PackPage";
import NftMarketNft from "./components/NftMarketNft/NftMarketNft";
import Header from "./Pages/Header/Header";
import Footer from "./Pages/Footer/Footer";
import LoadNftPage from "./components/LoadNFT/LoadNftPage";




import * as nearAPI from "near-api-js";
import {Provider, useDispatch} from "react-redux";
import {getAccountDataAction, requestNFtsUrlsFetchAction} from "./store/actions/app";

function App() {
  const dispatch = useDispatch();
  // const appTheme = useAppSelector((state) => state.appTheme);
  //
  // useEffect(() => {
  //   dispatch(
  //     changeThemeAction(
  //       (localStorage.getItem("appTheme") as ThemeVariant) || "light",
  //     ),
  //   );
  // }, [dispatch]);

  const [collections, setCollections] = useState([]);
  const [loader, setLoader] = useState(true);
  const [sales, setSales] = useState([])

  useEffect(async () => {
    // dispatch(requestNFtsUrlsFetchAction());

    if(typeof(walletAccount) !== undefined){
      console.log("getAccountDataAction??")
      dispatch(getAccountDataAction())
    }
    
    setLoader(false)

  }, []);

  // async function connectNear() {
  //   window.nearConfig = {
  //     networkId: "default",
  //     nodeUrl: "https://rpc.testnet.near.org",
  //     walletUrl: "https://wallet.testnet.near.org",
  //   };
  //
  //   // Initializing connection to the NEAR DevNet.
  //   window.near = await nearAPI.connect(
  //     Object.assign(
  //       {deps: {keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()}},
  //       window.nearConfig,
  //     ),
  //   );
  //
  //   window.walletAccount = new nearAPI.WalletAccount(window.near);
  //
  //   // Getting the Account ID. If unauthorized yet, it's just empty string.
  //   window.accountId = window.walletAccount.getAccountId();
  //  
  //   return {
  //     allKeys: walletAccount._authData.allKeys,
  //     accountId: walletAccount._authData.accountId,
  //     _authDataKey:walletAccount._authDataKey,
  //     nfts:walletAccount.nfts,
  //     config:walletAccount.config,
  //     _networkId:walletAccount._networkId,
  //     _walletBaseUrl:walletAccount._walletBaseUrl
  //   }
  //  
  //
  // }

  
  useEffect(async()=>{
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

    window.walletAccount = new nearAPI.WalletAccount(window.near);
  },[])
  
  return (
    <>
      <div className={"hide"}>
        <span onClick={close}/>
      </div>
      <div className={"App App2"}>
        <Router>
      <Header/>

      <Routes>
        {/*<Switch>*/}

          <Route
            path="/profile/:address"
            element={<ProfilePage/>}
          />
          {/*<Route exact path="/connect-wallet" element={ConnectWalletPage}/> */}
           <Route exact path="/welcome-nft" element={<WelcomeNftPage/>}/> 
          <Route exact path="/get-start" element={<GettingStarted/>}/>
          <Route exact path="/load-nft" element={<LoadNftPage/>}/>
          <Route
            exact path="/nft-customization"
            element={<NftCustomization/>}
          />
          <Route exact path="/nft-generate" element={<NftGenerate/>}/>
          <Route
            exact path="/nft-collection"
            element={<NftCollection/>}
          />
          <Route
            exact path="/load-nft-single"
            element={<LoadNftPageSingle/>}
          />
          <Route
            exact path="/nft-customization-single"
            element={<NftCustomizationSingle/>}
          />
          <Route
            exact path="/nft-generate-single"
            element={<NftGenerateSingle/>}
          />
          <Route exact path="/nft-single" element={<NftSingle/>}/>
          <Route
            exact path="/collection-market"
            element={<CollectionMarket/>}
          />
          <Route
            exact path="/collection-market-pack/:address"
            element={<CollectionMarketPack/>}
          />
          <Route
            exact path="/nft-market"
            element={
              <NftMarket
                collections={collections}
                loader={loader}
                sales={sales}
              />
            }
          />
          
          <Route
            exact path="/nft-market-pack/:address"
            element={<NftMarketPack/>}
          />
          <Route
            exact path="/nft-market-auction"
            element={<NftMarketAuction/>}
          />
          <Route
            exact path="/nft-market-nft/:address"
            element={<NftMarketNft/>}
          />
          <Route exact path="/pack/:address" element={<PackPage/>}/>
          <Route
            exact path="/nft-details/:address"
            element={<NftDetails/>}
          />
          <Route exact path="/how" element={<HowPage/>}/>
        <Route exact path="/" element={<WelcomeNftPage/>}/>
          {/* <Route exact path="/open-pack" element={OpenPack}></Route> */}
          {/* <Route exact path="/login" element={LoginPage}></Route> */}
          {/* <Route exact path="/app" element={AppPage}></Route> */}
          

        {/*</Switch>*/}
      </Routes>
  
      <Footer/>
        </Router>
      </div>
    </>
  );
}

export default App;
