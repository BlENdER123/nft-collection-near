module.exports = {
	LimitOrderContract: {
		abi: {
			"ABI version": 2,
			version: "2.1",
			header: ["time", "expire"],
			functions: [
				{
					name: "constructor",
					inputs: [
						{name: "codeIndex", type: "cell"},
						{
							name: "addrRouter",
							type: "address",
						},
						{name: "addrOwner", type: "address"},
						{
							name: "addrPair",
							type: "address",
						},
						{name: "directionPair", type: "uint8"},
						{name: "price", type: "uint128"},
						{
							name: "amount",
							type: "uint128",
						},
						{name: "walletOwnerRoot", type: "address"},
						{
							name: "walletOwnerFrom",
							type: "address",
						},
						{name: "walletOwnerTo", type: "address"},
					],
					outputs: [],
				},
				{
					name: "applyOrder",
					inputs: [
						{name: "receivedAmount", type: "uint128"},
						{
							name: "price",
							type: "uint128",
						},
						{name: "idCallback", type: "uint256"},
					],
					outputs: [],
				},
				{
					name: "applyOrderCallback",
					inputs: [
						{name: "result", type: "bool"},
						{
							name: "amount",
							type: "uint128",
						},
						{name: "originalGasTo", type: "address"},
					],
					outputs: [],
				},
				{
					name: "transferOwnership",
					inputs: [
						{name: "addrNewOwner", type: "address"},
						{
							name: "walletNewOwnerFrom",
							type: "address",
						},
						{name: "walletNewOwnerTo", type: "address"},
					],
					outputs: [],
				},
				{
					name: "changePrice",
					inputs: [{name: "newPrice", type: "uint128"}],
					outputs: [],
				},
				{name: "cancelOrder", inputs: [], outputs: []},
				{
					name: "cancelOrderCallback",
					inputs: [],
					outputs: [],
				},
				{
					name: "getInfo",
					inputs: [],
					outputs: [
						{name: "addrRoot", type: "address"},
						{
							name: "addrRouter",
							type: "address",
						},
						{name: "addrOwner", type: "address"},
						{
							name: "addrPair",
							type: "address",
						},
						{name: "directionPair", type: "uint8"},
						{name: "price", type: "uint128"},
						{
							name: "amount",
							type: "uint128",
						},
						{name: "walletOwnerRoot", type: "address"},
						{
							name: "walletOwnerFrom",
							type: "address",
						},
						{name: "walletOwnerTo", type: "address"},
						{name: "status", type: "uint8"},
					],
				},
				{
					name: "resolveCodeHashIndex",
					inputs: [
						{name: "addrRoot", type: "address"},
						{
							name: "addrOwner",
							type: "address",
						},
						{name: "addrPair", type: "address"},
						{
							name: "directionPair",
							type: "uint8",
						},
						{name: "price", type: "uint128"},
					],
					outputs: [{name: "codeHashIndex", type: "uint256"}],
				},
				{
					name: "resolveIndex",
					inputs: [
						{name: "addrRoot", type: "address"},
						{
							name: "addrOwner",
							type: "address",
						},
						{name: "addrPair", type: "address"},
						{
							name: "directionPair",
							type: "uint8",
						},
						{name: "price", type: "uint128"},
						{name: "addrOrder", type: "address"},
					],
					outputs: [{name: "addrIndex", type: "address"}],
				},
			],
			data: [{key: 1, name: "_id", type: "uint256"}],
			events: [],
			fields: [
				{name: "_pubkey", type: "uint256"},
				{
					name: "_timestamp",
					type: "uint64",
				},
				{name: "_constructorFlag", type: "bool"},
				{
					name: "_codeIndex",
					type: "cell",
				},
				{name: "_addrRoot", type: "address"},
				{
					name: "_addrRouter",
					type: "address",
				},
				{name: "_addrOwner", type: "address"},
				{
					name: "_addrPair",
					type: "address",
				},
				{name: "_directionPair", type: "uint8"},
				{name: "_price", type: "uint128"},
				{
					name: "_amount",
					type: "uint128",
				},
				{name: "_walletOwnerRoot", type: "address"},
				{
					name: "_walletOwnerFrom",
					type: "address",
				},
				{name: "_walletOwnerTo", type: "address"},
				{name: "_status", type: "uint8"},
				{
					name: "_id",
					type: "uint256",
				},
			],
		},
		tvc: "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",
		code: "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",
	},
};
