import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {batch, useDispatch, useSelector} from "react-redux";

import {libWeb} from "@tonclient/lib-web";

const {TonClient} = require("@tonclient/core");

TonClient.useBinaryLibrary(libWeb);

const client = new TonClient({network: {endpoints: ["main.ton.dev"]}});

const pidCrypt = require("pidcrypt");
require("pidcrypt/aes_cbc");

let mnemonic = "";

export async function genSeed(pin) {
	let randMnemonic = await client.crypto.mnemonic_from_random({
		word_count: 12,
	});

	let arr = randMnemonic.phrase.split(" ");
	mnemonic = randMnemonic.phrase;

	console.log("Mnemonic");
	console.log(randMnemonic);

	const aes = new pidCrypt.AES.CBC();

	console.log("crypt");
	let encrypted = aes.encryptText(mnemonic, pin);
	console.log(encrypted);

	return mnemonic;
}

export function encryptSeed(seed, pin) {
	console.log("uncrypt");
	let decrypted = aes.decryptText(seed, pin);
	console.log(decrypted);
}

export async function genKeys(phrase) {
	let keys = await client.crypto.mnemonic_derive_sign_keys({
		phrase,
		path: "m/44'/396'/0'/0/0",
		dictionary: 1,
		word_count: 12,
	});
	console.log(keys);
}

// return(
//     <>
//     <button type="button" onClick={genSeed}>GenSeed</button>
//     <button typr="button" onClick={async()=>genKeys(mnemonic)}>GenKeys</button>
//     <div>
//     </div>
//     </>
// );
