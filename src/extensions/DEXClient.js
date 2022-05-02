const DEXClientContract = {
	abi: {
		"ABI version": 2,
		header: ["pubkey", "time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "ownerAddr",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "connectPair",
				inputs: [
					{
						name: "pairAddr",
						type: "address",
					},
				],
				outputs: [
					{
						name: "statusConnection",
						type: "bool",
					},
				],
			},
			{
				name: "setPair",
				inputs: [
					{
						name: "arg0",
						type: "address",
					},
					{
						name: "arg1",
						type: "address",
					},
					{
						name: "arg2",
						type: "address",
					},
					{
						name: "arg3",
						type: "address",
					},
					{
						name: "arg4",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "getConnectorAddress",
				inputs: [
					{
						name: "_answer_id",
						type: "uint32",
					},
					{
						name: "connectorSoArg",
						type: "uint256",
					},
				],
				outputs: [
					{
						name: "value0",
						type: "address",
					},
				],
			},
			{
				name: "connectRoot",
				inputs: [
					{
						name: "root",
						type: "address",
					},
					{
						name: "souint",
						type: "uint256",
					},
					{
						name: "gramsToConnector",
						type: "uint128",
					},
					{
						name: "gramsToRoot",
						type: "uint128",
					},
				],
				outputs: [
					{
						name: "statusConnected",
						type: "bool",
					},
				],
			},
			{
				name: "connectCallback",
				inputs: [
					{
						name: "wallet",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "getAllDataPreparation",
				inputs: [],
				outputs: [
					{
						name: "pairKeysR",
						type: "address[]",
					},
					{
						name: "rootKeysR",
						type: "address[]",
					},
				],
			},
			{
				name: "processSwapA",
				inputs: [
					{
						name: "pairAddr",
						type: "address",
					},
					{
						name: "qtyA",
						type: "uint128",
					},
					{
						name: "minQtyB",
						type: "uint128",
					},
					{
						name: "maxQtyB",
						type: "uint128",
					},
				],
				outputs: [
					{
						name: "processSwapStatus",
						type: "bool",
					},
				],
			},
			{
				name: "processSwapB",
				inputs: [
					{
						name: "pairAddr",
						type: "address",
					},
					{
						name: "qtyB",
						type: "uint128",
					},
					{
						name: "minQtyA",
						type: "uint128",
					},
					{
						name: "maxQtyA",
						type: "uint128",
					},
				],
				outputs: [
					{
						name: "processSwapStatus",
						type: "bool",
					},
				],
			},
			{
				name: "processLiquidity",
				inputs: [
					{
						name: "pairAddr",
						type: "address",
					},
					{
						name: "qtyA",
						type: "uint128",
					},
					{
						name: "qtyB",
						type: "uint128",
					},
				],
				outputs: [
					{
						name: "processLiquidityStatus",
						type: "bool",
					},
				],
			},
			{
				name: "returnLiquidity",
				inputs: [
					{
						name: "pairAddr",
						type: "address",
					},
					{
						name: "tokens",
						type: "uint128",
					},
				],
				outputs: [
					{
						name: "returnLiquidityStatus",
						type: "bool",
					},
				],
			},
			{
				name: "tokensReceivedCallback",
				inputs: [
					{
						name: "token_wallet",
						type: "address",
					},
					{
						name: "token_root",
						type: "address",
					},
					{
						name: "amount",
						type: "uint128",
					},
					{
						name: "sender_public_key",
						type: "uint256",
					},
					{
						name: "sender_address",
						type: "address",
					},
					{
						name: "sender_wallet",
						type: "address",
					},
					{
						name: "original_gas_to",
						type: "address",
					},
					{
						name: "updated_balance",
						type: "uint128",
					},
					{
						name: "payload",
						type: "cell",
					},
				],
				outputs: [],
			},
			{
				name: "getCallback",
				inputs: [
					{
						name: "id",
						type: "uint256",
					},
				],
				outputs: [
					{
						name: "token_wallet",
						type: "address",
					},
					{
						name: "token_root",
						type: "address",
					},
					{
						name: "amount",
						type: "uint128",
					},
					{
						name: "sender_public_key",
						type: "uint256",
					},
					{
						name: "sender_address",
						type: "address",
					},
					{
						name: "sender_wallet",
						type: "address",
					},
					{
						name: "original_gas_to",
						type: "address",
					},
					{
						name: "updated_balance",
						type: "uint128",
					},
					{
						name: "payload_arg0",
						type: "uint8",
					},
					{
						name: "payload_arg1",
						type: "address",
					},
					{
						name: "payload_arg2",
						type: "address",
					},
					{
						name: "payload_arg3",
						type: "uint128",
					},
					{
						name: "payload_arg4",
						type: "uint128",
					},
				],
			},
			{
				name: "getBalance",
				inputs: [
					{
						name: "_answer_id",
						type: "uint32",
					},
				],
				outputs: [
					{
						name: "value0",
						type: "uint128",
					},
				],
			},
			{
				name: "createNewPair",
				inputs: [
					{
						name: "root0",
						type: "address",
					},
					{
						name: "root1",
						type: "address",
					},
					{
						name: "pairSoArg",
						type: "uint256",
					},
					{
						name: "connectorSoArg0",
						type: "uint256",
					},
					{
						name: "connectorSoArg1",
						type: "uint256",
					},
					{
						name: "rootSoArg",
						type: "uint256",
					},
					{
						name: "rootName",
						type: "bytes",
					},
					{
						name: "rootSymbol",
						type: "bytes",
					},
					{
						name: "rootDecimals",
						type: "uint8",
					},
					{
						name: "grammsForPair",
						type: "uint128",
					},
					{
						name: "grammsForRoot",
						type: "uint128",
					},
					{
						name: "grammsForConnector",
						type: "uint128",
					},
					{
						name: "grammsForWallet",
						type: "uint128",
					},
					{
						name: "grammsTotal",
						type: "uint128",
					},
				],
				outputs: [],
			},
			{
				name: "getPairData",
				inputs: [
					{
						name: "pairAddr",
						type: "address",
					},
				],
				outputs: [
					{
						name: "pairStatus",
						type: "bool",
					},
					{
						name: "pairRootA",
						type: "address",
					},
					{
						name: "pairWalletA",
						type: "address",
					},
					{
						name: "pairRootB",
						type: "address",
					},
					{
						name: "pairWalletB",
						type: "address",
					},
					{
						name: "pairRootAB",
						type: "address",
					},
					{
						name: "curPair",
						type: "address",
					},
				],
			},
			{
				name: "sendTokens",
				inputs: [
					{
						name: "tokenRoot",
						type: "address",
					},
					{
						name: "to",
						type: "address",
					},
					{
						name: "tokens",
						type: "uint128",
					},
					{
						name: "grams",
						type: "uint128",
					},
				],
				outputs: [
					{
						name: "sendTokenStatus",
						type: "bool",
					},
				],
			},
			{
				name: "sendTransaction",
				inputs: [
					{
						name: "dest",
						type: "address",
					},
					{
						name: "value",
						type: "uint128",
					},
					{
						name: "bounce",
						type: "bool",
					},
					{
						name: "flags",
						type: "uint8",
					},
					{
						name: "payload",
						type: "cell",
					},
				],
				outputs: [],
			},
			{
				name: "deployLockStakeSafeCallback",
				inputs: [
					{
						name: "lockStakeSafe",
						type: "address",
					},
					{
						name: "nftKey",
						type: "address",
					},
					{
						name: "amount",
						type: "uint128",
					},
					{
						name: "period",
						type: "uint256",
					},
				],
				outputs: [],
			},
			{
				name: "transferOwnershipCallback",
				inputs: [
					{
						name: "addrFrom",
						type: "address",
					},
					{
						name: "addrTo",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "rootDEX",
				inputs: [],
				outputs: [
					{
						name: "rootDEX",
						type: "address",
					},
				],
			},
			{
				name: "soUINT",
				inputs: [],
				outputs: [
					{
						name: "soUINT",
						type: "uint256",
					},
				],
			},
			{
				name: "codeDEXConnector",
				inputs: [],
				outputs: [
					{
						name: "codeDEXConnector",
						type: "cell",
					},
				],
			},
			{
				name: "owner",
				inputs: [],
				outputs: [
					{
						name: "owner",
						type: "address",
					},
				],
			},
			{
				name: "rootKeys",
				inputs: [],
				outputs: [
					{
						name: "rootKeys",
						type: "address[]",
					},
				],
			},
			{
				name: "rootWallet",
				inputs: [],
				outputs: [
					{
						name: "rootWallet",
						type: "map(address,address)",
					},
				],
			},
			{
				name: "rootConnector",
				inputs: [],
				outputs: [
					{
						name: "rootConnector",
						type: "map(address,address)",
					},
				],
			},
			{
				name: "souintLast",
				inputs: [],
				outputs: [
					{
						name: "souintLast",
						type: "uint256",
					},
				],
			},
			{
				name: "counterCallback",
				inputs: [],
				outputs: [
					{
						name: "counterCallback",
						type: "uint256",
					},
				],
			},
			{
				name: "callbacks",
				inputs: [],
				outputs: [
					{
						components: [
							{
								name: "token_wallet",
								type: "address",
							},
							{
								name: "token_root",
								type: "address",
							},
							{
								name: "amount",
								type: "uint128",
							},
							{
								name: "sender_public_key",
								type: "uint256",
							},
							{
								name: "sender_address",
								type: "address",
							},
							{
								name: "sender_wallet",
								type: "address",
							},
							{
								name: "original_gas_to",
								type: "address",
							},
							{
								name: "updated_balance",
								type: "uint128",
							},
							{
								name: "payload_arg0",
								type: "uint8",
							},
							{
								name: "payload_arg1",
								type: "address",
							},
							{
								name: "payload_arg2",
								type: "address",
							},
							{
								name: "payload_arg3",
								type: "uint128",
							},
							{
								name: "payload_arg4",
								type: "uint128",
							},
						],
						name: "callbacks",
						type: "map(uint256,tuple)",
					},
				],
			},
			{
				name: "pairs",
				inputs: [],
				outputs: [
					{
						components: [
							{
								name: "status",
								type: "bool",
							},
							{
								name: "rootA",
								type: "address",
							},
							{
								name: "walletA",
								type: "address",
							},
							{
								name: "rootB",
								type: "address",
							},
							{
								name: "walletB",
								type: "address",
							},
							{
								name: "rootAB",
								type: "address",
							},
						],
						name: "pairs",
						type: "map(address,tuple)",
					},
				],
			},
			{
				name: "pairKeys",
				inputs: [],
				outputs: [
					{
						name: "pairKeys",
						type: "address[]",
					},
				],
			},
		],
		data: [
			{
				key: 1,
				name: "rootDEX",
				type: "address",
			},
			{
				key: 2,
				name: "soUINT",
				type: "uint256",
			},
			{
				key: 3,
				name: "codeDEXConnector",
				type: "cell",
			},
		],
		events: [],
	},
};
module.exports = {DEXClientContract};
