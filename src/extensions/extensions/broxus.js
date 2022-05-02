// import freeton from "freeton";
// // import "core-js/stable";
// // import "regenerator-runtime/runtime";
// import ton, { hasTonProvider,Contract,AddressLiteral,Address } from 'ton-inpage-provider';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { useState, useEffect } from 'react';
//
// const { Account } = require("@tonclient/appkit");
//
// function checkExtensionAvailability() {
//     if (window.freeton === undefined) {
//         console.log("no extraton extension")
//         return false
//     }
//     return true
// }
//
// async function checkExtensions() {
//
//     let extensions = [
//         {
//             current: false,
//             name: "extraton",
//             available : checkExtensionAvailability(),
//             link:"https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm",
//             logo:"./extratonIcon.png"
//         },
//         {
//             current: false,
//             name : "broxus",
//             available : await hasTonProvider(),
//             link:"https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk",
//             logo:"./broxusIcon.png"
//         }
//     ]
//     console.log("extensions",extensions)
//     return extensions
// }
//
// function App() {
//     const [extens, setExtens] = useState([]);
//     async function clickMe() {
//         await checkExtensions().then(res=>
//         {
//             setExtens(res)
//         })
//     }
//     return (
//         <div className="App">
//             <button
//                 style={{
//                     "width": "500px",
//                     "height": "200px",
//                 }}
//                 onClick={()=>clickMe()}>
//                 show extensions array
//             </button>
//         </div>
//     );
// }
//
// export default App;
//
//
//
// function extension(ext) {
//     if (!(await hasTonProvider())) {
//         return;
//     }
//     await ton.ensureInitialized();
//
//     const { accountInteraction } = await ton.api.requestPermissions({
//         permissions: ['tonClient', 'accountInteraction']
//     });
//     if (accountInteraction == null) {
//         throw new Error('Insufficient permissions');
//     }
//
//     const myContract = new Contract(DePoolAbi, new AddressLiteral('0:bbcbf7eb4b6f1203ba2d4ff5375de30a5408a8130bf79f870efbcfd49ec164e9'));
//     await myContract.methods.addOrdinaryStake({
//         stake: '20000000000'
//     }).send({
//         from: new Address(accountInteraction.address),
//         amount: '20500000000',
//         bounce: false
//     }); // will open extension window
//
//     const { transaction, output } = await myContract.methods.setValidatorRewardFraction({
//         fraction: '5'
//     }).sendExternal({
//         publicKey: accountInteraction.publicKey
//     }); // will open extension window
//
//     const { total, reward } = await myContract.methods.getParticipantInfo({
//         addr: new AddressLiteral('0:a921453472366b7feeec15323a96b5dcf17197c88dc0d4578dfa52900b8a33cb')
//     }).call({
//         cachedState: undefined // can be used to reduce network requests
//     });
// }
//
//
//
//
