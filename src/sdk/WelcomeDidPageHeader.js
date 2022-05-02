import React, {useState} from "react";
import refresh from "./img/refresh.png";
import {Account} from "@tonclient/appkit";
import {libWeb} from "@tonclient/lib-web";

const {TonClient} = require("@tonclient/core");
TonClient.useBinaryLibrary(libWeb);
const client = new TonClient({network: {endpoints: ["main.ton.dev"]}});

function WelcomeDidPageHeader() {
	async function getClientBalance(clientAddress) {
		console.log("clientAddress", clientAddress);
		let address = clientAddress;
		if (
			clientAddress ===
			"0:0000000000000000000000000000000000000000000000000000000000000000"
		)
			return 0;
		try {
			let clientBalance = await client.net.query_collection({
				collection: "accounts",
				filter: {
					id: {
						eq: address,
					},
				},
				result: "balance",
			});
			console.log("clientBalance", clientBalance);
			return +clientBalance.result[0].balance / 1000000000;
		} catch (e) {
			console.log("catch E", e);
			return e;
		}
	}

	const [bal, setBal] = useState();

	function refreshBal() {
		let bal1 = getClientBalance(localStorage.address);
		bal1.then(
			(data) => {
				let temp = String(data).slice(0, 3);
				setBal(temp);
			},
			(error) => {
				console.log(error);
			},
		);
	}
	refreshBal();

	return (
		<div className="acc-info">
			<div class="acc-info1">
				<div class="name">NFTour</div>
				<div class="wallet">
					<div className="acc-status">Connected:</div>
					<div className="acc-wallet">{localStorage.address}</div>
				</div>
			</div>

			<div class="pages">
				<div class="page-element active">Home</div>
				<div class="page-element">NFT Generator</div>
				<div class="page-element">NFT Chapter Constructor</div>
				<div class="page-element">FAQ</div>
			</div>
		</div>
	);
}

export default WelcomeDidPageHeader;
