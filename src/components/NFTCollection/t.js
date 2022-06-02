import React, {useState, useEffect} from "react";
import {HashRouter as Router, useHistory} from "react-router-dom";

import mergeImages from "merge-images";

import Header from "./Header";
import Footer from "./Footer";

import {useDispatch, useSelector} from "react-redux";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";

import {NFTStorage} from "nft.storage";

const {
  contractNft,
  nearConfig,
  singleNFt,
  contractRootNftGenral,
  contractRootNft,
  marketNft,
} = require("./config.json");
const {parseNearAmount} = require("near-api-js/lib/utils/format");

const {connect, keyStores, WalletConnection} = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

Object.defineProperty(window, "indexedDB", {
  value:
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB,
});

function NftsList(props) {

  return (
    <>
      <div className={props.curentCollectionStep == props.step ? "progress": "hide"}>
        <div className="title">{props.title}</div>
        <div className="bar">
          <span style={{"width": (props.progressBar[1])/(props.progressBar[0]/100) + "%"}}/>
        </div>
        <span>
				{props.progressBar[0]}/
          {props.progressBar[1]}
			</span>
      </div>
      <div
        className={props.curentCollectionStep == props.step ? "collection" : "hide"}
      >
        {props.collection.map((item, index) => {
          return (
            <div
              key={"uniqueId" + index}
              className="element"
            >
              <div className="img">
                {item.img?
                  <img src={item.img} />:
                  <img src={item} />
                }

              </div>
              <div className="nameCol">{props.projectName}</div>
              <div className="name">
                {props.projectName}&nbsp; #{index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </>
  )


}

function NftCollection() {
  let classArr = JSON.parse(localStorage.getItem("class"));

  const [nearPrice, setNearPrice] = useState(0);

  // loading project from localStorage

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

  const [depositSale, setDepositSale] = useState({
    deposit: 0,
    sale: 0,
    avail: false,
  });

  const [collectionCount, setCollectionCount] = useState([0,0]);

  var openRequest = window.indexedDB.open("imgsStore", 10);
  // localClass = JSON.parse(localStorage.getItem("class"))
  openRequest.onsuccess = async (event) => {
    let db = event.target.result;

    let store = db.transaction("imgs").objectStore("imgs");

    for (let i = 0; i < classArr.length; i++) {
      for (let j = 0; j < classArr[i].imgs.length; j++) {
        store.get(classArr[i].imgs[j]).onsuccess = (event) => {
          classArr[i].url[j] = URL.createObjectURL(event.target.result.value);
        };
      }
    }
  };

  let realSizes = JSON.parse(localStorage.getItem("realSizes"));
  let nftAreaSize = JSON.parse(localStorage.getItem("nftAreaSize"));
  let sizeIndex = JSON.parse(localStorage.getItem("sizeIndex"));

  // let arr = JSON.parse(sessionStorage.getItem("collection"));
  let arrClass = JSON.parse(localStorage.getItem("class"));
  // let arrName = JSON.parse(sessionStorage.getItem("collectionName"));

  const [owner, setOwner] = useState("");

  const [isFullDescription, setIsFullDescription] = useState(false);

  const tokenStorage = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGEwMTJGQWNhM0E5ZWQ0ZEI5MGY2ZmMzZUZFQTc1ZjBBMzZBNmE5MWUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTc1MTkzMTY2NiwibmFtZSI6Ik1hcmtldHBsYWNlMyJ9.O-UUNi9Q7D-qmqR-fWDFkYekFvpvCtyCl_7eGYqdtf8";
  const nftStorage = new NFTStorage({
    endpoint: "https://api.nft.storage",
    token: tokenStorage,
  });

  async function uploadToNFTStoreSingle(item) {

    const file = await dataURLtoFile(item);

    console.log(file);

    const cid = await nftStorage.store(
      {
        name: '1',
        description: '1',
        image: file,
      });
    console.log("NFTStorage CID Directory Hash", cid);

    return new Promise((resolve, reject) => {
      resolve(cid);
    });
  }

  async function uploadToNFTStore() {


    const files = await filesToFileList(collection);

    const directoryHashCID = await nftStorage.storeDirectory(files);
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

  async function getResizeMany() {
    let tempArr = [];
    for (let i = 0; i < classArr.length; i++) {
      let tempArrImg = [];
      for (let j = 0; j < classArr[i].imgs.length; j++) {
        // let res = await getResize(
        // 	classArr[i].imgs[j],
        // 	classArr[i].width,
        // 	classArr[i].height,
        // );
        let res = await getResize(
          // classArr[i].imgs[j],
          classArr[i].url[j],
          realSizes[i].width[j] * sizeIndex,
          realSizes[i].height[j] * sizeIndex,
        );
        tempArrImg.push(res);
      }
      tempArr.push(tempArrImg);
    }

    console.log(tempArr);

    return tempArr;
  }

  function getResize(img, width, height) {
    return new Promise((resolve, reject) => {
      console.log(img);
      var image = new Image();
      image.src = img;
      // image.src = getSrc(img);

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");
      // ctx.drawImage(image, 0, 0, width, height);

      image.setAttribute("crossorigin", "anonymous");

      // ?resolve(img);

      image.onload = function () {
        ctx.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/png"));
      };

      // var dataURL = canvas.toDataURL("image/png");
      // return dataURL;
    });
  }

  let history = useHistory();
  const dispatch = useDispatch();
  const connectWallet = useSelector((state) => state.connectWallet);

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

  const exportToJson = (e) => {
    if (details.projectName === undefined) {
      setErrorModal({
        hidden: true,
        message: "Project name is empty!",
      });
      return;
    } else {

      let idBlobObj = {}

      let tempArr = []

      const openRequest = window.indexedDB.open("imgsStore", 10);

      openRequest.onsuccess = async (event) => {

        const store = event.target.result.transaction("imgs").objectStore("imgs");
        store.getAll().onsuccess = (event) => {
          console.log(event.target.result);
          const store_data = event.target.result;

          for (let i = 0; i < store_data.length; i++) {
            let tempFile = store_data[i];

            console.log(tempFile);
            // tempFile.arrayBuffer().then((data)=>{
            // 	console.log(data);
            // })

            tempArr.push(tempFile);

            let reader = new FileReader();
            reader.readAsDataURL(tempFile);
            reader.onload = (e) => {
              console.log(e.currentTarget.result);
              let tempId = tempFile.id;
              idBlobObj[tempId] = e.currentTarget.result;
            }
          }
        }



      }



      setTimeout(()=>{
        console.log(idBlobObj);
        const data = {
          projectName: details.projectName,
          collectionName: details.collectionName,
          projectDescription: details.projectDescription,
          width: localStorage.getItem("width"),
          height: localStorage.getItem("height"),
          classArr: arrClass,
          indexedData: idBlobObj,
        };

        e.preventDefault();
        downloadFile({
          data: JSON.stringify(data),
          fileName: details.projectName + ".json",
          fileType: "text/json",
        });

      }, 1000);


    }
  };

  useEffect(async ()=>{

    await fetch("https://helper.testnet.near.org/fiat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Connection: "keep-alive",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then(async (price) => {
        console.log(price.near.usd);
        setNearPrice(price.near.usd);
      });

  })

  useEffect(async () => {
    console.log("UseEffect minted");

    if (
      localStorage.getItem("addrCol") !== undefined &&
      localStorage.getItem("addrCol") !== null &&
      localStorage.getItem("addrCol") !== ""
    ) {
      let addr = localStorage.getItem("addrCol");

      // if (addr == null || addr == undefined) {
      // 	return;
      // }


      window.tempContract = await new nearAPI.Contract(
        window.walletConnection.account(),
        addr,
        {
          viewMethods: [
            "nft_tokens",
            "nft_supply_for_owner",
            "nft_tokens_for_owner",
            "nft_token",
            "nft_remaining_count"
          ],
          // changeMethods: ["new"],
          sender: window.walletConnection.getAccountId(),
        },
      );

      tempContract.nft_remaining_count({}).then((data)=>{
        console.log(data);
        setCollectionCount([data.total_mintable_tokens_count, data.token_matrix]);
      })

      tempContract
        .nft_tokens_for_owner({
          account_id: window.walletConnection.getAccountId(),
        })
        .then((data) => {
          console.log(data);
          let tempCollectionMinted = [];

          for (let i = 0; i < data.length; i++) {
            tempCollectionMinted.push({
              img: "https://cloudflare-ipfs.com/ipfs/" + data[i].metadata.media,
              name: data[i].metadata.title,
              desc: data[i].metadata.description,
              token_id: data[i].token_id,
            });
          }

          console.log(tempCollectionMinted);

          setCollectionMinted(tempCollectionMinted);
        });
    } else {
      let addr = contractRootNftGenral;

      // if (addr == null || addr == undefined) {
      // 	return;
      // }


      window.tempContract = await new nearAPI.Contract(
        window.walletConnection.account(),
        addr,
        {
          viewMethods: [
            "nft_tokens",
            "nft_supply_for_owner",
            "nft_tokens_for_owner",
            "nft_token",
          ],
          // changeMethods: ["new"],
          sender: window.walletConnection.getAccountId(),
        },
      );

      // tempContract.nft_remaining_count({}).then((data)=>{
      // 	console.log(data);
      // 	setCollectionCount([data.total_mintable_tokens_count, data.token_matrix]);
      // })

      tempContract
        .nft_tokens_for_owner({
          account_id: window.walletConnection.getAccountId(),
          from_index: "0",
          limit: 100,
        })
        .then((data) => {
          console.log(data);
          let tempCollectionMinted = [];

          for (let i = 0; i < data.length; i++) {
            tempCollectionMinted.push({
              img: "https://cloudflare-ipfs.com/ipfs/" + data[i].metadata.media,
              name: data[i].metadata.title,
              desc: data[i].metadata.description,
              token_id: data[i].token_id,
            });
          }

          console.log(tempCollectionMinted);

          setCollectionCount([tempCollectionMinted.length, 0]);

          setCollectionMinted(tempCollectionMinted);
        });
    }

    isSaleAvailiable();
  }, [collectionMinted]);

  useEffect(()=>{
    console.log("UseEffect is sale Avil");
    isSaleAvailiable();
  }, []);

  useEffect(async () => {
    console.log("UseEffect on sale");

    if (
      localStorage.getItem("addrCol") !== undefined &&
      localStorage.getItem("addrCol") !== null &&
      localStorage.getItem("addrCol") !== ""
    ) {
      let addr = localStorage.getItem("addrCol");

      fetch(
        "https://helper.testnet.near.org/account/" + window.walletConnection.getAccountId() + "/likelyNFTs",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Connection: "keep-alive",
          },
        },
      ).then((data) => {
        return data.json();
      }).then(async (data) => {
        console.log(data);

        for(let i = 0; i < data.length; i++) {
          if(data[i] == addr) {
            console.log(i);

            window.tempContract = await new nearAPI.Contract(
              window.walletConnection.account(),
              addr,
              {
                viewMethods: [
                  "nft_tokens",
                  "nft_supply_for_owner",
                  "nft_tokens_for_owner",
                ],
                // changeMethods: ["new"],
                sender: window.walletConnection.getAccountId(),
              },
            );

            try {
              await tempContract
                .nft_tokens_for_owner({
                  account_id: window.walletConnection.getAccountId(),
                  from_index: "0",
                  limit: 100,
                })
                .then(async (data) => {
                  // console.log(data, data.length, "Сколько всего во владении");
                  setCollectionNotOnSale(data.length);
                });
            } catch {
              console.log("error");
            }

          }
        }
      });

      let tempCol = [];

      window.contractMarket = await new nearAPI.Contract(
        window.walletConnection.account(),
        marketNft,
        {
          viewMethods: ["get_sales_by_owner_id"],
          sender: window.walletConnection.getAccountId(),
        },
      );

      contractMarket
        .get_sales_by_owner_id({
          account_id: window.walletConnection.getAccountId(),
          from_index: "0",
          limit: 200,
        }).then(async (data) => {
        console.log(data);
        for(let i = 0; i < data.length; i++) {
          if(data[i].nft_contract_id == addr) {

            window.ContractCollection = await new nearAPI.Contract(
              window.walletConnection.account(),
              data[i].nft_contract_id,
              {
                viewMethods: [
                  "nft_tokens",
                  "nft_supply_for_owner",
                  "nft_tokens_for_owner",
                  "nft_token",
                ],
                // changeMethods: ["new"],
                sender: window.walletConnection.getAccountId(),
              },
            );

            ContractCollection.nft_token({token_id: data[i].token_id}).then((data_token)=>{

              tempCol.push({
                img: "https://cloudflare-ipfs.com/ipfs/" + data_token.metadata.media,
                name: data_token.metadata.title,
                desc: data_token.metadata.description,
                token_id: data_token.token_id,
              });
            })
          }
        }

        console.log(tempCol);
      });

      setCollectionOnSale(tempCol);

    } else {

      let addr = contractRootNftGenral;

      fetch(
        "https://helper.testnet.near.org/account/" + window.walletConnection.getAccountId() + "/likelyNFTs",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Connection: "keep-alive",
          },
        },
      ).then((data) => {
        return data.json();
      }).then(async (data) => {
        console.log(data);

        for(let i = 0; i < data.length; i++) {
          if(data[i] == addr) {
            console.log(i);

            window.tempContract = await new nearAPI.Contract(
              window.walletConnection.account(),
              addr,
              {
                viewMethods: [
                  "nft_tokens",
                  "nft_supply_for_owner",
                  "nft_tokens_for_owner",
                ],
                // changeMethods: ["new"],
                sender: window.walletConnection.getAccountId(),
              },
            );

            try {
              await tempContract
                .nft_tokens_for_owner({
                  account_id: window.walletConnection.getAccountId(),
                  from_index: "0",
                  limit: 100,
                })
                .then(async (data) => {
                  // console.log(data, data.length, "Сколько всего во владении");
                  setCollectionNotOnSale(data.length);
                });
            } catch {
              console.log("error");
            }

          }
        }
      });

      let tempCol = [];

      window.contractMarket = await new nearAPI.Contract(
        window.walletConnection.account(),
        marketNft,
        {
          viewMethods: ["get_sales_by_owner_id"],
          sender: window.walletConnection.getAccountId(),
        },
      );

      contractMarket
        .get_sales_by_owner_id({
          account_id: window.walletConnection.getAccountId(),
          from_index: "0",
          limit: 200,
        }).then(async (data) => {
        console.log(data);
        for(let i = 0; i < data.length; i++) {
          if(data[i].nft_contract_id == addr) {

            window.ContractCollection = await new nearAPI.Contract(
              window.walletConnection.account(),
              data[i].nft_contract_id,
              {
                viewMethods: [
                  "nft_tokens",
                  "nft_supply_for_owner",
                  "nft_tokens_for_owner",
                  "nft_token",
                ],
                // changeMethods: ["new"],
                sender: window.walletConnection.getAccountId(),
              },
            );

            ContractCollection.nft_token({token_id: data[i].token_id}).then((data_token)=>{

              tempCol.push({
                img: "https://cloudflare-ipfs.com/ipfs/" + data_token.metadata.media,
                name: data_token.metadata.title,
                desc: data_token.metadata.description,
                token_id: data_token.token_id,
              });
            })
          }
        }

      });

      setCollectionOnSale(tempCol);

    }

  }, [collectionOnSale]);

  async function isSaleAvailiable() {

    window.contractMarket = await new nearAPI.Contract(
      window.walletConnection.account(),
      marketNft,
      {
        viewMethods: ["get_sales_by_owner_id", "storage_balance_of"],
        sender: window.walletConnection.getAccountId(),
      },
    );

    contractMarket
      .get_sales_by_owner_id({
        account_id: window.walletConnection.getAccountId(),
        from_index: "0",
        limit: 100,
      })
      .then(async (sales) => {
        contractMarket
          .storage_balance_of({
            account_id: window.walletConnection.getAccountId(),
          })
          .then((data) => {
            if (sales.length+collectionNotOnSale <= data / 10000000000000000000000) {
              console.log(sales.length, sales.length+collectionNotOnSale, data / 10000000000000000000000);
              setDepositSale({
                deposit: data / 10000000000000000000000,
                sale: sales.length,
                avail: true,
              });
            } else {
              console.log(sales.length + collectionNotOnSale, data / 10000000000000000000000);
              setDepositSale({
                deposit: data / 10000000000000000000000,
                sale: sales.length,
                avail: false,
              });
            }
          });
      })
      .catch((err) => {
        console.log("err");
      });
  }

  useEffect(async () => {
    console.log("useEff1");
    const {providers} = require("near-api-js");

    const provider = new providers.JsonRpcProvider(
      "https://archival-rpc.testnet.near.org",
    );

    let uniqFor = JSON.parse(localStorage.getItem("uniqFor"));


    try {
      setOwner(window.walletConnection.getAccountId());
    } catch {
      setOwner("Null");
    }


    let hashTrans = document.location.search.split("transactionHashes=")[1];

    try {
      hashTrans = hashTrans.split("&errorCode=")[0];
    } catch {

    }
    if (hashTrans != undefined) {
      console.log(hashTrans, "HASHTRANS");
      async function hashLog() {
        const result = await provider.txStatus(
          hashTrans,
          window.walletConnection.getAccountId(),
        );

        if (result.status.Failure == undefined) {
          let event;
          let token_id;
          try {
            event = JSON.parse(
              result.receipts_outcome[0].outcome.logs[0].split(
                "EVENT_JSON:",
              )[1],
            ).event;
            token_id = JSON.parse(
              result.receipts_outcome[0].outcome.logs[0].split(
                "EVENT_JSON:",
              )[1],
            ).token_ids[0];
          } catch {
            event = result.transaction.actions[0].FunctionCall.method_name;
          }


          if (event == "deploy_contract_code") {
            setActiveButtons([false, true, false]);
            // return;
          } else if (event == "new") {
            setActiveButtons([false, false, true]);
            setCurentCollectionStep(2);
            localStorage.setItem("nft-collection-step", 2);
          } else if (event == "nft_mint" && token_id + 1 != collection.length) {
            setActiveButtons([false, false, true]);
          } else if (event == "nft_mint") {
            setActiveButtons([false, false, false]);
          }
        } else {
          // if(event=="new") {
          // 	setActiveButtons([false,true,false]);
          // 	return;
          // }
          // return;
        }
      }
      hashLog();
    } else {
      console.log("No transaction");
      setActiveButtons([true, false, false]);
    }

    // let tempCollection = {img:[]};
    let tempCollection = [];

    setTimeout(() => {
      console.log("TimeOUT");
      const asyncFunction = async function () {
        return await getResizeMany();
      };
      asyncFunction().then(async (res) => {
        console.log(res);
        let tempArr = [];
        for (let i = 0; i < classArr.length; i++) {
          let temp = classArr[i];
          temp.src = res[i];
          tempArr.push(temp);
        }
        classArr = tempArr;

        for (let i = 0; i < uniqFor.length; i++) {
          let tempCur = uniqFor[i].split(",");
          let mergeArr = [];

          let indexArr = [];

          for (let i = 0; i < classArr.length; i++) {
            for (let j = 0; j < classArr[i].imgs.length; j++) {
              if (classArr[i].imgs[j] == classArr[i].imgs[tempCur[i]]) {
                mergeArr.push({
                  src: classArr[i].url[j],
                  x: classArr[i].x,
                  y: classArr[i].y,
                });
                indexArr.push(classArr[i].z_index);
              }
            }
          }

          for (let i = 0; i < indexArr.length; i++) {
            for (let j = 0; j < indexArr.length; j++) {
              if (indexArr[j] > indexArr[j + 1]) {
                let temp = indexArr[j];
                let temp1 = mergeArr[j];
                indexArr[j] = indexArr[j + 1];
                mergeArr[j] = mergeArr[j + 1];
                indexArr[j + 1] = temp;
                mergeArr[j + 1] = temp1;
              }
            }
          }

          await mergeImages(mergeArr, {
            width: localStorage.getItem("width"),
            height: localStorage.getItem("height"),
          }).then((b64) => tempCollection.push(b64));
        }

        console.log(tempCollection);

        setCollection(tempCollection);
      });
    }, 1000);
  }, []);

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
  const [collectionMinted, setCollectionMinted] = useState([]);
  const [collectionOnSale, setCollectionOnSale] = useState([]);
  const [collectionNotOnSale, setCollectionNotOnSale] = useState(0);
  const [collectionName, setCollectionName] = useState(arrName);
  const [salePrice, setSalePrice] = useState(0);
  const [errorInput, setErrorInput] = useState();

  const [errorModal, setErrorModal] = useState({
    hidden: false,
    message: "",
  });

  function changeError(input, value) {
    if (value == "" || value < 0 || value == undefined || value == null) {
      setErrorInput(input);
      setSalePrice(value);
    } else {
      if (input == "salePrice") {
        setErrorInput("");
        setSalePrice(value);
      }
    }
  }

  const [activeButtons, setActiveButtons] = useState([false, false, false]);

  const [nearInit, setNearInit] = useState(false);

  const [avatar, setAvatar] = useState();

  const [loaderMult, setLoaderMult] = useState(false);
  const [loaderMultGen, setLoaderMultGen] = useState(false);

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

  async function depositAll() {

    if (collectionMinted.length < 1) {
      return;
    }

    window.contractMarket = await new nearAPI.Contract(
      window.walletConnection.account(),
      marketNft,
      {
        viewMethods: ["storage_minimum_balance", "storage_balance_of"],
        changeMethods: ["storage_deposit"],
        sender: window.walletConnection.getAccountId(),
      },
    );

    contractMarket
      .storage_minimum_balance()
      .then(async (data) => {
        console.log(collectionMinted.length);

        let deposit = data * collectionMinted.length;
        console.log(
          deposit.toLocaleString("fullwide", {useGrouping: false}).toString(),
        );

        contractMarket
          .storage_deposit(
            {},
            "30000000000000",
            deposit.toLocaleString("fullwide", {useGrouping: false}).toString(),
          )
          .catch((err) => {
            console.log(err);
            walletAccount.requestSignIn("", "Title");
          });
      })
      .catch(() => {
        walletAccount.requestSignIn("", "Title");
      });
  }

  async function saleAllNft() {

    if (
      salePrice <= 0 ||
      salePrice == "" ||
      salePrice == undefined ||
      salePrice == null
    ) {
      // alert("Set Sale Price");
      setErrorInput("salePrice");
      return;
    }

    let addr;

    if (
      localStorage.getItem("addrCol") == null ||
      localStorage.getItem("addrCol") == undefined ||
      localStorage.getItem("addrCol") == ""
    ) {
      addr = contractRootNftGenral;
    } else {
      addr = localStorage.getItem("addrCol");
    }

    if (collectionMinted.length < 1) {
      return;
    }

    let pubKey = JSON.parse(keyStore.localStorage.undefined_wallet_auth_key)
      .allKeys[0];

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

    // let tempGas = "300000000000000"/collectionMinted.length;

    // console.log(tempGas);
    // return;

    let notOnSale = [];


    window.tempContract = await new nearAPI.Contract(
      window.walletConnection.account(),
      addr,
      {
        viewMethods: [
          "nft_tokens",
          "nft_supply_for_owner",
          "nft_tokens_for_owner",
        ],
        // changeMethods: ["new"],
        sender: window.walletConnection.getAccountId(),
      },
    );

    try {
      await tempContract
        .nft_tokens_for_owner({
          account_id: window.walletConnection.getAccountId(),
          from_index: "0",
          limit: 100,
        })
        .then(async (data) => {
          console.log(data, data.length, "Сколько всего");

          for(let i = 0; i < data.length; i++) {
            let found = false;
            for(let j = 0; j < collectionOnSale.length; j++) {
              if(data[i].token_id == collectionOnSale[j].token_id) {
                found = true;
                break;
                // notOnSale.push(data[i].token_id);
              }
            }
            if (!found) {
              notOnSale.push(data[i].token_id);
            }
          }

          console.log(notOnSale);

          let amountSale;

          if(notOnSale.length > 10) {
            amountSale = 10;

          } else {
            amountSale = notOnSale.length;
          }


          for (let i = 0; i < amountSale; i++) {
            let tempGas = "300000000000000" / amountSale;
            actionsTrans.push(
              nearAPI.transactions.functionCall(
                "nft_approve",
                {
                  token_id: notOnSale[i],
                  account_id: marketNft,
                  msg: JSON.stringify({
                    sale_conditions: parseNearAmount(salePrice),
                  }),
                },
                tempGas,
                parseNearAmount("0.01"),
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

          console.log(actionsTrans);

          // return;

          if (actionsTrans.length == 0) {
            return;
          }

          try {
            const result = await walletConnection.requestSignTransactions([
              transaction,
            ]);
          } catch {
            walletAccount.requestSignIn("", "Title");
          }



        });
    } catch(err) {
      console.log(window.walletConnection.getAccountId(), addr);
      console.log(err);
    }

  }

  async function multTransGen() {

    setLoaderMultGen(true);

    console.log(collection);

    window.contractCollection = await new nearAPI.Contract(
      window.walletConnection.account(),
      contractRootNftGenral,
      {
        // View methods are read-only – tfey don't modify the state, but usually return some value
        viewMethods: ["nft_total_supply"],
        // Change methods can modify the state, but you don't receive the returned value when called
        changeMethods: ["new", "nft_mint"],
        // Sender is the account ID to initialize transactions.
        // getAccountId() will return empty string if user is still unauthorized
        sender: window.walletConnection.getAccountId(),
      },
    );

    let pubKey = JSON.parse(keyStore.localStorage.undefined_wallet_auth_key).allKeys[0];

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

    for (let i = 0; i < collection.length; i++) {
      let tempGas = "300000000000000" / collection.length;
      console.log(i);
      let tempHash = await uploadToNFTStoreSingle(collection[i]);

      // console.log((parseInt(data)+i+1).toString());
      let length = 30;
      let result = "";
      let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let charactersLength = characters.length;
      for (var k = 0; k < length; k++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      actionsTrans.push(
        nearAPI.transactions.functionCall(
          "nft_mint",
          {
            token_id: "token-"+result,
            metadata: {
              title: deployData.projName,
              description: deployData.projectDescription,
              media: tempHash.data.image.href.split("ipfs://")[1],
              creator: window.walletConnection.getAccountId(),
            },
            receiver_id: window.walletConnection.getAccountId(),
          },
          tempGas,
          "8890000000000000000000",
        ),
      );

    }

    const transaction = await nearAPI.transactions.createTransaction(
      walletConnection.getAccountId(),
      nearAPI.utils.key_pair.PublicKey.fromString(pubKey),
      contractRootNftGenral,
      nonce,
      actionsTrans,
      recentBlockHash,
    );

    console.log(actionsTrans);

    //TODO
    setTimeout(async ()=>{
      try {
        const result = await walletConnection.requestSignTransactions([
          transaction,
        ]);
      } catch {
        walletAccount.requestSignIn("", "Title");
      }
    },1000);

  }

  async function multTrans() {
    setActiveButtons([false, false, false]);

    setLoaderMult(true);

    let addr = localStorage.getItem("addrCol");

    let hash_folder = uploadToNFTStore();

    hash_folder.then(async (res) => {
      const acc = await near.account(addr);

      let pubKey = JSON.parse(keyStore.localStorage.undefined_wallet_auth_key)
        .allKeys[0];

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

      actionsTrans.push(
        nearAPI.transactions.functionCall(
          "new",
          {
            owner_id: window.walletConnection.getAccountId(),
            metadata: {
              spec: "nft-1.0.0",
              name: deployData.projName,
              symbol: "RTEAM",
              icon: "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8Ap6alAKekngB+g5QAQV64OxtL7tclVPPPJFLw0hlM+/IbTfn0Fkr9+h5P9+guVMdsaoXWABobMgAAAAAA////AIODfgCck3MAX3S+VApE//8YTf//Klbr1RZK//8SR///GEv8/yNS8/kdT/j7E0j7+k919G8ZFhcAAAAAAP///wAVEyMALTdqKh1W//8QR///KFXrxh1M9+8LQ///J1Tt1CZU8sgcT/zoJVTz2x9M6+AbUv/6Jzh8QDMyNQD///8AsqmfADVa4aYDQP//G0z6/yRV/esgUvXhTG3YXnCDvgBKY68tIk/t0wdC//8XS///EEf9/yld//ZXY4wF////AHqT0hopWPjhEUb//xdM/f8sTd2YVXe8DGmFwABtgskAWWqRAFxjfQBCXLd0HVL89hhM/f8LRv//PFi5Yf///wAiUueGIVDz/iFQ9O8OSP//R1y0NW57ngBsgcAAaoDGAEdhsQCCjrwAh5TBACtW6cQdTfXqDkb//zFc9Jr///8AH1H/pRxN9f8wWOe5Az7//4qXw0zPwJcAu7GZAIaSwAAlVvsALF7/ACZX/x0dTvf0L1jmwR9P+f4ZTPew////ACpV7IoQR///JFL03yNS8uJfdsMyi5OtAJqdqwBYZp0AQGLlAGeB3ABpg98KFUn+/x9P9fMqVez3Gkz4r////wBJZ+VQD0f//xdK/f8ZTPfvNVbHVl9wtgCJkbcAOEyOAGJywQCLjZcAc4fFNxNH/f8SR///HU/5/Etp0Vn///8AgI+2BC1d/+8ORP//E0j9/xdL//86X+Wkgo67IU9ZfwBidMYAMlbVfxxM8d4cTvj4FUn//xRI9/tyfJAA////AE1JLwA2TIFMFFD//yNS9u8eT/bxEkj//y9Y5rQ2VcNzJFP21BBH//8lUe3VHE/6/QQ///8uVNiVgIWfAP///wAwL24ATEZsAENk1HsfVP/1JlPv1iNR8NYbTfjrFEv//w5G//8mU+/VJ1Pr0AA9//8gTvTV0NPnA97f8wD///8AXV3CAGJetgBhYocALFDFlRFL//8MRf//EUb9/xpN/P8WS///JFH27hBH//8iUOS3Z3qzCP///wD///8A////AFRUqwBYWbAAWFl/AGVthABngdIzK1PikyVV+dYYS/nuLlbjpipR149NcuJXb4PDAGV5pADy7/8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//8AAOAPAADABwAAgAMAAIEBAAADwQAAB+EAAAfBAAAHwQAAB8EAAAGDAACAAwAAwAMAAOAHAADwHwAA//8AAA==",
              base_uri: null,
              reference: null,
              reference_hash: null,

            },
          },
          "30000000000000",
          "0",
        ),
      );

      actionsTrans.push(
        nearAPI.transactions.functionCall(
          "declare_collection_items",
          {
            total_mintable_tokens_count: JSON.parse(
              localStorage.getItem("uniqFor"),
            ).length,
            ipfs_path: res + "/",
            extension: "png",
            price: parseNearAmount(price.toString()),
            nft_titles: deployData.projName,
            nft_descriptions: deployData.projectDescription,
            creator: window.walletConnection.getAccountId(),
          },
          "30000000000000",
          "0",
        ),
      );

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
        walletAccount.requestSignIn("", "Title");
      }
    });

  }

  async function deployColectionNear() {
    let length = 20;
    let result = "";
    let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    localStorage.setItem("addrCol", result + "." + contractRootNft);

    localStorage.setItem("curentAction", "deploy");

    contractRoot
      .deploy_contract_code(
        {
          account_id: result + "." + contractRootNft,
        },
        "30000000000000",
        "7490000000000000000000000",
      )
      .catch((err) => {
        walletAccount.requestSignIn("", "Title");
      });

  }

  async function mint_nft(amount) {
    let addr = localStorage.getItem("addrCol");
    if (addr == null || addr == undefined) {
      return;
    }

    if (amountMintNft > collectionCount[1]) {
      return;
    }

    if (collectionCount[0] == 0 || collectionCount[1] == 0) {
      return;
    }

    window.tempContract = await new nearAPI.Contract(
      window.walletConnection.account(),
      addr,
      {
        viewMethods: ["nft_mint_price", "nft_remaining_count"],
        // changeMethods: ["new"],
        sender: window.walletConnection.getAccountId(),
      },
    );

    tempContract
      .nft_mint_price({})
      .then(async (mintPrice) => {
        console.log(mintPrice);
        const acc = await near.account(addr);

        let pubKey = JSON.parse(keyStore.localStorage.undefined_wallet_auth_key)
          .allKeys[0];

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

        let endPrice = mintPrice + parseInt(parseNearAmount("0.1")); // TODO Не расчитывается колчиество газа для совершение транзакции

        for (let i = 0; i < amount; i++) {
          let length = 7;
          let result = "";
          let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
          let charactersLength = characters.length;

          let tempGas = "300000000000000" / amount;

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
              endPrice
                .toLocaleString("fullwide", {useGrouping: false})
                .toString(),
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
        } catch (err) {
          walletAccount.requestSignIn("", "Title");
        }
      })
      .catch((err) => {
        console.log(err);
        walletAccount.requestSignIn("", "Title");
      });

    tempContract.nft_remaining_count({}).then((data) => {
      console.log(data);
    });
  }

  function closeError() {
    setErrorModal({
      hidden: false,
      message: "",
    });
  }

  function close() {
    dispatch({type: "closeConnect"});
  }

  return (
    <Router>
      <div
        className={"App App2"}
      >
        <Header activeCat={1}></Header>

        <div className="construtors constructors-col">
          <div className="container-header">

            <div className="modal-constructor modal-constructor-back">
              <button
                onClick={() => {
                  if (curentCollectionStep > 1) {
                    localStorage.setItem(
                      "nft-collection-step",
                      curentCollectionStep - 1,
                    );
                    setCurentCollectionStep(curentCollectionStep - 1);
                  } else {
                    history.push("/nft-generate");
                  }
                }}
              ></button>
            </div>
            <div className="modal-constructor modal-constructor-param">
              <div className="title-1">NFT Publisher</div>
              {curentCollectionStep == 1 ? (
                <>
                  <div className="title">Publish collection into blockchain</div>
                  <div className="desc">
                    This will publish your collection and make it available for NFT Minting.
                    Once done, your published collection will be available for you or other users to Mint.
                  </div>

                  <button
                    className={
                      activeButtons[0]
                        ? "button-1-square"
                        : "button-1-square button-1-square-disabled"
                    }
                    style={{margin: "0px 0px 10px 0px"}}
                    onClick={activeButtons[0] ? deployColectionNear : null}
                  >
                    I. Initialize Collection
                  </button>

                  <div style={{margin: "0px 0px 15px 0px"}} className="desc">
                    Smart-contract one-time fee ~8 NEAR ({8*nearPrice} USD)
                  </div>

                  <button
                    className={
                      activeButtons[1]
                        ? "button-1-square button-arrow"
                        : "button-1-square button-1-square-disabled"
                    }
                    onClick={activeButtons[1] ? multTrans : null}
                    style={{"marginBottom": "100px"}}
                  >
                    {loaderMult ? (
                      <div className="loader">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      <span>
												II. Publish Collection (
                        {JSON.parse(localStorage.getItem("uniqFor")).length})
											</span>
                    )}
                  </button>


                  <div className="title">Skip & Mint some NFT’s</div>
                  {/* <div className="desc">
									Smart-contract one-time fee ~8 NEAR (YYY USD) 
									</div> */}

                  <button
                    className={"button-1-square button-1-square-disabled button-arrow"}
                    onClick={()=>{
                      localStorage.setItem("addrCol", "");
                      localStorage.setItem("nft-collection-step", 2);
                      setCurentCollectionStep(2);
                    }}

                  >
										
											<span>
												Skip Publish Collection
											</span>

                  </button>

                </>
              ) : null}
              {curentCollectionStep == 2 ? (
                <>
                  <div className="title">Mint your NFTs</div>

                  {
                    localStorage.getItem("addrCol") == "" || localStorage.getItem("addrCol") == undefined ?
                      <>
                        <div className="desc">
                          Starting NFTs to mint for yourself
                        </div>

                        {/* <div className="mint">
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
															collectionCount[1],
														);
													}}
												>
													Max
												</button>
											</div> */}

                        <button
                          className={amountMintNft > collectionCount[1] || collectionCount[0] == 0 || collectionCount[1] == 0?"button-3-square button-1-square-disabled" : "button-3-square"}
                          onClick={() => {
                            // mint_nft(amountMintNft);
                            multTransGen();

                          }}
                        >
                          {loaderMultGen ? (
                            <div className="loader">
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          ):(
                            <>
                              Mint{" "}
                              <span style={{"margin": "0px 8px","display": "flex","alignItems": "center", "justifyContent": "center"}}>
															(
                                {(amountMintNft * 0.1 + amountMintNft * price).toFixed(1)}{" "}
                                <span className="near-sign" style={{"margin": "0px 8px", "width": "20px", "height": "20px"}}></span>

															NEAR)
														</span>{" "}
                            </>
                          )}

                        </button>


                        <div style={{textAlign: "center"}} className="desc">
                          Estimated fee ~ 0.1 NEAR for each
                        </div>
                      </> :


                      <>
                        <div className="desc">
                          Set the number of NFTs you want to Mint
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
                                collectionCount[1],
                              );
                            }}
                          >
                            Max
                          </button>
                        </div>

                        <button
                          className={amountMintNft > collectionCount[1] || collectionCount[0] == 0 || collectionCount[1] == 0?"button-3-square button-1-square-disabled" : "button-3-square"}
                          onClick={() => {
                            mint_nft(amountMintNft);
                          }}
                        >
                          Mint{" "}
                          <span style={{"margin": "0px 8px","display": "flex","alignItems": "center", "justifyContent": "center"}}>
													(
                            {(amountMintNft * 0.1 + amountMintNft * price).toFixed(1)}{" "}
                            <span className="near-sign" style={{"margin": "0px 8px", "width": "20px", "height": "20px"}}></span>

													NEAR)
												</span>{" "}
                        </button>
                        <div style={{textAlign: "center"}} className="desc">
                          Estimated fee ~ 0.1 NEAR for each
                        </div>
                      </>
                  }



                  <div
                    style={{opacity: "1", margin: "0px 0px 20px 0px"}}
                    className="desc"
                  >
                    If you choose not to Mint NFTs now, then you can always do it later from Marketplace &#8594; Collection page.
                  </div>

                  <button
                    className={"button-1-square button-arrow"}
                    onClick={() => {
                      isSaleAvailiable();
                      localStorage.setItem("nft-collection-step", 3);
                      setCurentCollectionStep(3);
                    }}
                    style={{margin: "0px 0px 10px 0px"}}
                  >
                    Next
                  </button>
                </>
              ) : null}
              {curentCollectionStep == 3 ? (
                <>
                  <div className="title">Sell NFTs on the Marketplace</div>
                  <div className="desc">
                    Put your new NFTs up for sale on the Marketplace
                  </div>

                  <div
                    className={collectionNotOnSale - collectionOnSale.length > 0 && depositSale.avail? "price-sale price" : "hide"}
                    style={{"margin-bottom":"20px"}}
                  >
                    <div className="title">Price</div>
                    <div className="price-input">
                      <input
                        value={salePrice}
                        onChange={(ev) => {
                          changeError("salePrice", ev.target.value);
                        }}
                        type="number"
                        className={errorInput == "salePrice" ? "inputErr" : "price"}
                      />
                      <span>NEAR</span>
                    </div>
                    <span className={errorInput == "salePrice" ? "errMsg" : "hide"}>
											Set Price
										</span>
                  </div>

                  <button
                    onClick={saleAllNft}
                    className={collectionNotOnSale - collectionOnSale.length > 0 && depositSale.avail ? "button-3-square" : "hide"}
                  >
                    Initiate Sale
                    {/* Sale {" "} <span>{" "} NFT’s</span>{" "} */}
                  </button>
                  <div
                    style={{textAlign: "center"}}
                    className={collectionNotOnSale - collectionOnSale.length > 0 && depositSale.avail ? "desc" : "hide"}
                  >
                    Estimated fee ~ 0.1 NEAR
                  </div>

                  <button
                    onClick={depositAll}
                    className={depositSale.avail ? "hide" : "button-1-square"}
                  >
                    Deposit Funds <span></span>{" "}
                  </button>
                  <div
                    style={{textAlign: "center"}}
                    className={depositSale.avail ? "hide" : "desc"}
                  >
                    Not enough NEAR tokens
                  </div>

                  <div
                    style={{opacity: "1", margin: "0px 0px 10px 0px"}}
                    className="desc"
                  >
                    If you choose not to sell your NFTs now, don’t worry! All of your items are now available under Profile page.
                  </div>

                  <button
                    className={"button-4-square button-arrow"}
                    style={{margin: "0px 0px 10px 0px"}}
                    onClick={() => {
                      history.push("/profile/" + walletAccount.getAccountId());
                    }}
                  >
                    Go to Profile
                  </button>
                </>
              ) : null}
            </div>
            <div className="modal-constructor modal-constructor-collection">
              <div className="steps steps-univ">
                <div
                  className={
                    curentCollectionStep == 1
                      ? "step step-hov step1 active"
                      : "step step-hov step1"
                  }
                  onClick={() => {
                    localStorage.setItem("nft-collection-step", 1);
                    setCurentCollectionStep(1);
                  }}
                >
                  <div className="img"></div>
                  <div className="text">
                    <div className="name">Step 1</div>
                    <div className="desc">Publish collection</div>
                  </div>
                </div>
                <div className="line"></div>
                <div
                  className={
                    curentCollectionStep == 2
                      ? "step step-hov step2 active"
                      : "step step-hov step2"
                  }
                  onClick={() => {
                    localStorage.setItem("nft-collection-step", 2);
                    setCurentCollectionStep(2);
                  }}
                >
                  <div className="img"></div>
                  <div className="text">
                    <div className="name">Step 2</div>
                    <div className="desc">Mint your NFTs</div>
                  </div>
                </div>
                <div className="line"></div>
                <div
                  className={
                    curentCollectionStep == 3
                      ? "step step-hov step3 active"
                      : "step step-hov step3"
                  }
                  onClick={() => {
                    isSaleAvailiable();
                    localStorage.setItem("nft-collection-step", 3);
                    setCurentCollectionStep(3);
                  }}
                >
                  <div className="img"></div>
                  <div className="text">
                    <div className="name">Step 3</div>
                    <div className="desc">Sell NFTs on the Marketplace</div>
                  </div>
                </div>
              </div>

              <div className="collection-info">
                <div className="info-1">
                  <div className="title">Collection Name</div>
                  <div className="text">{details.projectName}</div>
                  <div className="title">Description</div>
                  <div className="text">{details.projectDescription}</div>
                </div>
                <div className="info-2">
                  <div className="owner">
                    <div className="avatar">H</div>
                    <div className="text">
                      <span>Owner</span>
                      {owner}
                    </div>
                  </div>
                  <div className="price">
                    <div className="subtitle">Mint Price</div>
                    <div className="near">
                      <span></span> <div className="price">{price} NEAR</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-4-square" onClick={exportToJson}>
                <span></span>Save project
              </div>

              <NftsList projectName={details.projName} collection={collection} title={"Collection generation process"} curentCollectionStep={curentCollectionStep} step={1} progressBar={[JSON.parse(localStorage.getItem("uniqFor")).length,JSON.parse(localStorage.getItem("uniqFor")).length]} />
              <NftsList projectName={details.projName} collection={collectionMinted} title={"Collection minted"} curentCollectionStep={curentCollectionStep} step={2} progressBar={[collectionCount[0]-collectionCount[1],collectionCount[0]]} />
              <NftsList projectName={details.projName} collection={collectionOnSale} title={"Collection on sale"} curentCollectionStep={curentCollectionStep} step={3} progressBar={[collectionOnSale.length,collectionNotOnSale]} />

            </div>
          </div>
        </div>

        <Footer></Footer>
      </div>
    </Router>
  );
}

export default NftCollection;