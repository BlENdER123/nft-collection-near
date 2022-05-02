import freeton from "freeton";
import "core-js/stable";
import "regenerator-runtime/runtime";
import ton, {
	Address,
	AddressLiteral,
	Contract,
	hasTonProvider,
} from "ton-inpage-provider";
import client from "../webhook/script";
const {Account} = require("@tonclient/appkit");

export async function checkExtensions() {
	return [
		{
			name: "extraton",
			available: await checkExtensionAvailability(),
			link: "https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm",
		},
		{
			name: "broxus",
			available: await hasTonProvider(),
			link: "https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk",
		},
	];
}

async function checkExtensionAvailability() {
	return window.freeton !== undefined;
}

export async function getCurrentExtension(extension) {
	let curExtension = {};
	// if(curExtension.length === 0){
	//     console.log("0000000>>>>>>no extension",curExtension)
	//     extensionsArry[0]._extLib = await extraton()
	//     extensionsArry[0].name = "testing extraton"
	//     return extensionsArry[0]
	// }

	if (extension === "wallet") {
		// curExtension._extLib = await wallet()
	} else if (extension === "extraton") {
		curExtension._extLib = await extraton();
	} else {
		curExtension._extLib = await broxus();
	}

	// if (curExtension.length > 1) {
	//     return curExtension[0]
	// }
	return curExtension;
}

export async function getWalletExt(address, clientPubkey) {
	let curExtenson = {};
	let arr = [];
	curExtenson.name = "wallet";
	curExtenson.available = true;
	curExtenson.link =
		"https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk";

	curExtenson._extLib = await getWalletLib(address, clientPubkey);
	arr.push(curExtenson);

	return arr;
}

async function getWalletLib(address, clientPubkey) {
	const curExtensonLib = {};

	curExtensonLib.name = "wallet";
	curExtensonLib.address = address;
	curExtensonLib.pubkey = clientPubkey;
	curExtensonLib.contract = (contract, contractAddress) => {
		return new Account(contract, {address: contractAddress, client});
	};
	curExtensonLib.runMethod = async (methodName, params, contract) => {
		return await contract.runLocal(methodName, params);
	};
	curExtensonLib.callMethod = async (methodName, params, contract) => {
		return await contract.run(methodName, params);
	};
	// curExtenson.SendTransfer = async (to,amount) => {
	//     let wallet = signer.getWallet()
	//     return await wallet.transfer(to, amount, false,"")
	// }
	return curExtensonLib;
}

async function extraton() {
	const provider = getProvider();
	const signer = await provider.getSigner();

	let curExtenson = {};
	curExtenson.name = "extraton";
	curExtenson.address = signer.wallet.address;
	curExtenson.pubkey = await signer.getPublicKey();
	curExtenson.contract = (contractAbi, contractAddress) => {
		return new freeton.Contract(signer, contractAbi, contractAddress);
	};
	curExtenson.runMethod = async (methodName, params, contract) => {
		return await contract.methods[methodName].run(params);
	};
	curExtenson.callMethod = async (methodName, params, contract) => {
		return await contract.methods[methodName].call(params);
	};
	curExtenson.SendTransfer = async (to, amount) => {
		let wallet = signer.getWallet();
		return await wallet.transfer(to, amount, false, "");
	};
	return curExtenson;
}

function getProvider() {
	return new freeton.providers.ExtensionProvider(window.freeton);
}

async function broxus() {
	await ton.ensureInitialized();
	const {accountInteraction} = await ton.requestPermissions({
		permissions: ["tonClient", "accountInteraction"],
	});
	if (accountInteraction == null) {
		return new Error("Insufficient permissions");
	}
	let curExtenson = {};

	curExtenson.name = "broxus";
	curExtenson.address = accountInteraction.address._address;
	curExtenson.pubkey = accountInteraction.publicKey;
	curExtenson.contract = (contractAbi, contractAddress) => {
		return new Contract(contractAbi, new AddressLiteral(contractAddress));
	};
	curExtenson.runMethod = async (methodName, params, contract) => {
		return await contract.methods[methodName](params).call({
			cachedState: undefined,
		});
	};
	curExtenson.callMethod = async (methodName, params, contract) => {
		return await contract.methods[methodName](params)
			.sendExternal({publicKey: accountInteraction.publicKey})
			.catch((e) => {
				return e;
			});
	};
	curExtenson.internal = async (methodName, params, contract) => {
		return await contract.methods[methodName](params).send({
			from: new Address(curExtenson.address),
			amount: "10000000000",
			bounce: false,
		});
	};
	curExtenson.SendTransfer = async (to, amount) => {
		return await ton.sendMessage({
			sender: curExtenson.address,
			recipient: new Address(to),
			amount: amount,
			bounce: false,
		});
	};

	// const { transaction } = await ton.rawApi.sendMessage({
	//     sender: curExtenson.address,
	//     recipient: new Address(curExtenson.address),
	//     amount: '10000000000',
	//     bounce: false,
	//     payload: {
	//     //   abi: DePoolAbi,
	//     //   method: 'addOrdinaryStake',
	//     //   params: {
	//     //     stake: '10000000000'
	//     //   }
	//     }
	//   });
	console.log(curExtenson);

	return curExtenson;
}
