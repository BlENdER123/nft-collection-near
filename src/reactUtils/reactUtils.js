import {setPairsList} from "../store/actions/wallet";
import {store} from "../index";
import {
	checkClientPairExists,
	checkwalletExists,
	getAllPairsWoithoutProvider,
	subscribe,
} from "../extensions/webhook/script";
import {setTips} from "../store/actions/app";

const {setLiquidityList} = require("../store/actions/wallet");
const {setTokenList} = require("../store/actions/wallet");
const {getAllClientWallets} = require("../extensions/webhook/script");

export async function getAllTokensAndSetToStore(clientAddress) {
	let tokenList = await getAllClientWallets(clientAddress);
	let liquidityList = [];
	if (tokenList.length) {
		tokenList.forEach(async (item) => await subscribe(item.walletAddress));
		liquidityList = tokenList.filter((i) => i.symbol.includes("/"));
		tokenList = tokenList.filter((i) => !i.symbol.includes("/"));
		store.dispatch(setTokenList(tokenList));
		store.dispatch(setLiquidityList(liquidityList));
	}
}
const hex = require('ascii-hex');

export async function getAllPairsAndSetToStore(clientAddress) {
	const pairs = await getAllPairsWoithoutProvider();

	let arrPairs = [];
	await pairs.map(async (item) => {
		item.exists = await checkClientPairExists(clientAddress, item.pairAddress);
		item.walletExists = await checkwalletExists(
			clientAddress,
			item.pairAddress,
		);

		arrPairs.push(item);
	});

	store.dispatch(setPairsList(arrPairs));
}

export function copyToClipboard(textToCopy) {
	// navigator clipboard api needs a secure context (https)

	if (navigator.clipboard && window.isSecureContext) {
		// navigator clipboard api method'
		store.dispatch(
			setTips({
				message: `Copied`,
				type: "info",
				transNotSave: true,
			}),
		);
		return navigator.clipboard.writeText(textToCopy);
	} else {
		store.dispatch(
			setTips({
				message: `Copied`,
				type: "info",
				transNotSave: true,
			}),
		);
		// text area method
		let textArea = document.createElement("textarea");
		textArea.value = textToCopy;
		// make the textarea out of viewport
		textArea.style.position = "fixed";
		textArea.style.left = "-999999px";
		textArea.style.top = "-999999px";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		return new Promise((res, rej) => {
			// here the magic happens
			document.execCommand("copy") ? res() : rej();
			textArea.remove();
		});
	}
}
export function calculateRate(stake, percent, period) {
	const years = period / 12;
	console.log("stake", stake, "percent", percent, "years", years);
	const totalProfit = stake * Math.pow(1 + percent / 100, years);
	return totalProfit;
}
export function getDecimals(decimals) {
	let x = "1";
	let decimalsNum = Number(decimals);
	for (let i = 0; i < decimalsNum; i++) {
		x += "0";
	}
	return Number(x);
}
export function getFixedNums(dec, amount) {
	if(dec === 9){
		return amount
	}else if(dec < 9){
		let x = 1;
		for (let i = 0; i < 9 - dec; i++) {
			x *= 10;
		}
		return amount * x;
	}else if(dec > 9){
		let x = 1;
		for (let i = 0; i < dec - 9; i++) {
			x *= 10;
		}
		return amount / x;
	}


}
export function hex2a(hex) {
	let str = "";
	for (let i = 0; i < hex.length; i += 2) {
		let v = parseInt(hex.substr(i, 2), 16);
		if (v) str += String.fromCharCode(v);
	}
	return str;
}
export function getRootSymbol(symbolA,symbolB){
	let upA = symbolA.toUpperCase()
	let upB = symbolB.toUpperCase()
	return `DS-${upA}/${upB}`
}
// export function toBytes(str) {
// 	var bytes = [];
// 	for(var i = 0; i < str.length; i++) {
// 		var char = str.charCodeAt(i);
// 		bytes.push(char >>> 8);
// 		bytes.push(char & 0xFF);
// 	}
// 	return bytes;
// }
export function toHex(input) {
	let output = '';
	for (let i = 0; i < input.length; i ++){output += hex(input[i]).toString(16)}
	return String(output);
}
export function getFraction(num){
	let numStr = num.toString()
	let shouldBeFact = numStr.match(/0.0/)

	console.log(shouldBeFact)
	if(!shouldBeFact) return num
console.log("numStr",numStr)
		let regNumsSub = numStr.match(/[^0]{4}/)

		let regNumsZeros = numStr.match(/^.*0/)

		console.log("regNumsSub", regNumsSub, "regNumsZeros", regNumsZeros)

		return Number(regNumsZeros[0].concat(regNumsSub[0]))

}
