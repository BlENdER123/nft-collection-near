import React, {useState} from "react";
import "bootstrap";
import logo from "../../images/img/radiance logo.png";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";
import {useLocation} from "react-router";
const { connect } = nearAPI;

const linkIsActive = (loc) => {
  if (location.pathname === loc) {
    return "active"
  }else{
    return ""
  }
};
import {connectWalletAction} from "../../store/actions/app";

function Header() {
  // let history = useHistory();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();
  const [mobMenu, setMobMenu] = useState(false);

  const dispatch = useDispatch();
  // const tips = useSelector((state) => state.marketReducer.tips);
  const walletAddress = useSelector((state) => state.appReducer.account.accountId);

  // const connectWallet = useSelector((state) => state.connectWallet);

  // const [nearInit, setNearInit] = useState(false);
  // const [walletAddress, setWalletAddress] = useState();

  function logOut(e) {
    walletAccount.signOut();
    // localStorage.clear();
    localStorage.removeItem("undefined_wallet_auth_key");
    navigate("/");
  }

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
  //   // Needed to access wallet login
  //   window.walletAccount = new nearAPI.WalletAccount(window.near);
  //
  //   // Getting the Account ID. If unauthorized yet, it's just empty string.
  //   window.accountId = window.walletAccount.getAccountId();
  // }
  //
  // function connectWal() {
  //   // walletAccount.requestSignIn("", "Title");
  //
  //     walletAccount.requestSignIn(
  //       "", // contract requesting access
  //       "NFT Marketplace", // optional
  //       "http://localhost:3006/", // optional
  //       "http://localhost:3006/how" // optional
  //     ).then(res=> console.log("res from sign in", res))
  //
  // }
  //
  // if (!nearInit) {
  //   window.nearInitPromise = connectNear().then(() => {
  //     try {
  //       setWalletAddress(walletAccount.getAccountId());
  //     } catch {
  //       setWalletAddress(undefined);
  //     }
  //     console.log(walletAddress);
  //     setNearInit(true);
  //   });
  // }
  async function checker(){
    const { keyStores } = nearAPI;
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    let Config = {
      keyStore,
      networkId: "default",
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    }

    const near = await connect(Config);
    const account = await near.account("anzorb.testnet");
    let res = await account.getAccountBalance();
    console.log("res balance ", res)
  }
  function handleLogin(){
    console.log("handleLogin")
    dispatch(connectWalletAction())
    console.log("handleLogin2")
  }

  
  
  return (
    <div>
			<span
        style={{
          position: "fixed",
          bottom: "0px",
          left: "0px",
          color: "#fff",
          zIndex: "10",
        }}
      >
				V28.04/23:00
			</span>
      <div className="header header2">
        <div className="container-header">
          <div className="acc-info">
            <div className={mobMenu ? "hide" : "acc-info1"}>
              <Link to="/">
                <div className="name">NFT Art Generator</div>
              </Link>
              {localStorage.undefined_wallet_auth_key ? (
                <div className="wallet">
                  <div className="acc-status">Connected:</div>
                  <div className="acc-wallet">{walletAddress}</div>
                  <div
                    className={
                      openMenu ? "btn-menu btn-menu-active" : "btn-menu"
                    }
                    onClick={() => setOpenMenu(!openMenu)}
                  />

                  <div className={openMenu ? "menu-info" : "hide"}>
                    <Link
                      to={"/profile/" + walletAddress}
                      // onClick={(ev) => {
                      //   ev.preventDefault();
                      //   navigate("/profile/" + walletAddress);
                      // }}
                    >
                      Profile
                    </Link>
                    <div onClick={logOut}>Log out</div>
                  </div>

                  {/* <button onClick={new_init}>init Collection</button>
									<button onClick={mint_new}>mint Collection</button> */}
                </div>
              ) : (
                <div className="wallet">
                  <div className="button-1-square"
                       onClick={()=>handleLogin()}
                  >
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
              <Link to="/">
                <div
                  className={
                    `page-element ${linkIsActive("/")}`
                  }
                >
                  Home
                </div>
              </Link>
              <Link to="/load-nft">
                <div
                  className={
                    `page-element ${linkIsActive("/load-nft")}`
                  }
                >
                  Collection Editor
                </div>
              </Link>
              <Link to="/nft-market">
                <div
                  className={
                    `page-element ${linkIsActive("/nft-market")}`
                  }
                >
                  Marketplace
                </div>
              </Link>
              <Link to="/how">
                <div
                  className={
                    `page-element ${linkIsActive("/how")}`
                  }
                >
                  FAQ
                </div>
              </Link>
            </div>

            <div className={mobMenu ? "pages-m pages-m-active" : "pages-m"}>
              <Link to="/">
                <div
                  className={
                    `page-element ${linkIsActive("/")}`
                  }
                >
                  Home
                </div>
              </Link>
              <Link to="/load-nft">
                <div
                  className={
                    `page-element ${linkIsActive("/load-nft")}`
                  }
                >
                  NFT Collection Editor
                </div>
              </Link>
              <Link to="/nft-market">
                <div
                  className={
                    `page-element ${linkIsActive("/nft-market")}`
                  }
                >
                  Marketplace
                </div>
              </Link>
              <Link to="/how">
                <div
                  className={
                    `page-element ${linkIsActive("/how")}`
                  }
                >
                  FAQ
                </div>
              </Link>

              <span
                onClick={() => setMobMenu(!mobMenu)}
                className={mobMenu ? "menu-m menu-m-active" : "menu-m"}
              />
            </div>
          </div>
        </div>
      </div>

      {/*<div className={connectWallet ? "" : "hide"}>*/}
        {/*<ConnectWalletPage></ConnectWalletPage>*/}
      {/*</div>*/}
    </div>
  );
}

export default Header;
