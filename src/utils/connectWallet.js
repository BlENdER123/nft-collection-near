import * as nearAPI from "near-api-js";
const { connect } = nearAPI;

export default async function connectWallet() {
  console.log("connect wallet function")
  walletAccount.requestSignIn(
    "", // contract requesting access
    "NFT Marketplace", // optional
    "http://localhost:3006/", // optional
    "http://localhost:3006/how" // optional
  ).then(res => res
    // window.walletAccount = new nearAPI.WalletAccount(window.near);
    //
    // // // Getting the Account ID. If unauthorized yet, it's just empty string.
    // // window.accountId = window.walletAccount.getAccountId();
    //
    // let accID = walletAccount.getAccountId()
    // console.log("accID", accID)
    // return accID
  )
}
