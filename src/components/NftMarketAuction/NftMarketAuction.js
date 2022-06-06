import React, {useState} from "react";
import {HashRouter as Router} from "react-router-dom";


import { useSelector} from "react-redux";

function NftMarketAuction() {
  // const dispatch = useDispatch();
  const connectWallet = useSelector((state) => state.connectWallet);
  // const params = useParams();
  // console.log(params);
  // let addrCol = params.address;
  // let arr = JSON.parse(localStorage.getItem("collection"));

  // const [collection, setCollection] = useState(arr);

  const [collection, setCol] = useState({
    addrAuth: "null",
    addrOwner: "null",
    desc: "null",
    name: "null",
  });

  const [errorModal, setErrorModal] = useState({
    hidden: false,
    message: "",
  });

  const zeroAddress =
    "0:0000000000000000000000000000000000000000000000000000000000000000";

  async function getCollection() {

    let tempCol;

    setCol(tempCol);
  }



  return (
    <>

      <div
        className={"App App2"}
      >
        {/*<Header activeCat={2}></Header>*/}

        <div className="container auction-sale">
          <div className="img">
            <div className="img"></div>
            <div className="text">
              <div className="title">Contract Address</div>
              0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec
            </div>
            <div className="text">
              <div className="title">Token ID</div>
              100300666241
            </div>
          </div>
          <div className="content">
            <div className="title-col">Untitled Coolection #1239239</div>
            <div className="title-nft">Roboto #20542040</div>
            <div className="desc">
              <div className="title">Description</div>
              Tattooed Kitty Gang (“TKG”) is a collection of 666 badass kitty
              gangsters, with symbol of tattoos, living in the Proud Kitty Gang
              (“PKG”) metaverse. Each TKG is an 1/1 ID as gangster member & all
              the joint rights.
            </div>
            <div className="price">
              <div className="title">Current Bid</div>
              <div className="price">269.8 BUSD</div>
              <div className="buttons">
                <div className="button">Place a Bid</div>
                <div className="button">Buyout price</div>
              </div>
            </div>
            <div className="time">
              <div className="title">Auction ends in</div>
              <div className="timer">
                <div className="timer-item">
                  <div className="num">02</div>
                  <div className="text">Days</div>
                </div>
                <div className="timer-item">
                  <div className="num">02</div>
                  <div className="text">Hours</div>
                </div>
                <div className="timer-item">
                  <div className="num">02</div>
                  <div className="text">Minutes</div>
                </div>
                <div className="timer-item">
                  <div className="num">02</div>
                  <div className="text">Seconds</div>
                </div>
              </div>
            </div>

            <div className="history">
              <div className="menu-history">
                <div className="menu-item">Bid History</div>
                <div className="menu-item">Provenance</div>
              </div>
              <div className="content">
                <div className="item">
                  <div className="name">
                    HAL <span>Placed a bid</span>
                  </div>
                  <div className="price">242 BUSD</div>
                  <div className="date">3 hours ago</div>
                  <div className="price-rub">≈ ₽ 16,982.40</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*<Footer></Footer>*/}
      </div>
    </>
  );
}

export default NftMarketAuction;