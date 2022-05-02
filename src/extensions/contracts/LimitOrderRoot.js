module.exports = {
	LimitOrderRootContract: {
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
							name: "codeOrder",
							type: "cell",
						},
						{name: "codeRouter", type: "cell"},
						{name: "rootArr", type: "address[]"},
					],
					outputs: [],
				},
				{
					name: "deployRouterCallback",
					inputs: [{name: "router", type: "address"}],
					outputs: [],
				},
				{
					name: "connectRouterToRoot",
					inputs: [{name: "root", type: "address"}],
					outputs: [],
				},
				{
					name: "createOrder",
					inputs: [
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
					name: "cancelOrder",
					inputs: [
						{name: "id", type: "uint256"},
						{
							name: "amount",
							type: "uint128",
						},
						{name: "walletOwnerRoot", type: "address"},
						{name: "walletOwnerFrom", type: "address"},
					],
					outputs: [],
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
				{
					name: "resolveCodeHash",
					inputs: [],
					outputs: [{name: "codeHash", type: "uint256"}],
				},
				{
					name: "resolveOrder",
					inputs: [{name: "id", type: "uint256"}],
					outputs: [{name: "addrOrder", type: "address"}],
				},
				{
					name: "_deployedAddress",
					inputs: [],
					outputs: [{name: "_deployedAddress", type: "address"}],
				},
				{
					name: "_deployedRouter",
					inputs: [],
					outputs: [{name: "_deployedRouter", type: "address"}],
				},
			],
			data: [],
			events: [],
			fields: [
				{name: "_pubkey", type: "uint256"},
				{
					name: "_timestamp",
					type: "uint64",
				},
				{name: "_constructorFlag", type: "bool"},
				{
					name: "_codeOrder",
					type: "cell",
				},
				{name: "_codeIndex", type: "cell"},
				{
					name: "_deployedNumber",
					type: "uint256",
				},
				{name: "_deployedAddress", type: "address"},
				{name: "_deployedRouter", type: "address"},
			],
		},
		tvc: "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",
		code: "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",
	},
};
