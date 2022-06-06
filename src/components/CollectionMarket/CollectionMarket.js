import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router";


function CollectionMarket() {
	let navigate = useNavigate();

	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);

	const [mintNftData, setMintNftData] = useState({
		hidden: true,
	});

	const [redirect, setRedirect] = useState(false);

	const [loader, setLoader] = useState(true);

	let [collections, setCollections] = useState([]);

	async function getCollections() {
		let rootCode;

		// const acc = new Account(NFTMarketContract, {
		// 	address: marketrootAddr,
		// 	signer: signerNone(),
		// 	client,
		// });

		// try {
		// 	const response = await acc.runLocal("resolveCodeHashNftRoot", {});
		// 	let value0 = response;
		// 	rootCode = response.decoded.output.codeHashData.split("0x")[1];
		// 	console.log("value0", value0);
		// } catch (e) {
		// 	console.log("catch E", e);
		// }

		let tempCols = [];

		// await fetch("https://net.ton.dev/graphql", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		query: `
		// 			{accounts(
		// 			filter:{
		// 				  code_hash:{
		// 				  eq:"${rootCode}"
		// 				}
		// 			}){
		// 			  id
		// 			}}
		// 		`,
		// 	}),
		// })
		// 	.then((r) => r.json())
		// 	.then(async (data) => {
		// 		let tempData = data.data.accounts;

		// 		for (let i = 0; i < tempData.length; i++) {
		// 			let tempAddr = tempData[i].id;

		// 			const tempAcc = new Account(NftRootColectionContract, {
		// 				address: tempAddr,
		// 				signer: signerNone(),
		// 				client,
		// 			});

		// 			try {
		// 				const response = await tempAcc.runLocal("getInfo", {});
		// 				let value0 = response;
		// 				let data = response.decoded.output;
		// 				tempCols.push({
		// 					name: data.name,
		// 					desc: data.description,
		// 					icon: data.icon,
		// 					addrCol: tempAddr,
		// 				});
		// 				console.log("value0", value0);
		// 			} catch (e) {
		// 				console.log("catch E", e);
		// 			}
		// 		}
		// 	});

		console.log(tempCols);
		setLoader(false);
		setCollections(tempCols);
	}

	useEffect(() => {
		getCollections();
	}, []);

	function openCollection(collection) {
		console.log(collection);

		navigate("/collection-market-pack/" + collection);
	}

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	return (
		<>
			<div
				className={!mintNftData.hidden || connectWallet ? "error-bg" : "hide"}
			>
				<span onClick={close}/>
			</div>
			<div
				className={
					!mintNftData.hidden || connectWallet ? "App-error" : "App App2"
				}
			>
				{/*<Header activeCat={2}/>*/}

				<div
					className={
						mintNftData.hidden ? "hide" : "modal-connect modal-connect-first"
					}
				>
					<button
						className="close"
						onClick={() => setMintNftData({hidden: true})}
					>
						<span/>
						<span/>
					</button>
					<div className="title">Robots Collection</div>
					<div className="mint owner">
						Owner: <span>0:65eb...fe7b</span>{" "}
					</div>
					<div className="mint price">
						Price: <span>149</span>{" "}
					</div>
					<div className="mint royalty">
						Royalty for Author <span>15%</span>{" "}
					</div>
					<div className="button-1-square">Buy & Open Pack</div>
				</div>

				<div className="collections">

					{collections.length > 0 ? (
						collections.map((item, index) => {
							return (
								<div key={"uniqueId" + index} className="collection">
									<div className="img">
										<img
											src={"https://cloudflare-ipfs.com/ipfs/" + item.icon}
										/>
									</div>
									<div className="content">
										<div className="name">{item.name}</div>
										<div className="description">
											<span>Description:</span>
											{item.desc}
										</div>

										<div
											className="button-1-square"
											// onClick={() => setMintNftData({hidden: false})}
											onClick={() => openCollection(item.addrCol)}
										>
											Buy & Open pack
										</div>
									</div>
								</div>
							);
						})
					) : (

						<div className={loader ? "hide" : ""}>No NFT`s</div>
					)}

					{loader ? (
						<div className="loader">
							<div/>
							<div/>
							<div/>
						</div>
					) : null}

					{redirect ? <Navigate to="/collection-market-pack" /> : ""}
				</div>

				{/*<Footer></Footer>*/}
			</div>
		</>
	);
}

export default CollectionMarket;
