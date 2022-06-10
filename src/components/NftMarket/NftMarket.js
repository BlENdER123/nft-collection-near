import React, {useState, useEffect} from "react";
// import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";
//import {main_screen_bg} from "../sdk/img/screenbg1.png"
const {marketNft} = require("../../sdk/config.json");

import * as nearAPI from "near-api-js";

const {parseNearAmount} = require("near-api-js/lib/utils/format");
import {useDispatch, useSelector} from "react-redux";

import InfiniteScroll from "react-infinite-scroll-component";
import {Navigate} from "react-router";
import {requestNFtsUrlsFetchAction} from "../../store/actions/app";
import Loader from "../Loader/Loader";

let totalFetched = 0;

function Retry() {
	const dispatch = useDispatch();
	return (
		<div
			onClick={() => dispatch(requestNFtsUrlsFetchAction())}
			className="title"
			style={{
				width: "100%",
				display: "flex",
				paddingTop: "200px",
				fontSize: "20px",
				fontWeight: "600",
			}}
		>
			<div style={{margin: "auto"}}>
				Oops! Some network problem, please try again.
			</div>
		</div>
	);
}

function NftMarket(props) {
	const dispatch = useDispatch();
	const tips = useSelector((state) => state.marketReducer.tips);

	let navigate = useNavigate();
	console.log("tips", tips);
	const [collections, setCollections] = useState([]);
	// const [collections2, setCollections2] = useState([]);

	console.log("step 2");
	// useEffect(() => {
	//   console.log("collectionscollections", collections);
	//   if (!props.collections) return;
	//   setCollections(props.collections);
	//   setCollections2(props.collections);
	//
	// }, [props.collections]);

	const [mintNftData, setMintNftData] = useState({
		hidden: true,
	});

	const [filter, setFilter] = useState({text: "", type: "name"});
	const [typeOfSort, setTypeOfSort] = useState("DESC");

	function handleSearch(e) {
		setFilter({type: e.target.id, text: e.currentTarget.value});
	}

	function handleSort(e) {
		if (e.target.classList.value !== "checkbox active") {
			setTypeOfSort(typeOfSort === "ASC" ? "DESC" : "ASC");
		} else {
			setTypeOfSort("");
		}
	}

	console.log("step 3");

	const [hasMore, setHasMore] = useState(true);
	const [redirect, setRedirect] = useState(false);

	const [accordionHidden, setAccordioHidden] = useState([false, false, false]);

	useEffect(() => {
		// getCollections();
		if (document.location.href.split("transactionHashes=")[1]) {
			let href = document.location.origin + document.location.hash;
			document.location.href = href;
		}
	}, []);

	// function openCollection(collection) {
	//   navigate("/nft-market-pack/" + collection);
	// }

	function close() {
		dispatch({type: "closeConnect"});
		console.log(connectWallet);
	}

	// async function buyNft(nft) {
	//     console.log(nft);
	//
	//     window.contractMarket = await new nearAPI.Contract(
	//         window.walletConnection.account(),
	//         marketNft,
	//         {
	//             // View methods are read-only – they don't modify the state, but usually return some value
	//             viewMethods: ["storage_minimum_balance", "storage_balance_of"],
	//             // Change methods can modify the state, but you don't receive the returned value when called
	//             changeMethods: ["offer"],
	//             // Sender is the account ID to initialize transactions.
	//             // getAccountId() will return empty string if user is still unauthorized
	//             sender: window.walletConnection.getAccountId(),
	//         },
	//     );
	//
	//     console.log(window.walletConnection.getAccountId());
	//
	//     console.log(window.walletConnection.account());
	//
	//     // console.log(nft.price);
	//     // console.log(parseNearAmount(nft.price.toString()));
	//
	//     contractMarket
	//         .offer(
	//             {
	//                 nft_contract_id: nft.addrNftCol,
	//                 token_id: nft.token_id,
	//             },
	//             "300000000000000",
	//             parseNearAmount(nft.price.toString()),
	//         )
	//         .catch(() => {
	//             alert("Connect Wallet");
	//         });
	// }

	function accordionChange(index) {
		let tempValue = [];
		for (let i = 0; i < accordionHidden.length; i++) {
			if (i == index) {
				tempValue.push(!accordionHidden[i]);
			} else {
				tempValue.push(accordionHidden[i]);
			}
			console.log(accordionHidden[i]);
		}
		setAccordioHidden(tempValue);
	}

	const itemsPerPage = 8;
	// const [currentItems, setCurrentItems] = useState(null);
	// const [pageCount, setPageCount] = useState(1);
	// const [itemOffset, setItemOffset] = useState(0);
	console.log("step 3");

	// useEffect(() => {
	//   const endOffset = pageCount * itemsPerPage;
	//   setCollections(collections2.slice(endOffset - itemsPerPage, endOffset));
	// }, [itemOffset, itemsPerPage]);

	// const handlePageClick = (event, page) => {
	//   const newOffset = (page * itemsPerPage) % collections2.length;
	//   setItemOffset(newOffset);
	//   setPageCount(page);
	//   console.log("handlePageClick", itemsPerPage, page, collections2.length)
	// };

	let uploadCount = 20;
	const sales = useSelector((state) => state.appReducer.NFTsUrls);
	// const NFTsUrlsLoading = useSelector((state) => state.appReducer.NFTsUrlsLoading);
	const NFTsUrlsError = useSelector((state) => state.appReducer.NFTsUrlsError);

	const [loadingNFTs, setLoadingNFTs] = useState(true);

	const fetchData = async () => {
		console.log("start fetching");
		if (!hasMore) {
			console.log("no more", hasMore);
			return;
		}
		let tempCols = [];
		let totalLength = sales.length;

		//ПРАВИЛЬНО ПОСЧИТАТЬ
		let out = totalFetched > 0 ? +totalLength - +totalFetched : null;

		if (totalFetched === totalLength) {
			console.log(
				"finished",
				"totalFetched",
				totalLength,
				"totalLength",
				totalLength,
			);
			setHasMore(false);
		} else {
			if (out != null && out < uploadCount) {
				console.log("last pack");
				uploadCount = out;
			}
			for (let i = totalFetched; i < totalFetched + uploadCount; i++) {
				console.log(
					"totalLength",
					totalLength,
					"totalFetched",
					totalFetched,
					"uploadCount",
					uploadCount,
					"out",
					out,
				);
				console.log(sales[i]);
				if (!sales[i].nft_contract_id) {
					console.log("sales[i]", sales[i]);
					return;
				}
				// console.log("sales.sales.",sales[i])
				window.tempContract = await new nearAPI.Contract(
					window.walletConnection.account() || "test",
					sales[i].nft_contract_id,
					{
						// View methods are read-only – they don't modify the state, but usually return some value
						viewMethods: [
							"nft_tokens",
							"nft_supply_for_owner",
							"nft_tokens_for_owner",
							"nft_token",
							"nft_metadata",
						],
						// Change methods can modify the state, but you don't receive the returned value when called
						// changeMethods: ["new"],
						// Sender is the account ID to initialize transactions.
						// getAccountId() will return empty string if user is still unauthorized
						sender: window.walletConnection.getAccountId(),
					},
				);
				console.log("timestamp4", new Date().toLocaleString());

				await tempContract
					.nft_token({token_id: sales[i].token_id})
					.then((data) => {
						// console.log(data);

						let info = data.metadata;

						let mediaUrl;

						// try {
						if (
							info.media.includes("http://") ||
							(info.media.includes("data") && info.media.length > 25) ||
							info.media.includes("https://")
						) {
							mediaUrl = info.media;
						} else {
							mediaUrl = "https://cloudflare-ipfs.com/ipfs/" + info.media;
						}
						// } catch {
						// 	mediaUrl = info.media;
						// }

						if (info.title == null || undefined) {
							info.title = "No Name";
						}
						if (info.description == null || undefined) {
							info.description = "No Description";
						}
						console.log("timestamp5", new Date().toLocaleString());

						tempContract
							.nft_metadata({})
							.then((metadata) => {
								tempCols.push({
									name: info.title,
									desc: info.description,
									nameCollection: metadata.name,
									icon: mediaUrl,
									addrNftCol: sales[i].nft_contract_id,
									token_id: sales[i].token_id,
									price: sales[i].sale_conditions / 1000000000000000000000000,
									index: i,
								});
							})
							.catch((err) => {
								console.log(err);
							});
						console.log("timestamp6", new Date().toLocaleString());
					})
					.catch((err) => {
						console.log(err);
					});
			}
			totalFetched += uploadCount;
			console.log(tempCols, "finished market");
			setCollections(collections.concat(tempCols));

			setLoadingNFTs(false);
		}
	};

	// useEffect(()=>{
	//   if(!hasMore) localStorage.setItem("nfts", JSON.stringify(collections))
	//
	// },[])

	function handleCheck() {
		console.log("typeOfSort", typeOfSort);
		// let result = [];
		// for (let i = 0; i < sales.length; i++) {
		//   for (let x = 0; i < collections.length; i++) {
		//     if (sales[i].token_id !== collections[x].token_id) {
		//       result.push(sales[i])
		//     }
		//   }
		// }
		// console.info("hasMore", hasMore, "result", result, "collections", collections, "sales", sales); // ["some5"]
	}

	return (
		<>
			<div
			// className={!mintNftData.hidden || connectWallet ? "error-bg" : "hide"}
			>
				<span onClick={close} />
			</div>

			{/*TODO was ist das check with Anton*/}
			{/*<div*/}
			{/*  className={*/}
			{/*    mintNftData.hidden ? "hide" : "modal-connect modal-connect-first"*/}
			{/*  }*/}
			{/*>*/}
			{/*  <button*/}
			{/*    className="close"*/}
			{/*    onClick={() => setMintNftData({hidden: true})}*/}
			{/*  >*/}
			{/*    <span/>*/}
			{/*    <span/>*/}
			{/*  </button>*/}
			{/*  <div className="title">Robots Collection</div>*/}
			{/*  <div className="mint owner">*/}
			{/*    Owner: <span>0:65eb...fe7b</span>{" "}*/}
			{/*  </div>*/}
			{/*  <div className="mint price">*/}
			{/*    Price: <span>149</span>{" "}*/}
			{/*  </div>*/}
			{/*  <div className="mint royalty">*/}
			{/*    Royalty for Author <span>15%</span>{" "}*/}
			{/*  </div>*/}
			{/*  <div className="button-1-square">Buy & Open Pack</div>*/}
			{/*</div>*/}
			<div className="constructor-market">
				<div className="container-header">
					<div className="modal-constructor modal-constructor-filter">
						<div onClick={() => handleCheck()} className="title-1">
							Marketplace
						</div>

						<div className="title">
							Search{" "}
							<span
								className={accordionHidden[0] ? "hidden" : ""}
								onClick={() => {
									accordionChange(0);
								}}
							/>
						</div>
						<div className="text" />
						<div className={accordionHidden[0] ? "hide" : "search"}>
							<input
								className="input"
								id={"name"}
								placeholder="Enter ID for search"
								onChange={(e) => handleSearch(e)}
							/>
						</div>
						<div className="title">
							Sort Filter{" "}
							<span
								className={accordionHidden[1] ? "hidden" : ""}
								onClick={() => {
									accordionChange(1);
								}}
							/>
						</div>
						<div className="text" />
						<div className={accordionHidden[1] ? "hide" : "filter"}>
							{/*//TODO refactor styles*/}
							<div
								id={"ASC"}
								className={"hoverSorter"}
								onClick={(ev) => {
									handleSort(ev);
									console.log(ev.target.classList.toggle("active"));
								}}
							>
								Sort by price ({typeOfSort})
							</div>
						</div>
					</div>

					{props.loader ? (
						<Loader />
					) : NFTsUrlsError ? (
						<Retry />
					) : (
						<div
							id={"scrollableDiv"}
							className="modal-constructor modal-constructor-market"
						>
							<InfiniteScroll
								dataLength={sales.length}
								next={fetchData()}
								// pageStart={0}
								hasMore={hasMore}
								loader={
									<div
										style={{
											width: "100%",
											display: "flex",
											paddingTop: "200px",
										}}
									>
										<div className="loader" style={{margin: "auto"}}>
											<div />
											<div />
											<div />
										</div>
									</div>
								}
							>
								<div className="collection_grid">
									{" "}
									{collections
										.sort((a, b) => {
											if (!typeOfSort) {
												return a.index - b.index;
											}
											if (typeOfSort === "ASC") {
												return b.price - a.price;
											} else {
												return a.price - b.price;
											}
										})
										.filter((item) =>
											item[filter.type]
												.toLowerCase()
												.includes(filter.text.toLowerCase()),
										)
										.map((item, index) => {
											return (
												<div
													onClick={() => {
														// console.log(item);
														navigate(
															"/nft-market-nft/" +
																item.addrNftCol +
																"!token!" +
																item.token_id,
														);
													}}
													className={"collectionItem"}
													key={item.index}
												>
													{/* <div class="rarity">L</div> */}
													<div className="img">
														<img
															style={{
																borderRadius: "6px",
																marginBottom: "10px",
																objectFit: "cover",
																width: "170px",
																height: "200px",
															}}
															src={item.icon}
															alt={"icon"}
														/>
													</div>
													<div className="nameCol">
														{item.nameCollection.substring(0, 40)}
													</div>
													<div className="collection_name">
														{item.name.substring(0, 20)}
													</div>
													<div className="collection_subtitle">Price</div>
													<div className="collection_price">
														<span className="collection_price_span" />{" "}
														{item.price.toFixed(3)} NEAR
													</div>
												</div>
											);
										})}
								</div>
							</InfiniteScroll>
						</div>
					)}
				</div>
			</div>

			<div className="collections">
				{redirect ? <Navigate to="/collection-market-pack" /> : ""}
			</div>
		</>
	);
}

export default NftMarket;
