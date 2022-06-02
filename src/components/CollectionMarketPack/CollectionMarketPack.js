import React, {useState, useEffect} from "react";
import {HashRouter as Router, useParams} from "react-router-dom";

// import {DEXClientContract} from "./test net contracts/DEXClient.js";
// import {NftRootColectionContract} from "./collection contracts/NftRootColectionContract.js";

import {useDispatch, useSelector} from "react-redux";


// const pidCrypt = require("pidcrypt");
// require("pidcrypt/aes_cbc");
// const aes = new pidCrypt.AES.CBC();

// async function getClientKeys(phrase) {
// 	//todo change with only pubkey returns
// 	let test = await client.crypto.mnemonic_derive_sign_keys({
// 		phrase,
// 		path: "m/44'/396'/0'/0/0",
// 		dictionary: 1,
// 		word_count: 12,
// 	});
// 	console.log(test);
// 	return test;
// }



function CollectionMarketPack() {
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);
	const params = useParams();
	// let addrCol = params.address;

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

	// async function getCollection() {
	// 	console.log(addrCol);
  //
	// 	const acc = new Account(NftRootColectionContract, {
	// 		address: addrCol,
	// 		signer: signerNone(),
	// 		client,
	// 	});
  //
	// 	let tempCol;
  //
	// 	try {
	// 		const response = await acc.runLocal("getInfo", {});
	// 		let value0 = response;
	// 		let data = response.decoded.output;
	// 		tempCol = {
	// 			addrAuth: data.addrAuthor,
	// 			addrOwner: data.addrOwner,
	// 			desc: data.description,
	// 			name: data.name,
	// 		};
	// 		console.log("value0", value0);
	// 	} catch (e) {
	// 		console.log("catch E", e);
	// 	}
  //
	// 	setCol(tempCol);
	// }

	// useEffect(async () => {
	// 	await getCollection();
	// }, []);

	function closeError() {
		console.log(1);
		setErrorModal({
			hidden: false,
			message: "",
		});
	}

	// async function openPack() {
	// 	let decrypted = aes.decryptText(sessionStorage.getItem("seedHash"), "5555");
  //
	// 	const clientAcc = new Account(DEXClientContract, {
	// 		address: sessionStorage.getItem("address"),
	// 		signer: signerKeys(await getClientKeys(decrypted)),
	// 		client,
	// 	});
  //
	// 	try {
	// 		const {body} = await client.abi.encode_message_body({
	// 			abi: {type: "Contract", value: NftRootColectionContract.abi},
	// 			signer: {type: "None"},
	// 			is_internal: true,
	// 			call_set: {
	// 				function_name: "mintNft",
	// 				input: {},
	// 			},
	// 		});
  //
	// 		const res = await clientAcc.run("sendTransaction", {
	// 			dest: addrCol,
	// 			value: 800000000,
	// 			bounce: true,
	// 			flags: 3,
	// 			payload: body,
	// 		});
	// 		console.log(res);
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	return (
		<>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "error-bg" : "hide"
				}
			>
				<span onClick={close}/>
			</div>
			<div
				className={
					errorModal.hidden === true || connectWallet ? "App-error" : "App App2"
				}
			>
				{/*<Header activeCat={2}/>*/}

				<div class="collection">
					<div
						className={errorModal.hidden === true ? "error-modal-img" : "hide"}
					>
						<button className="close" onClick={closeError}>
							<span/>
							<span/>
						</button>
						<img src={errorModal.message}/>
						{/* <div className="message">{errorModal.message}</div> */}
					</div>

					<div class="title">{collection.name}</div>
					<div className="text">
						<div>
							Description:<span>{collection.desc}</span>
						</div>
					</div>
					<div className="text">
						<div>
							Owner:<span>{collection.addrOwner}</span>
						</div>
					</div>
					<div className="text">
						<div>
							Author:<span>{collection.addrAuth}</span>
						</div>
					</div>
					<div class="text">
						By purchasing and opening a pack of a collection, you get one of the
						NFTs from the selected collection
					</div>

					<div class="button-1-square" 
               // onClick={openPack}
          >
						Buy & Open Pack
					</div>

					{/* <div class="nft-collection">
						{collection.map((item) => {
							return (
								<div class="nft-element" onClick={()=>setErrorModal({
									hidden: true,
									message: item
								})}>
									<img src={item} />
								</div>
							);
						})}
					</div> */}
				</div>

				{/*<Footer></Footer>*/}
			</div>
		</>
	);
}

export default CollectionMarketPack;
