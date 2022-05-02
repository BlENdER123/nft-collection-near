/*
    DEX contracts
*/
import {DEXRootContract} from "../contracts/DEXRoot.js";
import {DEXClientContract} from "../contracts/DEXClientMainNet.js";
import {GContract} from "../contracts/GContract.js";
import {TONTokenWalletContract} from "../contracts/TONTokenWallet.js";
import {RootTokenContract} from "../contracts/RootTokenContract.js";
import {SafeMultisigWallet} from "../msig/SafeMultisigWallet.js";
import {DEXPairContract} from "../contracts/DEXPair.js";
import {DEXConnectorContract} from "../contracts/DEXConnector.js";
import {abiContract, signerKeys, signerNone} from "@tonclient/core";
import {iconGenerator} from "../../iconGenerator";
/*
    NFT contracts
*/
import {DataContract} from "../contracts/Data.js";
import {NftRootContract} from "../contracts/NftRoot.js";
import {LockStakeSafeContract} from "../contracts/LockStakeSafe.js";
import salary from "../../images/salary.svg";
import {libWeb} from "@tonclient/lib-web";
import {store} from "../../index";
import {setTips} from "../../store/actions/app";
import {setUpdatedBalance,} from "../../store/actions/wallet";
import TON from "../../images/tokens/TON.svg";
import {getDecimals, getFixedNums, toHex} from "../../reactUtils/reactUtils";

const {ResponseType} = require("@tonclient/core/dist/bin");
const {TonClient} = require("@tonclient/core");
const {Account} = require("@tonclient/appkit");
TonClient.useBinaryLibrary(libWeb);

const Radiance = require("../Radiance.json");
const dexroot = Radiance.networks["2"].dexroot
const rootAddrNFT = Radiance.networks["2"].rootAddrNFT
const BroxusRootCodeHash = Radiance.networks["2"].BroxusRootCodeHash

const DappServer = Radiance.networks["2"].DappServer

const client = new TonClient({network: {endpoints: [DappServer]}});
export default client;



import {hex2a} from "../../reactUtils/reactUtils"

function getShardThis(string) {
	return string[2];
}

export async function getWalletAddress(clientPubkey,pairAddress,rootAddress) {
	const rootAcc = new Account(DEXRootContract, {
		address: dexroot,
		signer: signerNone(),
		client,
	});
	const RTacc = new Account(RootTokenContract, {address: rootAddress,client,});
	let pubk = "0x" + clientPubkey

	let connectorSoArg0;
	let status = false;
	let n = 0;
	let res;

	let targetShard = getShardThis(dexroot);
	while (!status) {
		res = await rootAcc.runLocal("getConnectorAddress", {
			_answer_id: 0,
			connectorPubKey: pubk,
			connectorSoArg: n,
			connectorCommander: pairAddress
		});
		let connectorAddr = res.decoded.output.value0;
		let shardC = getShardThis(connectorAddr);
		if (shardC === targetShard) {
			console.log("connectorSoArg:", n);
			console.log("getConnectorAddress:", connectorAddr);
			res = await RTacc.runLocal("getWalletAddress", {
				_answer_id: 0,
				wallet_public_key_: 0,
				owner_address_: connectorAddr
			});
			let walletAddr = res.decoded.output.value0;
			let shardW = getShardThis(walletAddr);
			if (shardW === targetShard) {
				console.log("Bingo!");
				connectorSoArg0 = n;
				console.log("getWalletAddress:", walletAddr);
				console.log("connectorSoArg0:", n);
				status = true;
			} else {
				console.log("n",n);
			}
		} else {
			console.log("n",n);
		}
		n++;
	}
	return connectorSoArg0
}


export async function getRootTokenAddress(clientPubkey,rootName,decimals) {
	const rootAcc = new Account(DEXRootContract, {
		address: dexroot,
		client,
	});
	let rootABsouint;
	let rootABaddress;
	let status = false;
	let targetShard = getShardThis(dexroot);
	let n = 0;
	let res;
	let pubk = "0x" + clientPubkey

	console.log("pubk",pubk,"n",n,"rootName",rootName,"decimals",decimals)
	try {
		while (!status) {
			res = await rootAcc.runLocal("getRootTokenAddress", {
				_answer_id: 0,
				rootPubKey: pubk,
				rootSoArg: n,
				rootName: toHex(rootName),
				rootSymbol: toHex(rootName),
				rootDecimals: decimals
			});
			console.log("targetShard", targetShard, n)
			rootABaddress = res.decoded.output.value0;
			rootABsouint = n;
			let shard = getShardThis(rootABaddress);
			if (shard === targetShard) {
				console.log("Bingo!");
				console.log("rootAB SoArg:", rootABsouint);
				console.log("rootAB Address:", rootABaddress);
				status = true;
			} else {
				console.log(n);
			}
			n++;

		}
		return {rootABsouint: rootABsouint, rootABaddress: rootABaddress}
	}catch(e){
console.log("e",e)
		return e
	}
}

export async function getPairAddress(clientPubkey,clientAddr,rootAddrA,rootAddrB,rootABaddress){
	const rootAcc = new Account(DEXRootContract, {
		address: dexroot,
		signer: signerNone(),
		client,
	});
	let pubk = "0x" + clientPubkey

	let targetShard = getShardThis(dexroot);
	let pairAddress;
	let pairSoArg;
	let status = false;
	let n = 0;
	let res;
	while (!status) {
		res = await rootAcc.runLocal("getPairAddress", {_answer_id:0,pairPubKey:pubk,pairSoArg:n,pairCreator:clientAddr,pairRootA:rootAddrA,pairRootB:rootAddrB,pairRootAB:rootABaddress});
		pairAddress = res.decoded.output.value0;
		let shard = getShardThis(pairAddress);
		if (shard === targetShard) {
			console.log("Bingo!");
			console.log("pair SoArg:", n);
			pairSoArg = n;
			console.log("pairAddress Address:", pairAddress);
			status = true;
		} else {console.log(n);}
		n++;
	}
	return {pairAddress:pairAddress,pairSoArg:pairSoArg}

}



export async function queryRoots(minBalance) {
	try {
		return (
			await client.net.query_collection({
				collection: "accounts",
				filter: {
					code_hash: {
						eq: BroxusRootCodeHash,
					},
					balance:{
						gt: minBalance
					},
				},
				order_by:{
					path:"balance",
					direction:"DESC"
				},
				result: "id balance",
			})
		).result;
	} catch (error) {
		console.error(error);
	}
}
export async function getAccType2(addr) {
	try {
		const curWalletContract = new Account(TONTokenWalletContract, {
			address: addr,
			client,
		});

		return await curWalletContract.getAccount()
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}
export async function getAccTypeHex(addr) {
	try {
		return await client.utils.convert_address({
			address: addr,
			output_format: {
				type: "Hex",
			},
		})
	} catch(e) {

		return e;
	}

}

let GiverAd ="0:ed069a52b79f0bc21d13da9762a591e957ade1890d4a1c355e0010a8cb291ae4";

export async function transferFromGiver(addr, count) {
	const gSigner = signerKeys({
		public: "d7e584a9ef4d41de1060b95dc1cdfec6df60dd166abc684ae505a9ff48925a19",
		secret: "742bba3dab8eb0622ba0356acd3de4fd263b9f7290fdb719589f163f6468b699",
	});

	const curGiverContract = new Account(GContract, {
		address: GiverAd,
		signer: gSigner,
		client,
	});
	return await curGiverContract.run("pay", {
		addr,
		count,
	});
}

export async function getShardConnectPairQUERY(
	clientAddress,
	targetShard,
	rootAddress,
) {
	let connectorSoArg0;
	let status = false;

	let shardC;
	let connectorAddr;

	const accClient = new Account(DEXClientContract, {
		address: clientAddress,
		client,
	});
	const RootTknContract = new Account(RootTokenContract, {
		address: rootAddress,
		client,
	});
	let sountArr = await checkSouint(clientAddress);
	console.log("sountArr=11111", sountArr);
	// web3.utils.toBN(String(totalSupply) + "0".repeat(decimalPrecision)),
	let largestNum = sountArr
		.sort(function (a, b) {
			return a - b;
		})
		.reverse();
	console.log("sountArr==========", sountArr, largestNum);
	let n = largestNum[0] + 1 || 0;
	let shardW;
	let walletAddr;
	while (!status) {
		let response = await accClient.runLocal("getConnectorAddress", {
			_answer_id: 0,
			connectorSoArg: n,
		});
		// console.log("response",response)
		connectorAddr = response.decoded.output.value0;
		shardC = getShardThis(connectorAddr);
		if (shardC === targetShard) {
			console.log("sharding--------", n, shardC, targetShard);
			let resp = await RootTknContract.runLocal("getWalletAddress", {
				_answer_id: 0,
				wallet_public_key_: 0,
				owner_address_: connectorAddr,
			});
			walletAddr = resp.decoded.output.value0;
			shardW = getShardThis(walletAddr);
			if (shardW === targetShard) {
				console.log(
					"sharding+++++++++++",
					!sountArr.filter((item) => item === shardW).length,
					n,
				);
				connectorSoArg0 = n;
				status = true;
			} else {
				//console.log(n, 'second');
			}
		} else {
			//console.log(n, 'first');
		}
		n++;
	}

	return connectorSoArg0;
}

export async function getRootConnectorCode() {
	const RootContract = new Account(DEXRootContract, {
		address: Radiance.networks["2"].dexroot,
		client,
	});
	const RootCreators = await RootContract.runLocal("codeDEXconnector", {});
	return RootCreators.decoded.output;
}

export async function getRootClientCode() {
	const RootContract = new Account(DEXRootContract, {
		address: Radiance.networks["2"].dexroot,
		client,
	});
	const RootCreators = await RootContract.runLocal("codeDEXclient", {});
	return RootCreators.decoded.output;
}

export async function getRootCreators() {
	// try {
	const RootContract = new Account(DEXRootContract, {
		address: Radiance.networks["2"].dexroot,
		client,
	});
	const RootCreators = await RootContract.runLocal("creators", {});
	return RootCreators.decoded.output;
	// } catch (e) {
	//     console.log("catch E", e);
	//     return e
	// }
}

export async function getRootBalanceOF() {
	try {
		const RootContract = new Account(DEXRootContract, {
			address: Radiance.networks["2"].dexroot,
			client,
		});
		const RootbalanceOf = await RootContract.runLocal("balanceOf", {});
		return RootbalanceOf.decoded.output;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

/**
 * Function to get balance of TOKENS in token wallets
 * @author   max_akkerman
 * @param   {string} walletAddress
 * @return   {number}
 */

export async function getWalletBalanceQUERY(walletAddress) {
	try {
		const curWalletContract = new Account(TONTokenWalletContract, {
			address: walletAddress,
			client,
		});

		return await curWalletContract.runLocal("balance", {answerId: 0});
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

/**
 * Function to check connected pair or not
 * @author   max_akkerman
 * @param   {string, string} clientAddress,pairAddress
 * @param pairAddress
 * @return   {bool}
 */

export async function checkClientPairExists(clientAddress, pairAddress) {
	const acc = new Account(DEXClientContract, {address: clientAddress, client});
	try {
		const response = await acc.runLocal("getAllDataPreparation", {});
		const response2 = await acc.runLocal("rootWallet", {});
		let clientPairs = response.decoded.output.pairKeysR;
		console.log("getAllDataPreparation1", response.decoded.output);
		console.log("getAllDataPreparation2", response2.decoded.output);
		let newArr = clientPairs.filter((item) => item === pairAddress);
		return newArr.length !== 0;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

/**
 * Function to check wallet exists by pair
 * @author   max_akkerman
 * @param   {string} clientAddress
 * @param pairAddress
 * @return   [{walletAddress:string,symbol:string,balance:number}]
 */

export async function checkwalletExists(clientAddress, pairAddress) {
	const acc = new Account(DEXClientContract, {address: clientAddress, client});
	const pairContract = new Account(DEXPairContract, {
		address: pairAddress,
		client,
	});
	try {
		const respRootWallets = await acc.runLocal("rootWallet", {});

		const respRootA = await pairContract.runLocal("rootA", {});
		const respRootB = await pairContract.runLocal("rootB", {});
		const respRootAB = await pairContract.runLocal("rootAB", {});

		let clientRoots = respRootWallets.decoded.output.rootWallet;
		let rootA = respRootA.decoded.output.rootA;
		let rootB = respRootB.decoded.output.rootB;
		let rootAB = respRootAB.decoded.output.rootAB;

		let checkedArr = [
			{
				status: !!clientRoots[rootA],
				walletAaddress: rootA,
			},
			{
				status: !!clientRoots[rootB],
				walletBaddress: rootB,
			},
			{
				status: !!clientRoots[rootAB],
				walletABaddress: rootAB,
			},
		];

		console.log("checkedObj", checkedArr);
		return checkedArr;
		// let newArr = clientPairs.filter(item => item === pairAddress);
		// return newArr.length !== 0;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

/**
 * Function to get client wallets
 * @author   max_akkerman
 * @return   string
 * @param name
 */
export function getFullName(name) {
	if (name === "TON") {
		return "TON Crystal";
	} else if (name === "WTON") {
		return "Wrapped TON Crystal";
	} else if (name === "fBTC") {
		return "fBitcoin";
	} else if (name === "WETH") {
		return "Wrapped Ethereum";
	} else if (name === "fETH") {
		return "fEthereum";
	} else if (name === "WBTC") {
		return "Wrapped Bitcoin";
	} else if (name === "DS-WTON/USDT") {
		return "Pool tokens of TON/USDT pair";
	} else if (name === "DS-WTON/WETH") {
		return "Pool tokens of TON/ETH pair";
	} else if (name === "DS-WTON/WBTC") {
		return "Pool tokens of TON/BTC pair";
	} else if (name === "USDT") {
		return "Tether";
	} else {
		return name;
	}
}

export async function getAllClientWallets(clientAddress) {
	console.log("clientAddress____", clientAddress);
	const acc = new Account(DEXClientContract, {address: clientAddress, client});
	const response = await acc.runLocal("rootWallet", {});
	console.log(
		"response.decoded.output.rootWallet",
		response.decoded.output.rootWallet,
	);
	let normalizeWallets = [];
	try {
		for (const item of Object.entries(response.decoded.output.rootWallet)) {
			const curWalletContract = new Account(TONTokenWalletContract, {
				address: item[1],
				client,
			});
			const curRootContract = new Account(RootTokenContract, {
				address: item[0],
				client,
			});
			console.log("item[1]", item[1], "item[0]", item[0]);

			let curWalletData = await curWalletContract.runLocal("getDetails", {
				_answer_id: 0,
			});
			let curRootData = await curRootContract.runLocal("getDetails", {
				_answer_id: 0,
			});
			let itemData = {};

			// console.log("hereii", curWalletData)
			itemData.walletAddress = item[1];
			itemData.symbol = hex2a(curRootData.decoded.output.value0.symbol);
			itemData.tokenName = getFullName(itemData.symbol);
			itemData.type = "PureToken";
			itemData.owner_address =
				curWalletData.decoded.output.value0.owner_address;
			itemData.decimals = curRootData.decoded.output.value0.decimals;
			itemData.icon = iconGenerator(itemData.symbol);
			itemData.rootAddress = curWalletData.decoded.output.value0.root_address;
			itemData.balance =
				+curWalletData.decoded.output.value0.balance /
				getDecimals(curRootData.decoded.output.value0.decimals);

			if(itemData.walletAddress !== "0:eac2a309de0d777b820bd5b5fbfcb07733be5c068234333bd83ad35f610fe82d"){
				normalizeWallets.push(itemData);
			}


		}
		console.log("normalizeWallets", normalizeWallets);
		return normalizeWallets;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

/**
 * Function to check existing of dexclient at root
 * @author   max_akkerman
 * @param   {number} clientPubkey
 * @return   [{walletAddress:string,symbol:string,balance:number}]
 */

export async function checkPubKey(clientPubkey) {
	try {
		const RootContract = new Account(DEXRootContract, {
			address: Radiance.networks["2"].dexroot,
			client,
		});

		let response = await RootContract.runLocal("checkPubKey", {
			pubkey: "0x" + clientPubkey,
		});
		return response.decoded.output;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

/**
 * Function to get all pairs on dex root
 * @author   max_akkerman
 * @param
 * @return   number{pairAddress:string,symbolA:string,reserveA:number,symbolB:string,reserveB:number,rateAB:nubmer,rateBA:number}]
 */

export async function getAllPairsWoithoutProvider() {
	const acc = new Account(DEXRootContract, {
		address: Radiance.networks["2"].dexroot,
		client,
	});
	const response = await acc.runLocal("pairs", {});
console.log("response.decoded.output",response.decoded.output)
	let normlizeWallets = [];

	for (const item of Object.entries(response.decoded.output.pairs)) {
		const curRootTokenA = new Account(RootTokenContract, {
			address: item[1].root0,
			client,
		});
		const curRootTokenB = new Account(RootTokenContract, {
			address: item[1].root1,
			client,
		});
		const curRootTokenAB = new Account(RootTokenContract, {
			address: item[1].rootLP,
			client,
		});
		const pairContract = new Account(DEXPairContract, {
			address: item[0],
			client,
		});

		let bal = await pairContract.runLocal("balanceReserve", {});

		let curRootDataA = await curRootTokenA.runLocal("getDetails", {
			_answer_id: 0,
		});
		let curRootDataB = await curRootTokenB.runLocal("getDetails", {
			_answer_id: 0,
		});
		let curRootDataAB = await curRootTokenAB.runLocal("getDetails", {
			_answer_id: 0,
		});
		console.log("curRootDataA", curRootDataA);
		const decimalsRootA = Number(curRootDataA.decoded.output.value0.decimals);
		const decimalsRootB = Number(curRootDataB.decoded.output.value0.decimals);

		const balanceA = Number(bal.decoded.output.balanceReserve[item[1].root0]);
		const balanceB = Number(bal.decoded.output.balanceReserve[item[1].root1]);

		const fixedA =  getFixedNums(decimalsRootA, balanceA);
		const fixedB =  getFixedNums(decimalsRootB, balanceB);
		// console.log("fixedA", fixedA, "fixedB", fixedB);
		let itemData = {};
		itemData.pairAddress = item[0];

		// itemData.pairname = hex2a(curRootDataAB.decoded.output.value0.name)
		itemData.symbolA = hex2a(curRootDataA.decoded.output.value0.symbol);
		itemData.reserveA = fixedA;

		itemData.symbolB = hex2a(curRootDataB.decoded.output.value0.symbol);
		itemData.reservetB = fixedB;

		itemData.rateAB = fixedB / fixedA;
		itemData.rateBA = fixedA / fixedB;
		itemData.totalSupply = await getPairsTotalSupply(item[0]);


		if(itemData.pairAddress !== "0:ea784f5e3434beb91fa56c8b0131cac0be703d6551a3bb297e4d6db95ae0af8e"){
			console.log("alert",itemData.symbolA)
			normlizeWallets.push(itemData);
		}


		// let wrongPairID = normlizeWallets.find((item,i)=>{
		// 	if(item.pairAddress === "0:ea784f5e3434beb91fa56c8b0131cac0be703d6551a3bb297e4d6db95ae0af8e")
		// 	{
		// 		return i
		// 	}
		//
		// })
		// console.log("wrongPairID",wrongPairID)
		// if(wrongPairID){
		// 	normlizeWallets.splice(wrongPairID,1)
		// }

		console.log("normlizeWallets!!normlizeWallets", normlizeWallets);
	}
	return normlizeWallets;
}

/**
 * Function to get native balance of address in tons
 * @author   max_akkerman
 * @param {string} clientAddress
 * @return   {number}
 */

export async function getClientBalance(clientAddress) {
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

export const decode = {
	async message(abi, boc) {
		try {
			return await TonClient.default.abi.decode_message({
				abi: abiContract(abi),
				message: boc,
			});
		} catch (e) {
			// console.log(e)
			return e.code;
		}
	},
};

async function body(abi, body, internal = true) {
	try {
		return await TonClient.default.abi.decode_message_body({
			abi: abiContract(abi),
			body: body,
			is_internal: internal,
		});
	} catch (e) {
		console.log(e);
		return e.code;
	}
}

async function _body(abi, body, internal = true) {
	try {
		return await TonClient.default.abi.decode_message_body({
			abi: abiContract(abi),
			body: body,
			is_internal: internal,
		});
	} catch (e) {
		console.log(e);
		return e.code;
	}
}

export async function getDetailsFromTokenRoot(address) {
	const rootAcc = new Account(RootTokenContract, {address: address, client});

	let rootDetails = await rootAcc.runLocal("getDetails", {_answer_id: 0});
	// console.log("rootDetailsNorm", rootDetailsNorm)

	return {
		name: rootDetails.decoded.output.value0.name,
		symbol: rootDetails.decoded.output.value0.symbol,
		total_supply: rootDetails.decoded.output.value0.total_supply,
		decimals: rootDetails.decoded.output.value0.decimals,
	};
}
export async function getExpectedWalletAddressByOwner(rootAddress, toAddress) {
	const rootAcc = new Account(RootTokenContract, {
		address: rootAddress,
		client,
	});

	let walletAddress = await rootAcc.runLocal("getWalletAddress", {
		_answer_id: 0,
		wallet_public_key_: 0,
		owner_address_: toAddress,
	});
	console.log(
		"walletAddress.decoded.output.value0.address",
		walletAddress.decoded.output,
	);
	return {
		name: walletAddress.decoded.output.value0,
	};
}
export async function getRootFromTonWallet(address) {
	const tokenWalletAcc = new Account(TONTokenWalletContract, {
		address: address,
		client,
	});

	let tokenWalletDetails = await tokenWalletAcc.runLocal("root_address", {});
	return tokenWalletDetails.decoded.output.value0.root_address;
}

export async function getDetailsFromTONtokenWallet2(address) {
	console.log("address", address);
	const tokenWalletAcc = new Account(TONTokenWalletContract, {
		address: address,
		client,
	});
	try {
		let tokenWalletDetails = await tokenWalletAcc.runLocal("getDetails", {
			_answer_id: 0,
		});
		console.log(
			"atokenWalletDetails.decoded.output.value0.root_addressddress",
			tokenWalletDetails,
		);

		return tokenWalletDetails.decoded.output;
	} catch (e) {
		console.log("eee", e);
		return e;
	}
}

export async function getDetailsFromTONtokenWallet(address) {
	console.log("address", address);
	const tokenWalletAcc = new Account(TONTokenWalletContract, {
		address: address,
		client,
	});
	try {
		let tokenWalletDetails = await tokenWalletAcc.runLocal("getDetails", {
			_answer_id: 0,
		});
		console.log(
			"atokenWalletDetails.decoded.output.value0.root_addressddress",
			tokenWalletDetails,
		);
		if (!tokenWalletDetails.decoded.output.value0.root_address) {
			return undefined;
		}
		return tokenWalletDetails.decoded.output.value0.root_address;
	} catch (e) {
		console.log("eee", e);
		return e;
	}
}

// // const transListReceiveTokens = useSelector(state => state.walletReducer.transListReceiveTokens);
// export async function subscribeClientBalanceForTips(address) {
//
//     let subscribeID = (await client.net.subscribe_collection({
//         collection: "messages",
//         filter: {
//             dst: {eq: address},
//         },
//         result: "id created_at src value",
//     }, async (params, responseType) => {
//         // console.log("params balance", params.result.balance, typeof params.result.balance, Number(params.result.balance))
//
//         console.log("paramsparams", params)
//
//         if(Number(params.result.value) === 0)return
//         // store.dispatch(setTips(
//         //     {
//         //         name:"getTons",
//         //         message: `you get ${Number(params.result.value)} from ${params.result.src}`,
//         //         tonLiveID: params.result.id,
//         //         created_at: params.result.created_at,
//         //         type: "info",
//         //         src:params.result.src,
//         //         amount:Number(params.result.value)
//         //     }
//         // ))
//
//
//         // store.dispatch(setTips({message:`you get ${Number(params.result.balance) / 1000000000}`,type:"info"}))
//
//     })).handle;
//     console.log("status subscribedAddress: address")
//
// }

export async function subscribeClientBalance(address) {
	let subscribeID = (
		await client.net.subscribe_collection(
			{
				collection: "accounts",
				filter: {
					id: {eq: address},
				},
				result: "balance",
			},
			async (params, responseType) => {
				console.log(
					"params balance",
					params.result.balance,
					typeof params.result.balance,
					Number(params.result.balance),
				);
				if (!params.result.balance) return;
				// if(!checkMessagesAmountClient({tonLiveID:params.result.id}))return

				store.dispatch(
					setUpdatedBalance(Number(params.result.balance) / 1000000000),
				);

				let checkedDuple = {
					name: "UpdateBalanceTONs",
					created_at: params.result.created_at || "default",
					tonLiveID: params.result.id || "default",
				};

				let transactionData = {
					amount: Number(params.result.value) || "default",
					src: params.result.src || "default",
				};
				store.dispatch(
					setTips({
						message: `Your balance updated ${
							Number(params.result.balance) / 1000000000
						}`,
						type: "info",
						...checkedDuple,
						...transactionData,
					}),
				);
			},
		)
	).handle;
	console.log("status subscribedAddress: address");
}

const transactionTypes = {
	0: "Swap",
};

export async function subscribeClient(address) {
	let subscribeID = (
		await client.net.subscribe_collection(
			{
				collection: "messages",
				filter: {
					dst: {eq: address},
				},
				limit: 1,
				order: [{path: "created_at", direction: "DESC"}],
				result: "id boc created_at body dst src",
			},
			async (params, responseType) => {
				console.log("client params ONLY", params);
				if (responseType === ResponseType.Custom) {
					let decoded = await decode.message(
						DEXRootContract.abi,
						params.result.boc,
					);
					if (decoded === 304) {
						decoded = await decode.message(
							RootTokenContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							TONTokenWalletContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							SafeMultisigWallet.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							DEXPairContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							DEXClientContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							DEXConnectorContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							NftRootContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							LockStakeSafeContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(DataContract.abi, params.result.boc);
					}
					console.log("client params22222", params, "decoded22222", decoded);

					// if (decoded.name === "getTons") {
					//
					//     let checkedDuple = {
					//         name: decoded.name,
					//         created_at: params.result.created_at || "default",
					//         tonLiveID: params.result.id || "default",
					//     }
					//
					//     let transactionData = {
					//         amount: Number(params.result.value) || "default",
					//         src: params.result.src || "default"
					//     }
					//     store.dispatch(setTips(
					//         {
					//             message: `You get ${transactionData.amount} TONs`,
					//             type: "info",
					//             ...checkedDuple,
					//             ...transactionData
					//         }
					//     ))
					// }

					if (decoded.name === "connectRoot") {
						const rootData = await getDetailsFromTokenRoot(decoded.value.root);

						let checkedDuple = {
							name: decoded.name,
							created_at: params.result.created_at || "default",
							tonLiveID: params.result.id || "default",
						};
						let transactionData = {
							token_name: hex2a(rootData.name) || "default",
							token_symbol: hex2a(rootData.symbol) || "default",
						};
						store.dispatch(
							setTips({
								message: `You deployed ${transactionData.token_name} wallet`,
								type: "info",
								...checkedDuple,
								...transactionData,
							}),
						);
					}
					if (decoded.name === "sendTransaction") {
						if (!checkMessagesAmountClient({tonLiveID: params.result.id}))
							return;
						let checkedDuple = {
							name: decoded.name,
							created_at: params.result.created_at || "default",
							tonLiveID: params.result.id || "default",
						};
						let transactionData = {
							dest: decoded.value.dest,
							value: decoded.value.value,
						};
						store.dispatch(
							setTips({
								message: `You send ${
									Number(transactionData.value) / 1000000000
								} TONs`,
								type: "info",
								...checkedDuple,
								...transactionData,
							}),
						);
					}

					if (decoded.name === "sendTokens") {
						console.log("send tokens callback");
						const rootData = await getDetailsFromTokenRoot(
							decoded.value.tokenRoot,
						);

						let callbackData = {
							name: decoded.name,
							token_root: decoded.value.tokenRoot || "default",
							updated_balance: decoded.value.updated_balance || "default",
							amount:
								+decoded.value.tokens / getDecimals(rootData.decimals) ||
								"default",
							dst: decoded.value.to || "default",
							created_at: params.result.created_at || "default",
							tonLiveID: params.result.id || "default",
							token_name: hex2a(rootData.name) || "default",
							token_symbol: hex2a(rootData.symbol) || "default",
						};

						console.log("send callbackData", callbackData);
						store.dispatch(
							setTips({
								message: `You send ${callbackData.amount.toFixed(4)} ${
									callbackData.token_name
								}`,
								type: "info",
								...callbackData,
							}),
						);
					}

					if (decoded.name === "deployLockStakeSafeCallback") {
						let checkedDuple = {
							name: decoded.name,
							payload: "default",
							sender_address: decoded.value.sender_address || "default",
							sender_wallet: decoded.value.sender_wallet || "default",
							token_wallet: decoded.value.token_wallet || "default",
							token_root: decoded.value.token_root || "default",
							updated_balance: decoded.value.updated_balance || "default",
							amount: decoded.value.amount || "default",
							created_at: params.result.created_at || "default",
							tonLiveID: params.result.id || "default",
							// token_name: hex2a(rootD.name) || "default",
							// token_symbol: hex2a(rootD.symbol) || "default"
						};
						store.dispatch(
							setTips({
								message: `You stake to dePool ${
									Number(checkedDuple.amount) / 1000000000
								} TONs`,
								type: "info",
								...checkedDuple,
							}),
						);
					}

					if (decoded.name === "returnLiquidityCallback") {
						let checkedDuple = {
							name: decoded.name,
							created_at: params.result.created_at || "default",
							tonLiveID: params.result.id || "default",
						};

						const rootAaddress = await getDetailsFromTONtokenWallet(
							decoded.value.walletA,
						);
						const rootBaddress = await getDetailsFromTONtokenWallet(
							decoded.value.walletB,
						);
						const rootABaddress = await getDetailsFromTONtokenWallet(
							decoded.value.walletAB,
						);

						const rootAdetails = await getDetailsFromTokenRoot(rootAaddress);
						const rootBdetails = await getDetailsFromTokenRoot(rootBaddress);
						const rootABdetails = await getDetailsFromTokenRoot(rootABaddress);

						const provideData = {
							returnA:
								Number(decoded.value.returnA) /
								getDecimals(rootAdetails.decimals),
							returnB:
								Number(decoded.value.returnB) /
								getDecimals(rootBdetails.decimals),
							burnAB: Number(decoded.value.burnAB) / 1000000000,
							walletA: decoded.value.walletA,
							tokenAsymbol: hex2a(rootAdetails.symbol),
							tokenAname: hex2a(rootAdetails.name),
							walletB: decoded.value.walletB,
							tokenBsymbol: hex2a(rootBdetails.symbol),
							tokenBname: hex2a(rootBdetails.name),
							walletAB: decoded.value.walletAB,
							tokenABsymbol: hex2a(rootABdetails.symbol),
							tokenABname: hex2a(rootABdetails.name),
						};
						store.dispatch(
							setTips({
								message: `You return ${provideData.returnA.toFixed(4)} ${
									provideData.tokenAname || "def"
								} and ${provideData.returnB.toFixed(4)} ${
									provideData.tokenBname || "def"
								} payed ${provideData.burnAB.toFixed(6)} ${
									provideData.tokenABname || "def"
								}`,
								type: "info",
								...checkedDuple,
								...provideData,
							}),
						);
					}

					if (decoded.name === "processLiquidityCallback") {
						let checkedDuple = {
							name: decoded.name,
							created_at: params.result.created_at || "default",
							tonLiveID: params.result.id || "default",
						};

						const rootAaddress = await getDetailsFromTONtokenWallet(
							decoded.value.walletA,
						);
						const rootBaddress = await getDetailsFromTONtokenWallet(
							decoded.value.walletB,
						);
						const rootABaddress = await getDetailsFromTONtokenWallet(
							decoded.value.walletAB,
						);

						const rootAdetails = await getDetailsFromTokenRoot(rootAaddress);
						const rootBdetails = await getDetailsFromTokenRoot(rootBaddress);
						const rootABdetails = await getDetailsFromTokenRoot(rootABaddress);

						//
						// // console.log("hereii", curWalletData)
						//                 itemData.walletAddress = item[1];
						//                 itemData.symbol = hex2a(curRootData.decoded.output.value0.symbol);
						//                 itemData.tokenName = getFullName(itemData.symbol)
						//                 itemData.type = "PureToken"
						//                 itemData.owner_address = curWalletData.decoded.output.value0.owner_address
						//                 itemData.decimals = curRootData.decoded.output.value0.decimals
						//                 itemData.icon = iconGenerator(itemData.symbol)
						//                 itemData.rootAddress = curWalletData.decoded.output.value0.root_address;
						//                 itemData.balance = +curWalletData.decoded.output.value0.balance / getDecimals(curRootData.decoded.output.value0.decimals);

						const provideData = {
							amountA:
								Number(decoded.value.amountA) /
								getDecimals(rootAdetails.decimals),
							amountB:
								Number(decoded.value.amountB) /
								getDecimals(rootBdetails.decimals),
							amountAB: Number(decoded.value.mintAB) / 1000000000,
							provideA:
								Number(decoded.value.provideA) /
								getDecimals(rootAdetails.decimals),
							provideB:
								Number(decoded.value.provideB) /
								getDecimals(rootBdetails.decimals),
							unusedReturnA:
								Number(decoded.value.unusedReturnA) /
								getDecimals(rootAdetails.decimals),
							unusedReturnB:
								Number(decoded.value.unusedReturnB) /
								getDecimals(rootBdetails.decimals),
							walletA: decoded.value.walletA,
							tokenAsymbol: hex2a(rootAdetails.symbol),
							tokenAname: hex2a(rootAdetails.name),
							walletB: decoded.value.walletB,
							tokenBsymbol: hex2a(rootBdetails.symbol),
							tokenBname: hex2a(rootBdetails.name),
							walletAB: decoded.value.walletAB,
							tokenABsymbol: hex2a(rootABdetails.symbol),
							tokenABname: hex2a(rootABdetails.name),
						};
						store.dispatch(
							setTips({
								message: `You provided ${provideData.amountA.toFixed(4)} ${
									provideData.tokenAname || "def"
								} and ${provideData.amountB.toFixed(4)} ${
									provideData.tokenBname || "def"
								} for ${provideData.amountAB.toFixed(6)} ${
									provideData.tokenABname || "def"
								}`,
								type: "info",
								...checkedDuple,
								...provideData,
							}),
						);
					}

					if (decoded.name === "transferOwnershipCallback") {
						let checkedDuple = {
							name: decoded.name,
							created_at: params.result.created_at || "default",
							tonLiveID: params.result.id || "default",
						};
						const lockStakeData = await getDetailsFromDataContract(
							params.result.src,
						);
						if (lockStakeData.addrOwner === address) {
							store.dispatch(
								setTips({
									message: `You get lock stake ${
										+lockStakeData.amountLockStake / 1000000000
									} TONs`,
									type: "info",
									...checkedDuple,
									...lockStakeData,
								}),
							);
						}

						if (lockStakeData.addrOwner !== address) {
							store.dispatch(
								setTips({
									message: `You send lock stake ${
										+lockStakeData.amountLockStake / 1000000000
									} TONs`,
									type: "info",
									...checkedDuple,
									...lockStakeData,
								}),
							);
						}
					}

					if (decoded.name === "tokensReceivedCallback") {
						console.log("client para", params, "decoded22222", decoded);
						const decodedPayl = await decodePayload(decoded.value.payload);

						const payloadFlag = Number(decodedPayl.arg0);
						console.log("fkn payload", decodedPayl.arg0);
						if (!checkMessagesAmountClient({tonLiveID: params.result.id}))
							return;
						const rootD = await getDetailsFromTokenRoot(
							decoded.value.token_root,
						);
						console.log("rootD", rootD);

						let checkedDuple = {
							name: decoded.name,
							payload: decodedPayl,
							sender_address: decoded.value.sender_address || "default",
							sender_wallet: decoded.value.sender_wallet || "default",
							token_wallet: decoded.value.token_wallet || "default",
							token_root: decoded.value.token_root || "default",
							updated_balance: decoded.value.updated_balance || "default",
							amount:
								decoded.value.amount / getDecimals(rootD.decimals) || "default",
							created_at: params.result.created_at || "default",
							tonLiveID: params.result.id || "default",
							token_name: hex2a(rootD.name) || "default",
							token_symbol: hex2a(rootD.symbol) || "default",
						};
						console.log("checkedDuple", checkedDuple);

						if (payloadFlag === 0) {
							console.log("decodedPayl.arg0 === 0");
							const rootAddressA = await getDetailsFromTONtokenWallet(
								decodedPayl.arg1,
							);
							const rootAddressB = await getDetailsFromTONtokenWallet(
								decodedPayl.arg2,
							);

							const rootAdet = await getDetailsFromTokenRoot(rootAddressA);
							const rootBdet = await getDetailsFromTokenRoot(rootAddressB);

							const transactionData = {
								transactionType: transactionTypes[0],
								tokenAsymbol: hex2a(rootAdet.symbol),
								tokenAname: hex2a(rootAdet.name),
								amountA:
									+decodedPayl.arg3 / getDecimals(Number(rootAdet.decimals)),
								tokenBsymbol: hex2a(rootBdet.symbol),
								tokenBname: hex2a(rootBdet.name),
								amountB:
									+decodedPayl.arg4 / getDecimals(Number(rootBdet.decimals)),
							};
							store.dispatch(
								setTips({
									message: `You swapped ${transactionData.amountA.toFixed(4)} ${
										transactionData.tokenAname
									} for ${transactionData.amountB.toFixed(4)} ${
										transactionData.tokenBname
									}`,
									type: "info",
									...checkedDuple,
									...transactionData,
								}),
							);
						} else if (payloadFlag === 8) {
							store.dispatch(
								setTips({
									message: `Something went wrong, swap failed`,
									type: "error",
									...checkedDuple,
								}),
							);
						} else if (payloadFlag === 1) {
							console.log("decodedPayl.arg0 === 1");

							store.dispatch(
								setTips({
									message: `Someone send y ${checkedDuple.amount} ${hex2a(
										rootD.name,
									)}`,
									type: "info",
									...checkedDuple,
								}),
							);
						} else if (payloadFlag === 2) {
							console.log("decodedPayl.arg0 === 2");

							store.dispatch(
								setTips({
									message: `This one was your change ${
										checkedDuple.amount
									} ${hex2a(rootD.name)}`,
									type: "info",
									...checkedDuple,
								}),
							);
						}
						// else if(payloadFlag ===7) {
						//         console.log("decodedPayl.arg0 === 3")
						//
						//         store.dispatch(setTips(
						//                 {
						//                     message: `You provide liquidity`,
						//                     type: "info",
						//                     ...checkedDuple
						//                 }
						//             ))
						//
						//     }
						else if (payloadFlag === 9) {
							console.log("decodedPayl.arg0 === 3");

							store.dispatch(
								setTips({
									message: `Provide liquidity was unsuccessful`,
									type: "info",
									...checkedDuple,
								}),
							);
						}
						// else if(payloadFlag ===6) {
						//         console.log("decodedPayl.arg0 === 3")
						//
						//         store.dispatch(setTips(
						//             {
						//                 message: `You return liquidity and get ${(Number(decoded.value.amount) / 1000000000).toFixed(4)} ${hex2a(rootD.name)}`,
						//                 type: "info",
						//                 ...checkedDuple
						//             }
						//         ))
						//
						//     }
						else if (payloadFlag === 4) {
							console.log("decodedPayl.arg0 === 3");

							store.dispatch(
								setTips({
									message: `You receive ${checkedDuple.amount.toFixed(
										4,
									)} ${hex2a(rootD.name)}`,
									type: "info",
									...checkedDuple,
								}),
							);
						}

						// {body_type: 'Input', name: 'transferOwnershipCallback', value: {…}, header: null}
						// body_type: "Input"
						// header: null
						// name: "transferOwnershipCallback"
						// value:
						//     addrFrom: "0:18d4d2924826306634e811344ec217d621bafc55376d9653bbba2e59c2f5914d"
						// addrTo: "0:13bf1c036e1114ed956beb5014d383f81f5b559783c1d3b88220168659fd46bf"

						// store.dispatch(setSubscribeReceiveTokens(data))
					}
				}
			},
		)
	).handle;
	console.log("SUBSCRIBED TO client", address);
	return {status: "success", subscribedAddress: address};
}

let checkerArrClient = [];
let checkMessagesAmountClient = function (messageID) {
	for (let i = 0; i < checkerArrClient.length; i++) {
		if (checkerArrClient[i].tonLiveID === messageID.tonLiveID) {
			return false;
		}
	}
	checkerArrClient.push(messageID);
	return messageID;
};

export async function decodePayload(payload) {
	try {
		const RootContract = new Account(DEXRootContract, {
			address: Radiance.networks["2"].dexroot,
			client,
		});

		let response = await RootContract.runLocal("encodePayload", {
			payload: payload,
		});
		let args = response.decoded.output;
		console.log("args", args);
		return args;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function subscribe(address) {
	let subscribeID = (
		await client.net.subscribe_collection(
			{
				collection: "messages",
				filter: {
					dst: {eq: address},
				},
				limit: 1,
				order: [{path: "created_at", direction: "DESC"}],
				result: "id boc created_at body dst src",
			},
			async (params, responseType) => {
				if (responseType === ResponseType.Custom) {
					let decoded = await decode.message(
						DEXRootContract.abi,
						params.result.boc,
					);
					if (decoded === 304) {
						decoded = await decode.message(
							RootTokenContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							TONTokenWalletContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							SafeMultisigWallet.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							DEXPairContract.abi,
							params.result.boc,
						);
					}
					if (decoded === 304) {
						decoded = await decode.message(
							DEXClientContract.abi,
							params.result.boc,
						);
					}
					// if (decoded === 304) {
					//     decoded = await decode.message(DEXConnectorContract.abi, params.result.boc)
					// }
					// if (decoded === 304) {
					//     decoded = await decode.message(NftRootContract.abi, params.result.boc)
					// }
					// if (decoded === 304) {
					//     decoded = await decode.message(LockStakeSafeContract.abi, params.result.boc)
					// }
					// if (decoded === 304) {
					//     decoded = await decode.message(DataContract.abi, params.result.boc)
					// }
					console.log("client params22", params, "decoded22", decoded);

					// body_type: "Input"
					// header: null
					// name: "transfer"
					// value:
					//     grams: "0"
					// notify_receiver: true
					// payload: "te6ccgEBAQEARgAAhwSAHaw4JyVB1BdbgVqmpdqgp7/SDOXmgqzuWQfcXG0XarVQA5xIn49B62ipBB9eE+yKa8oneTD6IEzagGU0ErBurcKi"
					// send_gas_to: "0:ed61c1392a0ea0badc0ad5352ed5053dfe90672f34156772c83ee2e368bb55aa"
					// to: "0:e4f70a93edaab31c123ef543ae18879c083b850c4e4bcd91e3ec95eac9df36de"

					if (decoded.name === "transfer") {
						if (!checkMessagesAmountClient({tonLiveID: params.result.id}))
							return;

						const rootAddress = await getDetailsFromTONtokenWallet(
							decoded.value.to,
						);
						console.log("rootAddress", rootAddress);
						const rootD = await getDetailsFromTokenRoot(rootAddress);
						console.log("rootD", rootD);
						let checkedDuple = {
							name: decoded.name,
							dst: decoded.value.to || "default",
							token_root: rootAddress || "default",
							amount: decoded.value.tokens || "default",
							created_at: params.result.created_at || "default",
							tonLiveID: params.result.id || "default",
							token_name: hex2a(rootD.name) || "default",
							token_symbol: hex2a(rootD.symbol) || "default",
						};
						// const data = JSON.parse(localStorage.getItem("setSubscribeReceiveTokens"))
						// // const transactionsLast = JSON.parse(JSON.stringify(transListReceiveTokens))
						// // const toState = checkMessagesAmountClient(checkedDuple)
						// data.push(checkedDuple)

						// store.dispatch(setSubscribeReceiveTokens(data))
						// store.dispatch(setTips(
						//     {
						//         message: `you send ${Number(decoded.value.tokens) / 1000000000} ${hex2a(rootD.symbol)}`,
						//         type: "info",
						//         ...checkedDuple
						//     }
						// ))
					}

					if (decoded.name === "accept") {
						if (params.result.src !== Radiance.networks[2].rootWTONAddr) return;
						if (!checkMessagesAmountClient({tonLiveID: params.result.id}))
							return;

						console.log("I am wton and i am here");
						let d = await getDetailsFromTokenRoot(params.result.src);

						const acceptedPairTokens = {
							name: "acceptedPairTokens",
							transactionID: params.result.id,
							src: params.result.src,
							dst: params.result.dst,
							created_at: params.result.created_at,
							amount: Number(decoded.value.tokens) / getDecimals(d.decimals),
							token_name: hex2a(d.name),
							token_symbol: hex2a(d.symbol),
						};
						// const dataFromStorage = JSON.parse(localStorage.getItem("acceptedPairTokens")) || []
						// dataFromStorage.push(acceptedPairTokens)
						// store.dispatch(setAcceptedPairTokens(dataFromStorage))

						console.log("acceptedPairTokens", acceptedPairTokens);
						store.dispatch(
							setTips({
								message: `You get ${acceptedPairTokens.amount.toFixed(
									4,
								)} ${hex2a(d.name)}`,
								type: "info",
								...acceptedPairTokens,
							}),
						);
					}
					// console.log("decoded",decoded,"params",params)
					//
					//             if(decoded.value && decoded.value.grams){
					//                 return null
					//             }
					//             let caseID = await checkMessagesAmount({transactionID:params.result.id, src:params.result.src,dst:params.result.dst,created_at:params.result.created_at, amountOfTokens: decoded.value.tokens})
					//             if(caseID && caseID.dst) store.dispatch(setSubscribeData(caseID));
				}
			},
		)
	).handle;
	console.log({status: "success", subscribedAddress: address});
	return {status: "success", subscribedAddress: address};
}

let checkerArr = [];
let checkMessagesAmount = function (messageID) {
	for (let i = 0; i < checkerArr.length; i++) {
		if (checkerArr[i].transactionID === messageID.transactionID) {
			return null;
		}
	}
	checkerArr.push(messageID);
	return messageID;
};

export async function getPairsTotalSupply(pairAddress) {
	const acc = new Account(DEXPairContract, {address: pairAddress, client});
	try {
		const response = await acc.runLocal("totalSupply", {});
		return response.decoded.output.totalSupply;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function pairs(clientAddress) {
	console.log("clientAddress -------------", clientAddress);
	const acc = new Account(DEXClientContract, {address: clientAddress, client});
	try {
		const response = await acc.runLocal("pairs", {});
		let pairsC = response.decoded.output.pairs;
		console.log("pairs", pairsC);
		return pairsC;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function getClientAddrAtRootForShard(pubkey, n) {
	const acc = new Account(DEXRootContract, {
		address: Radiance.networks["2"].dexroot,
		client,
	});
	try {
		const response = await acc.runLocal("getClientAddress", {
			_answer_id: 0,
			clientPubKey: "0x" + pubkey,
			clientSoArg: n,
		});
		let value0 = response.decoded.output.value0;
		console.log("value0", value0);
		return value0;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function getsoUINT(clientAddress) {
	console.log("clientAddress", clientAddress);
	const acc = new Account(DEXClientContract, {address: clientAddress, client});
	try {
		console.log("sstrt");
		const response = await acc.runLocal("soUINT", {});
		console.log("response", response);
		let soUINTC = response.decoded.output.soUINT;
		console.log("soUINTC", soUINTC);
		return soUINTC;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function getAllDataPrep(clientAddress) {
	const acc = new Account(DEXClientContract, {address: clientAddress, client});
	try {
		const response = await acc.runLocal("getAllDataPreparation", {});
		console.log("response get all data", response);
		return response.decoded.output;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function getAllDataPreparation(clientAddress) {
	const acc = new Account(DEXClientContract, {address: clientAddress, client});
	try {
		const response = await acc.runLocal("rootWallet", {});
		return response.decoded.output.rootWallet;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function getConnectors(rootAddress) {
	const acc = new Account(DEXClientContract, {address: rootAddress, client});
	try {
		const response = await acc.runLocal("rootConnector", {});
		return response.decoded.output.rootConnector;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function getSouint(connectorAddress) {
	const accConnector = new Account(DEXConnectorContract, {
		address: connectorAddress,
		client,
	});
	try {
		const response = await accConnector.runLocal("soUINT", {});
		const response2 = await accConnector.runLocal("statusConnected", {});
		console.log(
			"response2.decoded.output.soUINT",
			response2.decoded.output.statusConnected,
		);
		return response.decoded.output.soUINT;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function checkSouint(clientAddress) {
	try {
		let connectorsArr = await getConnectors(clientAddress);
		let souintArr = [];
		for (const item of Object.values(connectorsArr)) {
			let BIValue = Number(await getSouint(item));
			souintArr.push(BIValue);
		}

		console.log("sountArr", souintArr.filter((item) => item === 39).length);
		return souintArr;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

const secretKeys = {
	"0:8ed631b2691e55ddc65065e0475d82a0b776307797b31a2683a3af7b5c26b984": {
		public: "0ce403a4a20165155788f0517d1a455b4f1e82899f3782fadcf07413b2a56730",
		secret: "e91e2e4e61d35d882a478bb21f77184b9aca6f93faedf6ed24be9e9bf032ef55",
	},
	"0:d214d4779f63e062569a39d414a98c9891cf5e97cc790a3e6c62ce5fd0a5e1c9": {
		public: "cdc97359b239a115d61364526052da837a85d396fa7cca76da015942657c9fad",
		secret: "f5a05c6211db62ff076fb25a7c349033123f2a0b9aea97b673f2b83e378b3824",
	},
	"0:0fa9e2a9993f55f41c90b050468f2f7909a391b7de3cb1b3df74bf449b4dae4c": {
		public: "f574ac4095a3d3d8b267e4300bac4825ece723ed2569238a860149b683201a5c",
		secret: "96975ca89e99116a97a4850f0cc962e8d2630a80e4568d76b8e2f94a7addf312",
	},
	"0:d1828255dc48d7db45e9e36c6ef5852319ecb6376bf95bf4e7c1a77d9f3590e0": {
		public: "04a88959a0b1b1655894343714ce7bc7c516c8195407ab6c8de8b64c92e7f172",
		secret: "cd69d372dacd5f8fd0f8e6db120205bb128507df76b02064f6d01d90e8e3be04",
	},
};

export async function mintTokens(walletAddress, clientAddress) {
	const countToken = 100;
	const rootData = await getAllDataPreparation(clientAddress.dexclient);
	let rootAddress = "";
	for (let walletId in rootData) {
		if (rootData.hasOwnProperty(walletId)) {
			let wallet = rootData[walletId];
			if (wallet === walletAddress) rootAddress = walletId;
		}
	}
	console.log("rootData", rootData);
	const signer = signerKeys(secretKeys[rootAddress]);

	const curRootContract = new Account(RootTokenContract, {
		address: rootAddress,
		signer,
		client,
	});
	let usersGiver = [];
	if (localStorage.getItem("usersGiver") === null) {
		localStorage.setItem("usersGiver", JSON.stringify(usersGiver));
	} else usersGiver = JSON.parse(localStorage.getItem("usersGiver"));
	console.log("rootData[rootAddress]", rootData[rootAddress]);
	if (usersGiver.includes(rootData[rootAddress]) === false) {
		await transferFromGiver(rootData[rootAddress], 120000000);
		usersGiver.push(rootData[rootAddress]);
	}
	localStorage.setItem("usersGiver", JSON.stringify(usersGiver));

	let resf = await curRootContract
		.run("mint", {
			tokens: countToken * 1e9,
			to: rootData[rootAddress],
		})
		.catch((e) => {
			console.log("token giver error", e);
			return e;
		});
	console.log("resf", resf);
}

/*
 **** WALLET****
 */
const RootCodeHash =
	"5020feaf723931a07921b97696fba4212ce3c60d70ca18a8b7ede24a33313aae";

let RootCodeHashmyCode =
	"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";



export async function getAssetsForDeploy() {
	// const rootAddresses = [];
	// let minBalance = 0
	// const arrPart = await queryRoots(minBalance.toString())
	// const arrPart2 = await queryRoots(arrPart[49].balance.toString())
	// const arrPart3 = await queryRoots(arrPart2[49].balance.toString())
	// const arrPart4 = await queryRoots(arrPart3[49].balance.toString())
	// const arrPart5 = await queryRoots(arrPart4[49].balance.toString())
	// const arrPart6 = await queryRoots(arrPart5[49].balance.toString())
	// rootAddresses.push(...arrPart,...arrPart2,...arrPart3,...arrPart4,...arrPart5,...arrPart6)


	// let rootAddresses = [
	// 	{id: "0:b129553a53652983183374f5beb4652268641325726eccbb81feb5e98be0eef6"},
	// 	{id: "0:dccb2920d677e2587c79cb9b479d28d8ddd2bbfe0202dc7dc537b5406d32569a"},
	// 	{id: "0:2397e4d02332dd23108974e6103d56864ae0571db86cb195f542159ea5754344"},
	// 	{id: "0:e887fbbf4ba3f0c06b7a9ca6d2bf097a6a85affedd1610c5c0a8d159bfd7d049"},
	// 	{id: "0:6f45817be9283ae9828181dd454ea73a3330d9e2ba4610a6623dbbcdf6552995"},
	// 	{id: "0:7d58a33a03bfdb2aac393b15a2c9767ea194006c53278fd63046a946f437b81b"},
	// ]

/*
	DONT DELETE
		// wton 0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37
		// uni 0:471c9d737254a0044695c7e50ec5b8f6f94eadd49511b298d4a331b95106652b
		// weth 0:45f682b7e783283caef3f268e10073cf08842bce20041d5224c38d87df9f2e90
		// dai 0:95934aa6a66cb3eb211a80e99234dfbba6329cfa31600ce3c2b070d8d9677cef
		// usdt 0:751b6e22687891bdc1706c8d91bf77281237f7453d27dc3106c640ec165a2abf
		// usdc 0:1ad0575f0f98f87a07ec505c39839cb9766c70a11dadbfc171f59b2818759819
		// wbtc 0:6e76bccb41be2210dc9d7a4d0f3cbf0d5da592d0cb6b87662d5510f5b5efe497
*/

	const rootAddresses = [
		{id:"0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37"},
		{id:"0:471c9d737254a0044695c7e50ec5b8f6f94eadd49511b298d4a331b95106652b"},
		{id:"0:45f682b7e783283caef3f268e10073cf08842bce20041d5224c38d87df9f2e90"},
		{id:"0:95934aa6a66cb3eb211a80e99234dfbba6329cfa31600ce3c2b070d8d9677cef"},
		{id:"0:751b6e22687891bdc1706c8d91bf77281237f7453d27dc3106c640ec165a2abf"},
		{id:"0:1ad0575f0f98f87a07ec505c39839cb9766c70a11dadbfc171f59b2818759819"},
		{id:"0:6e76bccb41be2210dc9d7a4d0f3cbf0d5da592d0cb6b87662d5510f5b5efe497"},

	]

	console.log("rootAddresses",rootAddresses)
	const rootDataArray = [];

	console.log(
		"rootAddresses",
		rootAddresses.filter(
			(item) =>
				item.id ===
				"0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37",
		),
	);

	rootAddresses.map(async (item) => {
		const curRootData = await getDetailsFromTokenRoot(item.id);
		curRootData.tokenName = hex2a(curRootData.name);
		curRootData.symbol = hex2a(curRootData.symbol);
		curRootData.balance = curRootData.total_supply / 1000000000;
		curRootData.icon = iconGenerator(curRootData.symbol);
		curRootData.rootAddress = item.id;
		console.log("curRootData", curRootData);
		rootDataArray.push(curRootData);
	});

	console.log("rootDataArray", rootDataArray);
	return rootDataArray;
}

export async function queryByCode(code) {
	try {
		return (
			await client.net.query_collection({
				collection: "accounts",
				filter: {
					code_hash: {
						eq: code,
					},
					// order: [{path: "created_at", direction: 'DESC'}],
				},

				result: "id",
			})
		).result;
	} catch (error) {
		console.error(error);
	}
}


export async function getCodeHashFromNFTRoot() {
	const acc = new Account(NftRootContract, {
		address: rootAddrNFT,
		client,
	});
	try {
		const response = await acc.runLocal("resolveCodeHashData", {});

		// return response.decoded.output.codeHashData;
		console.log(
			"response.decoded.output.codeHashData.slice(2)",
			response.decoded.output.codeHashData.slice(2),
		);
		return response.decoded.output.codeHashData.slice(2);
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function agregateQueryNFTassets(addrClient) {
	const codeHash = await getCodeHashFromNFTRoot();
	const nftTokenItemAddress = await queryByCode(codeHash);
	console.log("nftTokenItemAddress", nftTokenItemAddress);
	if (!nftTokenItemAddress || !nftTokenItemAddress.length) return;

	const datainfo = [];
	let k = 0;
	for (const item of nftTokenItemAddress) {
		const dataNFT = await getDataInfo(item.id, addrClient);
//todo add type
		if (dataNFT) {
			k++;
			dataNFT["type"] = "DePoolStake";
			dataNFT["symbol"] = "DP";
			dataNFT["tokenName"] = "DP";
			dataNFT["icon"] = salary;
			dataNFT["balance"] = 1;
			dataNFT["showNftData"] = false;
			dataNFT["id"] = k;
			dataNFT["details"] = await getDetailsFromDataContract(dataNFT.addrData);
			datainfo.push({
				...dataNFT,
				...(await getLockStakeSafeInfo(dataNFT._safeLockStake)),
			});
		}
	}

	console.log("datainfo", datainfo);

	return datainfo;
}
export async function getDetailsFromDataContract(address) {
	const accNFTdata = new Account(DataContract, {address: address, client});
	try {
		const dataDetails = await accNFTdata.runLocal("getDetails", {});

		return dataDetails.decoded.output;
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function getLockStakeSafeInfo(address) {
	const acc = new Account(LockStakeSafeContract, {address: address, client});
	try {
		const depoolAddress = await acc.runLocal("depoolAddress", {});
		const depoolFee = await acc.runLocal("depoolFee", {});
		const depoolMinStake = await acc.runLocal("depoolMinStake", {});
		const stakeList = await acc.runLocal("stakeList", {});
		const stakeTotal = await acc.runLocal("stakeTotal", {});
		const withdrawTotal = await acc.runLocal("withdrawTotal", {});
		const onRoundCompleteList = await acc.runLocal("onRoundCompleteList", {});
		const receiveAnswerList = await acc.runLocal("receiveAnswerList", {});
		const onTransferList = await acc.runLocal("onTransferList", {});
		const depoolStakeReturn = await acc.runLocal("depoolStakeReturn", {});
		console.log("stakeTotal", stakeTotal.decoded.output);
		console.log("depoolStakeReturn", depoolStakeReturn.decoded.output);
		console.log("onRoundCompleteList", onRoundCompleteList.decoded.output);
		console.log("receiveAnswerList", receiveAnswerList.decoded.output);
		console.log("onTransferList", onTransferList.decoded.output);
		console.log("depoolStakeReturn", depoolStakeReturn.decoded.output);
		return {
			...depoolAddress.decoded.output,
			...depoolFee.decoded.output,
			...depoolMinStake.decoded.output,
			...stakeList.decoded.output,
			...stakeTotal.decoded.output,
			...withdrawTotal.decoded.output,
			...onRoundCompleteList.decoded.output,
			...receiveAnswerList.decoded.output,
			...onTransferList.decoded.output,
		};
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function getDataInfo(address, addrClient) {
	const accNFTdata = new Account(DataContract, {address: address, client});
	try {
		const getInfo = await accNFTdata.runLocal("getInfo", {});
		const dataOwner = await accNFTdata.runLocal("getOwner", {});
		console.log("dataOwner", dataOwner, "getInfo", getInfo);

		const safeLockStake = await accNFTdata.runLocal("_safeLockStake", {});
		//todo set owner address here
		console.log("addrClient", addrClient);
		if (dataOwner.decoded.output.addrOwner === addrClient) {
			return {...getInfo.decoded.output, ...safeLockStake.decoded.output};
		}
	} catch (e) {
		console.log("catch E", e);
		return e;
	}
}

export async function getCodeHashFromTVC() {
	try {
		const code = (await client.boc.get_code_from_tvc({tvc: DataContract.tvc}))
			.code;

		const hashCode = (await client.boc.get_boc_hash({boc: code})).hash;

		console.log(`SetCode Multisig wallet code hash: ${hashCode}`);
		await queryByCode(hashCode);
		// Your can find all popular Smart contract hash codes at https://ton.live/contracts
	} catch (error) {
		if (error.code === 504) {
			console.error(
				`Network is inaccessible. You have to start TON OS SE using \`tondev se start\`.\n If you run SE on another port or ip, replace http://localhost endpoint with http://localhost:port or http://ip:port in index.js file.`,
			);
		} else {
			console.error(error);
		}
	}
}

const HD_PATH = "m/44'/396'/0'/0/0";

const SEED_PHRASE_WORD_COUNT = 12; //Mnemonic word count
const SEED_PHRASE_DICTIONARY_ENGLISH = 1; //Dictionary identifier
// let phrase = "net drift once march flip pudding palace famous regular grab crack cancel";

export async function getClientKeys(phrase) {
	//todo change with only pubkey returns
	return await client.crypto.mnemonic_derive_sign_keys({
		phrase,
		path: HD_PATH,
		dictionary: SEED_PHRASE_DICTIONARY_ENGLISH,
		word_count: SEED_PHRASE_WORD_COUNT,
	});
}
