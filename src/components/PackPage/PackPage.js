import React, {useState, useEffect} from "react";
import {HashRouter as Router, useHistory, useParams} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";

import * as nearAPI from "near-api-js";

import {NFTStorage} from "nft.storage";


import {contractNft, nearConfig, contractRootNft} from "../../config.json";
import {parseNearAmount} from "near-api-js/lib/utils/format";

// const {parseNearAmount} = require("near-api-js/lib/utils/format");

const {connect, keyStores, WalletConnection} = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();


Object.defineProperty(window, "indexedDB", {
  value:
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB,
});

function PackPage() {
  let classArr = JSON.parse(localStorage.getItem("class"));

  // let localClass = arr;
  // loading project from localStorage

  const params = useParams();
  let addrCol = params.address;

  const [collectionName, setCollectionName] = useState("No Name");

  if (
    localStorage.getItem("nft-collection-step") == null ||
    localStorage.getItem("nft-collection-step") == undefined ||
    isNaN(parseInt(localStorage.getItem("nft-collection-step"), 10))
  ) {
    localStorage.setItem("nft-collection-step", 1);
  }

  const [curentCollectionStep, setCurentCollectionStep] = useState(
    localStorage.getItem("nft-collection-step"),
  );

  const [amountMintNft, setAmountMintNft] = useState(1);

  const [collectionCount, setCollectionCount] = useState([0,0]);

  const [mintPrice, setMintPrice] = useState("0");

  const [owner, setOwner] = useState("123");

  // console.log(1);

  var openRequest = window.indexedDB.open("imgsStore", 10);
  // localClass = JSON.parse(localStorage.getItem("class"))
  // openRequest.onsuccess = async (event) => {
  // 	let db = event.target.result;

  // 	let store = db.transaction("imgs").objectStore("imgs");

  // 	for (let i = 0; i < classArr.length; i++) {
  // 		for (let j = 0; j < classArr[i].imgs.length; j++) {
  // 			store.get(classArr[i].imgs[j]).onsuccess = (event) => {
  // 				classArr[i].url[j] = URL.createObjectURL(event.target.result);
  // 			};
  // 		}
  // 	}
  // };

  useEffect(async () => {
    console.log("UseEffect minted");

    window.tempContract = await new nearAPI.Contract(
      window.walletConnection.account(),
      addrCol,
      {
        // View methods are read-only – they don't modify the state, but usually return some value
        viewMethods: [
          "nft_tokens",
          "nft_supply_for_owner",
          "nft_tokens_for_owner",
          "nft_token",
          "nft_metadata",
          "nft_mint_price",
          "nft_remaining_count",
        ],
        // Change methods can modify the state, but you don't receive the returned value when called
        // changeMethods: ["new"],
        // Sender is the account ID to initialize transactions.
        // getAccountId() will return empty string if user is still unauthorized
        sender: window.walletConnection.getAccountId(),
      },
    );

    tempContract.nft_remaining_count({}).then((data) => {
      console.log(data);
      setCollectionCount([data.total_mintable_tokens_count, data.token_matrix]);
      setOwner(data.creator);
    });

    tempContract
      .nft_metadata({})
      .then((data) => {
        console.log(data);
        setCollectionName(data.name);
      })
      .catch((err) => {
        console.log(err);
      });

    // tempContract.nft_tokens({
    // 	from_index: "0",
    // 	limit: 50
    // }).then((data)=>{
    // 	console.log(data);
    // });
    tempContract.nft_mint_price({}).then((data) => {
      console.log(data);
      let endPrice = (data + parseInt(parseNearAmount("0.1")))
        .toLocaleString("fullwide", {useGrouping: false})
        .toString();

      // console.log(endPrice);
      setMintPrice(endPrice);
    });

    tempContract
      .nft_tokens({
        from_index: "0",
        limit: 50,
      })
      .then((data) => {
        console.log(data);
        // setOwner(data[0].owner_id);
        let tempCollectionMinted = [];

        for (let i = 0; i < data.length; i++) {
          tempCollectionMinted.push({
            img: "https://cloudflare-ipfs.com/ipfs/" + data[i].metadata.media,
            name: data[i].metadata.title,
            desc: data[i].metadata.description,
            token_id: data[i].token_id,

          });
        }

        setCollectionMinted(tempCollectionMinted);
      });
  }, [collectionMinted]);

  const [collectionMinted, setCollectionMinted] = useState([]);

  let realSizes = JSON.parse(localStorage.getItem("realSizes"));
  let nftAreaSize = JSON.parse(localStorage.getItem("nftAreaSize"));
  let sizeIndex = JSON.parse(localStorage.getItem("sizeIndex"));

  // let arr = JSON.parse(sessionStorage.getItem("collection"));
  let arrClass = JSON.parse(localStorage.getItem("class"));
  // let arrName = JSON.parse(sessionStorage.getItem("collectionName"));


  const [isFullDescription, setIsFullDescription] = useState(false);

  async function uploadToNFTStore() {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGEwMTJGQWNhM0E5ZWQ0ZEI5MGY2ZmMzZUZFQTc1ZjBBMzZBNmE5MWUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDY2ODgzNjI1OCwibmFtZSI6Ik1hcmtldCJ9.sWJK68Mh8EIHUYusyqoB19mkAsP_KcwnBd7jqq7BZuU";
    const nft = new NFTStorage({
      endpoint: "https://api.nft.storage",
      token,
    });

    const files = await filesToFileList(collection);

    //console.log("newnew file", files);

    const directoryHashCID = await nft.storeDirectory(files);
    console.log("NFTStorage CID Directory Hash", directoryHashCID);
    // return await directoryHashCID;
    return new Promise((resolve, reject) => {
      resolve(directoryHashCID);
    });
  }

  async function filesToFileList(dataURLarray) {
    var fileList = new DataTransfer();
    await Promise.all([
      ...dataURLarray.map((e, i) =>
        dataURLtoFile(e, i + 1).then((file) => {
          fileList.items.add(file);
        }),
      ),
    ]);
    return await fileList.files;
  }

  async function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const fileExtension = mime.split("/");

    //console.log("mime", fileExtension);
    return await fetch(dataurl)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        return new File([blob], filename + "." + fileExtension[1], {
          type: mime,
        });
      });
  }

  function getResize(img, width, height) {
    return new Promise((resolve, reject) => {
      var image = new Image();
      image.src = img;
      // image.src = getSrc(img);
      // console.log(getSrc(img));

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");
      // ctx.drawImage(image, 0, 0, width, height);

      // console.log(canvas);

      image.setAttribute("crossorigin", "anonymous");

      resolve(img);

      image.onload = function () {
        ctx.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/png"));
      };

      //console.log(canvas.toDataURL("image/png"));

      // var dataURL = canvas.toDataURL("image/png");
      // console.log(dataURL);
      // return dataURL;
    });
  }

  let history = useHistory();
  const dispatch = useDispatch();
  const connectWallet = useSelector((state) => state.connectWallet);

  // useEffect(()=>{
  // 	let uniq = JSON.parse(sessionStorage.getItem("uniqFor"));
  // 	console.log(uniq);
  // },[]);

  const downloadFile = ({data, fileName, fileType}) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], {type: fileType});
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };


  let arr = JSON.parse(localStorage.getItem("collection"));
  let arrName = JSON.parse(localStorage.getItem("collectionName"));

  let details = JSON.parse(localStorage.getItem("details"));
  if (details == {} || details == undefined || details == null) {
    details = {
      projName: "No Name",
      projectName: "No Name",
      projectDescription: "No Description",
    };
  }
  if (details.projName == undefined) {
    details.projName = "No Name";
  }
  if (details.projectName == undefined) {
    details.projectName = "No Name";
  }
  if (details.projectDescription == undefined) {
    details.projectDescription = "No Description";
  }
  let price;

  try {
    price = JSON.parse(localStorage.getItem("colPrice"));
  } catch {
    price = "0";
  }

  const [collection, setCollection] = useState([]);
  // const [collectionName, setCollectionName] = useState(arrName);

  const [errorModal, setErrorModal] = useState({
    hidden: false,
    message: "",
  });

  const [activeButtons, setActiveButtons] = useState([false, false, false]);

  const [nearInit, setNearInit] = useState(false);

  // const [addrCol, setAddrCol] = useState();

  const [avatar, setAvatar] = useState();

  const [loaderMult, setLoaderMult] = useState(false);

  // let marketrootAddr = config.marketroot;

  async function connectNear() {
    // Initializing connection to the NEAR DevNet.
    window.near = await nearAPI.connect({
      deps: {
        keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
      },
      ...nearConfig,
    });

    // Needed to access wallet login
    window.walletConnection = new nearAPI.WalletConnection(window.near);

    // Getting the Account ID. If unauthorized yet, it's just empty string.
    window.accountId = window.walletConnection.getAccountId();

    window.contractRoot = await new nearAPI.Contract(
      window.walletConnection.account(),
      contractRootNft,
      {
        // viewMethods: ['get_num'],
        changeMethods: ["deploy_contract_code"],
        sender: window.walletConnection.getAccountId(),
      },
    );
  }

  if (!nearInit) {
    window.nearInitPromise = connectNear().then(() => {
      setNearInit(true);
    });
  }

  async function mint_nft(amount) {
    // let addr = sessionStorage.getItem("addrCol");

    let addr = addrCol;

    const acc = await near.account(addr);

    let keys = keyStore.localStorage.undefined_wallet_auth_key;
    // console.log(keys);

    if (keys == undefined) {
      return;
    }

    let pubKey = JSON.parse(keys).allKeys[0];

    console.log(pubKey, "pubkey");

    let status = await near.connection.provider.status();

    const accessKey = await near.connection.provider.query(
      `access_key/${window.walletConnection.getAccountId()}/${pubKey.toString()}`,
      "",
    );

    const nonce = ++accessKey.nonce;

    const recentBlockHash = nearAPI.utils.serialize.base_decode(
      accessKey.block_hash,
    );

    let deployData = JSON.parse(localStorage.getItem("details"));

    let actionsTrans = [];

    for (let i = 0; i < amount; i++) {
      let length = 7;
      let result = "";
      let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      let charactersLength = characters.length;

      let tempGas = "300000000000000" / amount;

      // if(i==amount) {
      // 	tempGas = "300000000000000";
      // }

      for (let j = 0; j < length; j++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }

      actionsTrans.push(
        nearAPI.transactions.functionCall(
          "nft_mint",
          {
            token_id: "token-" + result,
            receiver_id: walletConnection.getAccountId(),
          },
          tempGas,
          mintPrice,
        ),
      );
    }

    const transaction = nearAPI.transactions.createTransaction(
      walletConnection.getAccountId(),
      nearAPI.utils.key_pair.PublicKey.fromString(pubKey),
      addr,
      nonce,
      actionsTrans,
      recentBlockHash,
    );

    try {
      const result = await walletConnection.requestSignTransactions([
        transaction,
      ]);
    } catch {
      setErrorModal({
        hidden: true,
        message: "Connect Wallet",
        img: "",
      });
    }
  }

  function closeError() {
    setErrorModal({
      hidden: false,
      message: "",
    });
  }



  return (
    <>

      <div
        className={"App App2"}
      >
        {/*<Header activeCat={1}></Header>*/}

        <div className="construtors constructors-col">
          <div className="container-header">

            <div className="modal-constructor modal-constructor-back">
              <button
                onClick={() => {
                  history.goBack();
                }}
              ></button>
            </div>
            <div className="modal-constructor modal-constructor-param">
              <div className="title">{collectionName}</div>
              <div className="desc">
                NFT art creator’s main goal is to invent, and using NFTour
                artists
              </div>

              <div style={{margin: "0px 0px 40px 0px"}} className="owner">
                <div className="avatar">H</div>
                <div className="text">
                  <span>Author</span>
                  {owner}
                  {/* {nft} */}
                </div>
              </div>

              {/* <div className="desc">
								<div className="title">Description</div>
								Description
								<div className="hide">Show full description </div>
							</div> */}

              <div style={{margin: "0px 0px 40px 0px"}} className="price">
                <div className="subtitle">Mint Price</div>
                <div className="near">
                  <span></span>{" "}
                  <div className="price">
                    {(mintPrice / 1000000000000000000000000).toFixed(1)} NEAR
                  </div>
                </div>
              </div>

              <div style={{margin: "0px 0px 40px 0px"}} className="progress">
                <div className="title">Minted</div>
                <div className="bar">
                  <span style={{"width": (collectionCount[0]-collectionCount[1])/(collectionCount[0]/100)+"%"}}></span>
                </div>
                <span> {collectionCount[0]-collectionCount[1]}/{collectionCount[0]}</span>
              </div>

              <div className="mint">
                <input
                  type="number"
                  onChange={(ev) => {
                    setAmountMintNft(ev.target.value);
                  }}
                  value={amountMintNft}
                  min="1"
                />
                <button
                  className="min"
                  onClick={() => {
                    setAmountMintNft(1);
                  }}
                >
                  Min
                </button>
                <button
                  className="max"
                  onClick={() => {
                    setAmountMintNft(
                      JSON.parse(localStorage.getItem("uniqFor")).length,
                    );
                  }}
                >
                  Max
                </button>
              </div>

              <button
                className="button-3-square"
                onClick={() => {
                  mint_nft(amountMintNft);
                }}
              >
                Mint{" "}
                <span>
									(
                  {(
                    (amountMintNft * mintPrice) /
                    1000000000000000000000000
                  ).toFixed(1)}{" "}
                  NEAR)
								</span>{" "}
              </button>
              <div style={{textAlign: "center"}} className="desc">
                Estimated fee ~ 0.1 NEAR
              </div>

            </div>
            <div className="modal-constructor modal-constructor-collection">
              <div className="collection">

                {collectionMinted.map((item, index) => {
                  return (
                    <div
                      key={"uniqueId" + index}
                      className="element"
                    >
                      <div className="img">
                        <img src={item.img} />
                      </div>
                      <div className="nameCol">{item.desc}</div>
                      <div className="name">{item.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/*<Footer></Footer>*/}
      </div>
    </>
  );
}

export default PackPage;