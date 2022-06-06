import React, {useState} from "react";
import {connect} from "react-redux";
import {HashRouter as Router} from "react-router-dom";
//import {main_screen_bg} from "../sdk/img/screenbg1.png"
// import ConnectWalletPage from "./ConnectWalletPage";


function OpenPack() {
  const [connectWal, setConnect] = useState(false);

  return (
    <>
      <div className={connectWal ? "error-bg" : "hide"}></div>
      <div className={connectWal ? "App-error" : "App App2"}>
        {/*<Header activeCat={2}></Header>*/}

        <div className="pack">
          <div className="title">Robots Collection</div>
          <div className="info">
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
          <div className="text">
            By purchasing and opening a pack of a collection, you get one of the
            NFTs from the selected collection
          </div>
          <div className="button-1-square">Buy & Open Pack</div>
        </div>

        {/*<Footer></Footer>*/}
      </div>
    </>
  );
}

export default OpenPack;