import * as nearAPI from "near-api-js";

export default async function getAccountData() {
  window.nearConfig = {
    networkId: "default",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
  };

  // Initializing connection to the NEAR DevNet.
  window.near = await nearAPI.connect(
    Object.assign(
      {deps: {keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()}},
      window.nearConfig,
    ),
  );

  window.walletAccount = new nearAPI.WalletAccount(window.near);

  // Getting the Account ID. If unauthorized yet, it's just empty string.
  window.accountId = window.walletAccount.getAccountId();

  return {
    allKeys: walletAccount._authData.allKeys,
    accountId: walletAccount._authData.accountId,
    _authDataKey:walletAccount._authDataKey,
    nfts:walletAccount.nfts,
    config:walletAccount.config,
    _networkId:walletAccount._networkId,
    _walletBaseUrl:walletAccount._walletBaseUrl
  }
}


// _authData:
//   accountId: "anzorb.testnet"
// allKeys: Array(1)
// 0: "ed25519:CoFqzRzYgcFSUwNkEiUixM1VjwKc5wUPeHZFUyJ3bxmY"
// length: 1
//   [[Prototype]]: Array(0)
//   [[Prototype]]: Object
// _authDataKey: "undefined_wallet_auth_key"
// _keyStore: BrowserLocalStorageKeyStore
// localStorage: Storage
// near-api-js:keystore:pending_keyed25519:3C8WA6qwRWfyQ43WY21bcemSuTw9f3rqNatnvMnAANw1:default: "ed25519:4SLneiFE2bbXyM1XmLA55NV1JS6pK69ANVBkcLcbfNoT6JLVuMFv1fXC41WuogXZGLb7DWJhwhUwbRh3Y439DfGj"
// near-api-js:keystore:pending_keyed25519:718rGrb6Lw7rZ4wqS4aKussTRD3DftWVhDdZpa45dhsb:default: "ed25519:3BmXzjgg4fjgXs1mutAFChJyUnqJHUJeVprZCqjFh94tpbhxJBqt1aTy6YF4uqnmKyGmCUSq1EXjRtCZbMAJ3mwj"
// nfts: "[]"
// undefined_wallet_auth_key: "{\"accountId\":\"anzorb.testnet\",\"allKeys\":[\"ed25519:CoFqzRzYgcFSUwNkEiUixM1VjwKc5wUPeHZFUyJ3bxmY\"]}"
// length: 4
//   [[Prototype]]: Storage
// prefix: "near-api-js:keystore:"
//   [[Prototype]]: KeyStore
// _near: Near
// accountCreator: null
// config: {deps: {…}, networkId: 'default', nodeUrl: 'https://rpc.testnet.near.org', walletUrl: 'https://wallet.testnet.near.org'}
// connection: Connection
// networkId: "default"
// provider: JsonRpcProvider {connection: {…}}
// signer: InMemorySigner {keyStore: BrowserLocalStorageKeyStore}
// [[Prototype]]: Object
//   [[Prototype]]: Object
// _networkId: "default"
// _walletBaseUrl: "https://wallet.testnet.near.org"
// Needed to access wallet login