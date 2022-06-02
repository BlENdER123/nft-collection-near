import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";

// import Header from "../../Pages/Header/Header";
// import Footer from "../../Pages/Footer/Footer";

import {useDispatch, useSelector} from "react-redux";

const {
	nearConfig,
	marketNft,
} = require("../../sdk/config.json");

import * as nearAPI from "near-api-js";
const {parseNearAmount} = require("near-api-js/lib/utils/format");



function NftMarketNft() {
	let navigate = useNavigate();
	const dispatch = useDispatch();
	const connectWallet = useSelector((state) => state.connectWallet);
	const params = useParams();
	let addrCol = params.address.split("!token!")[0];
	let token_id = params.address.split("!token!")[1];

	const [isFullDescription, setIsFullDescription] = useState(false);

	const [nftHistory, setNftHistory] = useState([
		{
			owner: "Null",
			method_name: "Null",
			time: "Null",
			price: "Null",
			price_fiat: "Null",
		},
	]);

	const [isSaleAvailable, setIsSaleAvailable] = useState(false);

	const [isOnSale, setIsOnSale] = useState(false);

	const [nftInfo, setNftInfo] = useState({
		name: "No Name",
		desc: "No Description",
		img: null,
		owner: "No Owner",
		price: 0,
		width: 0,
		height: 0,
		size: 0,
	});

	const [errorModal, setErrorModal] = useState({
		hidden: false,
		message: "",
	});

	async function getNft() {
		window.near = await nearAPI.connect({
			deps: {
				keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
			},
			...nearConfig,
		});

		window.walletConnection = new nearAPI.WalletConnection(window.near);
		window.accountId = window.walletConnection.getAccountId();

		window.ContractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["get_sales_by_owner_id", "storage_balance_of"],
				changeMethods: ["offer"],
				// Change methods can modify the state, but you don't receive the returned value when called
				// changeMethods: ["new"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		// let tempPrice;

		ContractMarket.get_sales_by_owner_id({
			account_id: window.walletConnection.getAccountId(),
			from_index: "0",
			limit: 100,
		}).then(async (sales) => {
			console.log(sales);
			ContractMarket.storage_balance_of({
				account_id: window.walletConnection.getAccountId(),
			}).then((data) => {
				if (sales.length < data / 10000000000000000000000) {
					console.log(sales);
					console.log(sales.length, data / 10000000000000000000000);
					setIsSaleAvailable(true);
				} else {
					console.log(sales.length, data / 10000000000000000000000);
					setIsSaleAvailable(false);
				}
			});

			for (let i = 0; i < sales.length; i++) {
				if (
					sales[i].nft_contract_id === addrCol &&
					sales[i].token_id === token_id
				) {
					setIsOnSale(true);
				}
			}
		});

		window.ContractCol = await new nearAPI.Contract(
			window.walletConnection.account(),
			addrCol,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: [
					"nft_tokens",
					"nft_supply_for_owner",
					"nft_tokens_for_owner",
					"nft_token",
				],
				// Change methods can modify the state, but you don't receive the returned value when called
				// changeMethods: ["new"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		ContractCol.nft_token({
			token_id: token_id,
		}).then((data) => {
			let info = data.metadata;

			let mediaUrl;

			try {
				if (
					info.media.includes("http://") ||
					(info.media.includes("data") && info.media.length > 25) ||
					info.media.includes("https://")
				) {
					mediaUrl = info.media;
				} else {
					mediaUrl = "https://cloudflare-ipfs.com/ipfs/" + info.media;
				}
			} catch {
				mediaUrl = info.media;
			}

			let img = new Image();
			img.src = mediaUrl;

			img.onload = async function () {
				let tempW = this.width;
				let tempH = this.height;
				// console.log(this.size);
				await fetch(mediaUrl).then((r) => {
					r.blob().then((res) => {
						console.log(res);
						setNftInfo({
							name: info.title,
							desc: info.description,
							// desc: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
							img: mediaUrl,
							owner: data.owner_id,
							price: 1 / 1000000000000000000000000,
							width: tempW,
							height: tempH,
							size: res.size / 1024 / 1024,
						});
					});
				});
			};

			console.log(mediaUrl);
			console.log(data);
		});

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

				await fetch("https://gq2.cryptan.site/graphql", {
					method: "post",
					headers: {
						"Content-Type": "application/json; charset=utf-8",
						Connection: "keep-alive",
					},
					body: JSON.stringify({
						query: `
						{
							nftDtos(filter: {emitted_by_contract_account_id: { eq: "${addrCol}"}, token_id: {eq: "${token_id}"} }) {
							pageInfo {
							  hasNextPage
							  hasPreviousPage
							  startCursor
							  endCursor
							}
							edges {
							  node {
							  emitted_for_receipt_id
							  emitted_at_block_timestamp
							  emitted_in_shard_id
							  emitted_index_of_event_entry_in_shard
							  event_kind
							  token_id
							  token_old_owner_account_id
							  token_new_owner_account_id
							  token_authorized_account_id
							  event_memo 
							  }
							  cursor
							}
						  }
						}
						
						`,
					}),
				})
					.then((data) => {
						return data.json();
					})
					.then(async (data) => {
						console.log(data);

						let dataHistory = data.data.nftDtos.edges;

						let tempHistory = [];

						for (let i = 0; i < dataHistory.length; i++) {
							let newStamp =
								dataHistory[i].node.emitted_at_block_timestamp / 1000000;
							let tempDate = new Date(newStamp);

							let dateString = `${tempDate.getDate()}/${
								tempDate.getMonth() + 1
							}/${tempDate.getFullYear()} ${
								tempDate.getHours().toString().length > 1
									? tempDate.getHours()
									: "0" + tempDate.getHours()
							}:${
								tempDate.getMinutes().toString().length > 1
									? tempDate.getMinutes()
									: "0" + tempDate.getMinutes()
							}`;

							// console.log(dateString);

							await fetch("https://gq2.cryptan.site/graphql", {
								method: "post",
								headers: {
									"Content-Type": "application/json; charset=utf-8",
									Connection: "keep-alive",
								},
								body: JSON.stringify({
									query: `
									{
										todoItem(id: "${dataHistory[i].node.emitted_for_receipt_id}"  ) {
										   receipt_receiver_account_id
											index_in_action_receipt
											action_kind
											args        
											receipt_receiver_account_id
											receipt_included_in_block_timestamp
											receipt_predecessor_account_id
									}
									}
									
									`,
								}),
							})
								.then((data) => {
									return data.json();
								})
								.then((data_id) => {
									console.log(data_id.data.todoItem.args.deposit);

									tempHistory.push({
										owner: dataHistory[i].node.token_new_owner_account_id,
										method_name: dataHistory[i].node.event_kind,
										time: dateString,
										// price: 0,
										// price_fiat: 0,
										price: (
											data_id.data.todoItem.args.deposit /
											1000000000000000000000000
										).toFixed(2),
										price_fiat: (
											(
												data_id.data.todoItem.args.deposit /
												1000000000000000000000000
											).toFixed(2) * price.near.usd
										).toFixed(2),
									});
								});
						}
						setNftHistory(tempHistory);
					});
			});
	}

	useEffect(async () => {
		await getNft();
	}, []);


	async function depositNft() {
		window.contractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["storage_minimum_balance", "storage_balance_of"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["storage_deposit"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		// contractMarket.storage_balance_of({account_id: window.walletConnection.getAccountId()}).then((data)=> {
		// 	console.log(data);
		// })

		contractMarket.storage_minimum_balance().then(async (data) => {
			console.log(data);

			contractMarket.storage_deposit({}, "30000000000000", data);
		});
		// .catch(() => {
		// 	alert("Connect Wallet");
		// });
	}

	async function removeSale() {
		window.contractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: ["storage_minimum_balance"],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["storage_deposit", "remove_sale"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		contractMarket
			.remove_sale(
				{
					nft_contract_id: addrCol,
					token_id: token_id,
				},
				"30000000000000",
				"1",
			)
			.catch(() => {
				alert("Connect Wallet");
			});
	}

	async function saleNft() {
		// console.log(nft);

		// console.log(salePrice);

		let salePrice = 1;

		// if (
		// 	salePrice <= 0 ||
		// 	salePrice == "" ||
		// 	salePrice == undefined ||
		// 	salePrice == null
		// ) {
		// 	alert("Set Sale Price");
		// 	return;
		// }

		window.contractSale = await new nearAPI.Contract(
			window.walletConnection.account(),
			addrCol,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				// viewMethods: ['get_num'],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["nft_approve"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		window.contractMarket = await new nearAPI.Contract(
			window.walletConnection.account(),
			marketNft,
			{
				// View methods are read-only – they don't modify the state, but usually return some value
				viewMethods: [
					"storage_minimum_balance",
					"get_sale",
					"get_sales_by_owner_id",
				],
				// Change methods can modify the state, but you don't receive the returned value when called
				changeMethods: ["storage_deposit"],
				// Sender is the account ID to initialize transactions.
				// getAccountId() will return empty string if user is still unauthorized
				sender: window.walletConnection.getAccountId(),
			},
		);

		// contractMarket
		// 	.get_sales_by_owner_id({
		// 		account_id: window.walletConnection.getAccountId(),
		// 		from_index: "0",
		// 		limit: 50,
		// 	})
		// 	.then((data) => {
		// 		console.log(data);
		// 	});

		contractSale
			.nft_approve(
				{
					token_id: token_id,
					account_id: marketNft,
					msg: JSON.stringify({
						sale_conditions: parseNearAmount("1"),
					}),
				},
				"30000000000000",
				parseNearAmount("0.01"),
			)
			.catch((err) => {
				alert("Connect Wallet");
			});

		// setSalePrice(0);
	}


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

				<div class="container auction-sale">
					<div
						className="back"
						onClick={() =>
							navigate("/profile/" + window.walletConnection.getAccountId())
						}
					>
						{/* <button ></button> */}
					</div>
					<div class="img">
						<div class="img">
							<img src={nftInfo.img} />
						</div>
						<div class="text">
							{nftInfo.width} x {nftInfo.height} px.IMAGE(
							{nftInfo.size.toFixed(2)}MB)
						</div>
						<div class="text">
							<div class="title">Contract Address</div>
							{addrCol}
						</div>
						<div class="text">
							<div class="title">Token ID</div>
							{token_id}
						</div>
					</div>
					<div class="content">
						<div class="title-col">Collection Name</div>
						<div class="title-nft">
							{nftInfo.name}
							<span className="share">
								<div class="img"/>
								Share
							</span>
						</div>
						<div class="users">
							<div class="user">
								<div class="img">H</div>
								<div class="text">
									<span>Creator</span>Hellow World
								</div>
							</div>
							<div class="user">
								<div class="img">M</div>
								<div class="text">
									<span>Owner</span>
									{nftInfo.owner}
								</div>
							</div>
						</div>
						<div class="desc">
							<div class="title">Description</div>
							{isFullDescription ? nftInfo.desc : nftInfo.desc.slice(0, 40)}
							<br />
							<div
								className={nftInfo.desc.length > 40 ? "show" : "hide"}
								onClick={() => setIsFullDescription(!isFullDescription)}
							>
								Show full description{" "}
							</div>
						</div>

						<button
							className={
								isSaleAvailable || isOnSale ? "hide" : "button-1-square"
							}
							onClick={depositNft}
						>
							Activate Sale (0.01 NEAR)
						</button>
						<button
							className={
								isSaleAvailable && !isOnSale ? "button-1-square" : "hide"
							}
							onClick={saleNft}
						>
							Put on Sale
						</button>
						<button
							className={isOnSale ? "button-4-square" : "hide"}
							onClick={removeSale}
						>
							Cancel Sale
						</button>


						<div class="history">
							<div class="menu-history">
								<div class="menu-item">Item Activity</div>
								<div class="menu-item">Provenance</div>
							</div>
							<div class="content">
								{nftHistory.map((item) => {
									return (
										<div class="item">
											<div class="name">
												{item.owner} <span>{item.method_name}</span>
											</div>
											<div class="price">{item.price} NEAR</div>
											<div class="date">{item.time}</div>
											<div class="price-rub">≈ $ {item.price_fiat}</div>
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

export default NftMarketNft;
