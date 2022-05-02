module.exports = {
	DEXRootContract: {
		abi: {
			"ABI version": 2,
			header: ["pubkey", "time", "expire"],
			functions: [
				{
					name: "constructor",
					inputs: [
						{name: "_governance", type: "address"},
						{
							name: "_rootDEX",
							type: "address",
						},
						{name: "_souintFor", type: "uint256"},
						{
							name: "_souintAgainst",
							type: "uint256",
						},
						{name: "_gramsToConnector", type: "uint128"},
						{
							name: "_gramsToRoot",
							type: "uint128",
						},
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
						{
							name: "clientPubKey",
							type: "uint256",
						},
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
						{
							name: "deployedAddress",
							type: "address",
						},
						{name: "owner", type: "address"},
					],
					outputs: [],
				},
				{
					name: "getPairAddress",
					inputs: [
						{name: "_answer_id", type: "uint32"},
						{
							name: "pairPubKey",
							type: "uint256",
						},
						{name: "pairSoArg", type: "uint256"},
						{
							name: "pairCreator",
							type: "address",
						},
						{name: "pairRootA", type: "address"},
						{
							name: "pairRootB",
							type: "address",
						},
						{name: "pairRootAB", type: "address"},
					],
					outputs: [{name: "value0", type: "address"}],
				},
				{
					name: "getRootTokenAddress",
					inputs: [
						{name: "_answer_id", type: "uint32"},
						{
							name: "rootPubKey",
							type: "uint256",
						},
						{name: "rootSoArg", type: "uint256"},
						{
							name: "rootName",
							type: "bytes",
						},
						{name: "rootSymbol", type: "bytes"},
						{name: "rootDecimals", type: "uint8"},
					],
					outputs: [{name: "value0", type: "address"}],
				},
				{
					name: "getConnectorAddress",
					inputs: [
						{name: "_answer_id", type: "uint32"},
						{
							name: "connectorPubKey",
							type: "uint256",
						},
						{name: "connectorSoArg", type: "uint256"},
						{name: "connectorCommander", type: "address"},
					],
					outputs: [{name: "value0", type: "address"}],
				},
				{
					name: "createDEXpair",
					inputs: [
						{name: "root0", type: "address"},
						{
							name: "root1",
							type: "address",
						},
						{name: "pairSoArg", type: "uint256"},
						{
							name: "connectorSoArg0",
							type: "uint256",
						},
						{name: "connectorSoArg1", type: "uint256"},
						{
							name: "rootSoArg",
							type: "uint256",
						},
						{name: "rootName", type: "bytes"},
						{
							name: "rootSymbol",
							type: "bytes",
						},
						{name: "rootDecimals", type: "uint8"},
						{
							name: "grammsForPair",
							type: "uint128",
						},
						{name: "grammsForRoot", type: "uint128"},
						{
							name: "grammsForConnector",
							type: "uint128",
						},
						{name: "grammsForWallet", type: "uint128"},
					],
					outputs: [],
				},
				{
					name: "createDEXpairCallback",
					inputs: [
						{name: "root0", type: "address"},
						{
							name: "root1",
							type: "address",
						},
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
								{
									name: "symbol",
									type: "bytes",
								},
								{name: "decimals", type: "uint8"},
								{
									name: "root_public_key",
									type: "uint256",
								},
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
						{
							name: "arg2",
							type: "address",
						},
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
						{
							name: "bounce",
							type: "bool",
						},
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
						{
							name: "code",
							type: "cell",
						},
						{name: "pointer", type: "uint8"},
						{name: "selector", type: "uint8"},
					],
					outputs: [{name: "isSuccess", type: "bool"}],
				},
				{
					name: "tokensReceivedCallback",
					inputs: [
						{name: "token_wallet", type: "address"},
						{
							name: "token_root",
							type: "address",
						},
						{name: "amount", type: "uint128"},
						{
							name: "sender_public_key",
							type: "uint256",
						},
						{name: "sender_address", type: "address"},
						{
							name: "sender_wallet",
							type: "address",
						},
						{name: "original_gas_to", type: "address"},
						{
							name: "updated_balance",
							type: "uint128",
						},
						{name: "payload", type: "cell"},
					],
					outputs: [],
				},
				{
					name: "calculateVotes",
					inputs: [
						{name: "yes", type: "uint32"},
						{name: "no", type: "uint32"},
						{
							name: "total",
							type: "uint32",
						},
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
								{
									name: "symbol",
									type: "bytes",
								},
								{name: "decimals", type: "uint8"},
								{
									name: "root_public_key",
									type: "uint256",
								},
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
					name: "isCodeInit",
					inputs: [],
					outputs: [{name: "isCodeInit", type: "map(uint8,bool)"}],
				},
				{
					name: "governance",
					inputs: [],
					outputs: [{name: "governance", type: "address"}],
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
								{
									name: "root1",
									type: "address",
								},
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
								{
									name: "root0",
									type: "address",
								},
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
								{
									name: "duration",
									type: "uint256",
								},
								{name: "code", type: "cell"},
								{name: "pointer", type: "uint8"},
								{
									name: "selector",
									type: "uint8",
								},
								{name: "voteFor", type: "uint128"},
								{
									name: "voteAgainst",
									type: "uint128",
								},
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
								{
									name: "souint",
									type: "uint256",
								},
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
