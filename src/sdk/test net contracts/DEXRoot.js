module.exports = {
	DEXRootContract: {
		abi: {
			"ABI version": 2,
			header: ["pubkey", "time", "expire"],
			functions: [
				{
					name: "constructor",
					inputs: [
						{name: "_rootDEX", type: "address"},
						{name: "_souintFor", type: "uint256"},
						{name: "_souintAgainst", type: "uint256"},
						{name: "_gramsToConnector", type: "uint128"},
						{name: "_gramsToRoot", type: "uint128"},
						{name: "_codeConnector", type: "cell"},
					],
					outputs: [],
				},
				{
					name: "setDEXclientCode",
					inputs: [{name: "code", type: "cell"}],
					outputs: [{name: "isSuccess", type: "bool"}],
				},
				{
					name: "setDEXpairCode",
					inputs: [{name: "code", type: "cell"}],
					outputs: [{name: "isSuccess", type: "bool"}],
				},
				{
					name: "setDEXconnectorCode",
					inputs: [{name: "code", type: "cell"}],
					outputs: [{name: "isSuccess", type: "bool"}],
				},
				{
					name: "setRootTokenCode",
					inputs: [{name: "code", type: "cell"}],
					outputs: [{name: "isSuccess", type: "bool"}],
				},
				{
					name: "setTONTokenWalletCode",
					inputs: [{name: "code", type: "cell"}],
					outputs: [{name: "isSuccess", type: "bool"}],
				},
				{
					name: "getClientAddress",
					inputs: [
						{name: "_answer_id", type: "uint32"},
						{name: "clientPubKey", type: "uint256"},
						{name: "clientSoArg", type: "uint256"},
					],
					outputs: [{name: "value0", type: "address"}],
				},
				{
					name: "createDEXclient",
					inputs: [
						{name: "pubkey", type: "uint256"},
						{name: "souint", type: "uint256"},
					],
					outputs: [],
				},
				{
					name: "createDEXclientCallback",
					inputs: [
						{name: "pubkey", type: "uint256"},
						{name: "deployedAddress", type: "address"},
						{name: "owner", type: "address"},
					],
					outputs: [],
				},
				{
					name: "getPairAddress",
					inputs: [
						{name: "_answer_id", type: "uint32"},
						{name: "pairPubKey", type: "uint256"},
						{name: "pairSoArg", type: "uint256"},
						{name: "pairCreator", type: "address"},
						{name: "pairRootA", type: "address"},
						{name: "pairRootB", type: "address"},
						{name: "pairRootAB", type: "address"},
					],
					outputs: [{name: "value0", type: "address"}],
				},
				{
					name: "getRootTokenAddress",
					inputs: [
						{name: "_answer_id", type: "uint32"},
						{name: "rootPubKey", type: "uint256"},
						{name: "rootSoArg", type: "uint256"},
						{name: "rootName", type: "bytes"},
						{name: "rootSymbol", type: "bytes"},
						{name: "rootDecimals", type: "uint8"},
					],
					outputs: [{name: "value0", type: "address"}],
				},
				{
					name: "getConnectorAddress",
					inputs: [
						{name: "_answer_id", type: "uint32"},
						{name: "connectorPubKey", type: "uint256"},
						{name: "connectorSoArg", type: "uint256"},
						{name: "connectorCommander", type: "address"},
					],
					outputs: [{name: "value0", type: "address"}],
				},
				{
					name: "createDEXpair",
					inputs: [
						{name: "root0", type: "address"},
						{name: "root1", type: "address"},
						{name: "pairSoArg", type: "uint256"},
						{name: "connectorSoArg0", type: "uint256"},
						{name: "connectorSoArg1", type: "uint256"},
						{name: "rootSoArg", type: "uint256"},
						{name: "rootName", type: "bytes"},
						{name: "rootSymbol", type: "bytes"},
						{name: "rootDecimals", type: "uint8"},
						{name: "grammsForPair", type: "uint128"},
						{name: "grammsForRoot", type: "uint128"},
						{name: "grammsForConnector", type: "uint128"},
						{name: "grammsForWallet", type: "uint128"},
					],
					outputs: [],
				},
				{
					name: "createDEXpairCallback",
					inputs: [
						{name: "root0", type: "address"},
						{name: "root1", type: "address"},
						{name: "root01", type: "address"},
					],
					outputs: [],
				},
				{
					name: "getDetailsCallback",
					inputs: [
						{
							components: [
								{name: "name", type: "bytes"},
								{name: "symbol", type: "bytes"},
								{name: "decimals", type: "uint8"},
								{name: "root_public_key", type: "uint256"},
								{name: "root_owner_address", type: "address"},
								{name: "total_supply", type: "uint128"},
							],
							name: "value0",
							type: "tuple",
						},
					],
					outputs: [],
				},
				{
					name: "getPairByRoots01",
					inputs: [
						{name: "root0", type: "address"},
						{name: "root1", type: "address"},
					],
					outputs: [{name: "pairAddr", type: "address"}],
				},
				{
					name: "getPairByRoots10",
					inputs: [
						{name: "root1", type: "address"},
						{name: "root0", type: "address"},
					],
					outputs: [{name: "pairAddr", type: "address"}],
				},
				{
					name: "getRootsByPair",
					inputs: [{name: "pairAddr", type: "address"}],
					outputs: [
						{name: "root0", type: "address"},
						{name: "root1", type: "address"},
					],
				},
				{
					name: "checkPubKey",
					inputs: [{name: "pubkey", type: "uint256"}],
					outputs: [
						{name: "status", type: "bool"},
						{name: "dexclient", type: "address"},
					],
				},
				{
					name: "getBalanceTONgrams",
					inputs: [],
					outputs: [{name: "balanceTONgrams", type: "uint128"}],
				},
				{
					name: "encodePayload",
					inputs: [{name: "payload", type: "cell"}],
					outputs: [
						{name: "arg0", type: "uint8"},
						{name: "arg1", type: "address"},
						{name: "arg2", type: "address"},
						{name: "arg3", type: "uint128"},
						{name: "arg4", type: "uint128"},
					],
				},
				{
					name: "computeCodeHash",
					inputs: [{name: "code", type: "cell"}],
					outputs: [{name: "value0", type: "uint256"}],
				},
				{
					name: "hashRootTokenContract",
					inputs: [],
					outputs: [{name: "value0", type: "uint256"}],
				},
				{
					name: "sendTransaction",
					inputs: [
						{name: "dest", type: "address"},
						{name: "value", type: "uint128"},
						{name: "bounce", type: "bool"},
						{name: "flags", type: "uint8"},
						{name: "payload", type: "cell"},
					],
					outputs: [],
				},
				{
					name: "connectCallback",
					inputs: [{name: "wallet", type: "address"}],
					outputs: [],
				},
				{
					name: "createVote",
					inputs: [
						{name: "duration", type: "uint256"},
						{name: "code", type: "cell"},
						{name: "pointer", type: "uint8"},
					],
					outputs: [{name: "isSuccess", type: "bool"}],
				},
				{
					name: "tokensReceivedCallback",
					inputs: [
						{name: "token_wallet", type: "address"},
						{name: "token_root", type: "address"},
						{name: "amount", type: "uint128"},
						{name: "sender_public_key", type: "uint256"},
						{name: "sender_address", type: "address"},
						{name: "sender_wallet", type: "address"},
						{name: "original_gas_to", type: "address"},
						{name: "updated_balance", type: "uint128"},
						{name: "payload", type: "cell"},
					],
					outputs: [],
				},
				{
					name: "calculateVotes",
					inputs: [
						{name: "yes", type: "uint32"},
						{name: "no", type: "uint32"},
						{name: "total", type: "uint32"},
						{name: "selector", type: "uint8"},
					],
					outputs: [{name: "value0", type: "bool"}],
				},
				{
					name: "resultVote",
					inputs: [],
					outputs: [{name: "isSuccess", type: "bool"}],
				},
				{
					name: "resultVoteCallback",
					inputs: [
						{
							components: [
								{name: "name", type: "bytes"},
								{name: "symbol", type: "bytes"},
								{name: "decimals", type: "uint8"},
								{name: "root_public_key", type: "uint256"},
								{name: "root_owner_address", type: "address"},
								{name: "total_supply", type: "uint128"},
							],
							name: "value0",
							type: "tuple",
						},
					],
					outputs: [],
				},
				{
					name: "soUINT",
					inputs: [],
					outputs: [{name: "soUINT", type: "uint256"}],
				},
				{
					name: "codeDEXclient",
					inputs: [],
					outputs: [{name: "codeDEXclient", type: "cell"}],
				},
				{
					name: "codeDEXpair",
					inputs: [],
					outputs: [{name: "codeDEXpair", type: "cell"}],
				},
				{
					name: "codeDEXconnector",
					inputs: [],
					outputs: [{name: "codeDEXconnector", type: "cell"}],
				},
				{
					name: "codeRootToken",
					inputs: [],
					outputs: [{name: "codeRootToken", type: "cell"}],
				},
				{
					name: "codeTONTokenWallet",
					inputs: [],
					outputs: [{name: "codeTONTokenWallet", type: "cell"}],
				},
				{
					name: "rootDEX",
					inputs: [],
					outputs: [{name: "rootDEX", type: "address"}],
				},
				{
					name: "voteForWalletDEX",
					inputs: [],
					outputs: [{name: "voteForWalletDEX", type: "address"}],
				},
				{
					name: "voteAgainstWalletDEX",
					inputs: [],
					outputs: [{name: "voteAgainstWalletDEX", type: "address"}],
				},
				{
					name: "walletsCount",
					inputs: [],
					outputs: [{name: "walletsCount", type: "uint8"}],
				},
				{
					name: "pairs",
					inputs: [],
					outputs: [
						{
							components: [
								{name: "root0", type: "address"},
								{name: "root1", type: "address"},
								{name: "rootLP", type: "address"},
							],
							name: "pairs",
							type: "map(address,tuple)",
						},
					],
				},
				{
					name: "pairKeys",
					inputs: [],
					outputs: [{name: "pairKeys", type: "address[]"}],
				},
				{
					name: "creatorForPair",
					inputs: [],
					outputs: [{name: "creatorForPair", type: "map(address,address)"}],
				},
				{
					name: "dataForRootAB",
					inputs: [],
					outputs: [
						{
							components: [
								{name: "pair", type: "address"},
								{name: "root0", type: "address"},
								{name: "root1", type: "address"},
							],
							name: "dataForRootAB",
							type: "map(address,tuple)",
						},
					],
				},
				{
					name: "pubkeys",
					inputs: [],
					outputs: [{name: "pubkeys", type: "map(uint256,address)"}],
				},
				{
					name: "clients",
					inputs: [],
					outputs: [{name: "clients", type: "map(address,uint256)"}],
				},
				{
					name: "clientKeys",
					inputs: [],
					outputs: [{name: "clientKeys", type: "address[]"}],
				},
				{
					name: "balanceOf",
					inputs: [],
					outputs: [{name: "balanceOf", type: "map(address,uint128)"}],
				},
				{
					name: "msgOf",
					inputs: [],
					outputs: [{name: "msgOf", type: "map(address,bytes)"}],
				},
				{
					name: "vote",
					inputs: [],
					outputs: [
						{
							components: [
								{name: "start", type: "uint256"},
								{name: "duration", type: "uint256"},
								{name: "code", type: "cell"},
								{name: "pointer", type: "uint8"},
								{name: "voteFor", type: "uint128"},
								{name: "voteAgainst", type: "uint128"},
								{name: "isVotingNow", type: "bool"},
							],
							name: "vote",
							type: "tuple",
						},
					],
				},
				{
					name: "voteCount",
					inputs: [],
					outputs: [{name: "voteCount", type: "uint256"}],
				},
				{
					name: "connectors",
					inputs: [],
					outputs: [
						{
							components: [
								{name: "root_address", type: "address"},
								{name: "souint", type: "uint256"},
								{name: "status", type: "bool"},
							],
							name: "connectors",
							type: "map(address,tuple)",
						},
					],
				},
				{
					name: "walletConnector",
					inputs: [],
					outputs: [{name: "walletConnector", type: "map(address,address)"}],
				},
			],
			data: [{key: 1, name: "soUINT", type: "uint256"}],
			events: [],
		},
		tvc: "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",
		code: "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",
	},
};
