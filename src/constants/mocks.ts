import random from "lodash/random";
import TON from '../images/tokens/ton.png';
import wBTC from '../images/tokens/wBTC.svg';
import wETH from '../images/tokens/wETH.svg';
import DAI from '../images/tokens/DAI.svg';
import USDT from '../images/tokens/wUSDT.svg';

export const tokens = {
  BTC: {
    balance: 0.19999999989,
    decimals: "18",
    icon: wBTC,
    owner_address:
      "0:5ed9bcf6272079ce03e48469f315bccb50fc61de3cfa4a34e1c69992b30b8e2c",
    rootAddress:
      "0:95034aa6t66cb3eb211a80e99234dfbba6329cfa31600ce3c2b070d8d9677cef",
    symbol: "BTC",
    tokenName: "Bitcoin",
    type: "PureToken",
    walletAddress:
      "0:57b5475f23d189f860d21b91fad2b885d410e90f903ab0866576500ef9c0ad7b",
  },
  ETH: {
    balance: 0.889999999989,
    decimals: "18",
    icon: wETH,
    owner_address:
      "0:5ed9bef6272079ce03e48469f315bccb50fc61de3cfa4a34e1c69992b30b8e2c",
    rootAddress:
      "0:95034aa6a66cb3eb211a80e99234dfbba6329cfa31600ce3c2b070d8d9677cef",
    symbol: "ETH",
    tokenName: "Ethereum",
    type: "PureToken",
    walletAddress:
      "0:57b5475f23d185f860d21b91fad2b885d410e90f903ab0866576500ef9c0ad7b",
  },
  DAI: {
    balance: 0.289999999989,
    decimals: "18",
    icon: DAI,
    owner_address:
      "0:5ed9bef6272079ce03e48469f315bccb50fc61de3cfa4a34e1c69992b30b8e2c",
    rootAddress:
      "0:95934aa6a66cb3eb211a80e99234dfbba6329cfa31600ce3c2b070d8d9677cef",
    symbol: "DAI",
    tokenName: "DAI",
    type: "PureToken",
    walletAddress:
      "0:51b5475f23d185f860d21b91fad2b885d410e90f903ab0866576500ef9c0ad7b",
  },
  USDT: {
    balance: 57.922748,
    decimals: "6",
    icon: USDT,
    owner_address:
      "0:533d4ec07d8e610c2cce9e755f90ab75898f46a67c0daa860fb3bfd1774134b1",
    rootAddress:
      "0:751b6e22687891bdc1706c8d91bf77281237f7453d27dc3106c640ec165a2abf",
    symbol: "USDT",
    tokenName: "Tether",
    type: "PureToken",
    walletAddress:
      "0:5eeeba02539217ed8bca327ac23cb3b2da26b51e84df8d842c94a8b2d690f21b",
  },
  TON: {
    balance: 18.371355611,
    decimals: "9",
    icon: TON,
    owner_address:
      "0:5b3b1c2a86941cdb30b925f711034bf3f4430d15d02a696e9242e1a7fcebaba8",
    rootAddress:
      "0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37",
    symbol: "TON",
    tokenName: "Toncoin",
    type: "PureToken",
    walletAddress:
      "0:53489672a1e951f2c1c3c14676a3d5b80031844daf97df6ea355f2e66ebaf731",
  },
};

export const pairs = {
  TON_DAI: {
    exists: true,
    pairAddress:
      "0:50c00629f4a36672608b441c6e5bc3809be782e3bf1faad4e32e18ad0f4c0bdb",
    rateAB: 0.007000000001909091,
    rateBA: 142.8571428181818,
    reserveA: 1571428571,
    reserveB: 11000000,
    rootA: "0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37",
    rootB: "0:95934aa6a66cb3eb211a80e99234dfbba6329cfa31600ce3c2b070d8d9677cef",
    symbolA: "TON",
    symbolB: "DAI",
    totalSupply: "10999999",
  },
  TON_USDC: {
    exists: true,
    pairAddress:
      "0:5c0e22237dce402a4d26573eec1b83f647bd7ad9ba27f93d9684bcf7780f7030",
    rateAB: 0.22326236363636365,
    rateBA: 4.4790352646661935,
    reserveA: 5500000000,
    reserveB: 1227943000,
    rootA: "0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37",
    rootB: "0:1ad0575f0f98f87a07ec505c39839cb9766c70a11dadbfc171f59b2818759819",
    symbolA: "TON",
    symbolB: "USDC",
    totalSupply: "1500000",
  },
};
