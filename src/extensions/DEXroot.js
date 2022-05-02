const DEXrootContract = {
	abi: {
		"ABI version": 2,
		header: ["pubkey", "time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "wTONroot",
						type: "address",
					},
					{
						name: "wTONwrapper",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "sendTransfer",
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
				],
				outputs: [],
			},
			{
				name: "setDEXclientCode",
				inputs: [
					{
						name: "code",
						type: "cell",
					},
				],
				outputs: [],
			},
			{
				name: "setDEXpairCode",
				inputs: [
					{
						name: "code",
						type: "cell",
					},
				],
				outputs: [],
			},
			{
				name: "computeDEXclientAddrWithId",
				inputs: [
					{
						name: "pubkey",
						type: "uint256",
					},
					{
						name: "clientId",
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
				name: "createDEXclient",
				inputs: [
					{
						name: "pubkey",
						type: "uint256",
					},
					{
						name: "clientId",
						type: "uint256",
					},
				],
				outputs: [
					{
						name: "deployedAddress",
						type: "address",
					},
					{
						name: "statusCreate",
						type: "bool",
					},
				],
			},
			{
				name: "computeDEXpairAddr",
				inputs: [
					{
						name: "pubkey",
						type: "uint256",
					},
				],
				outputs: [
					{
						name: "value0",
						type: "address",
					},
					{
						name: "createId",
						type: "uint256",
					},
				],
			},
			{
				name: "computeDEXpairAddrWithId",
				inputs: [
					{
						name: "pubkey",
						type: "uint256",
					},
					{
						name: "pairId",
						type: "uint256",
					},
				],
				outputs: [
					{
						name: "value0",
						type: "address",
					},
					{
						name: "createId",
						type: "uint256",
					},
				],
			},
			{
				name: "createDEXpair",
				id: "0x111",
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
						name: "createId",
						type: "uint256",
					},
				],
				outputs: [],
			},
			{
				name: "getPairByRoots01",
				inputs: [
					{
						name: "root0",
						type: "address",
					},
					{
						name: "root1",
						type: "address",
					},
				],
				outputs: [
					{
						name: "pairAddr",
						type: "address",
					},
				],
			},
			{
				name: "getPairByRoots10",
				inputs: [
					{
						name: "root1",
						type: "address",
					},
					{
						name: "root0",
						type: "address",
					},
				],
				outputs: [
					{
						name: "pairAddr",
						type: "address",
					},
				],
			},
			{
				name: "getRootsByPair",
				inputs: [
					{
						name: "pairAddr",
						type: "address",
					},
				],
				outputs: [
					{
						name: "root0",
						type: "address",
					},
					{
						name: "root1",
						type: "address",
					},
				],
			},
			{
				name: "checkPubKey",
				inputs: [
					{
						name: "pubkey",
						type: "uint256",
					},
				],
				outputs: [
					{
						name: "status",
						type: "bool",
					},
					{
						name: "dexclient",
						type: "address",
					},
				],
			},
			{
				name: "getBalanceTONgrams",
				inputs: [],
				outputs: [
					{
						name: "balanceTONgrams",
						type: "uint128",
					},
				],
			},
			{
				name: "codeDEXclient",
				inputs: [],
				outputs: [
					{
						name: "codeDEXclient",
						type: "cell",
					},
				],
			},
			{
				name: "codeDEXpair",
				inputs: [],
				outputs: [
					{
						name: "codeDEXpair",
						type: "cell",
					},
				],
			},
			{
				name: "wrappedTONroot",
				inputs: [],
				outputs: [
					{
						name: "wrappedTONroot",
						type: "address",
					},
				],
			},
			{
				name: "TONwrapper",
				inputs: [],
				outputs: [
					{
						name: "TONwrapper",
						type: "address",
					},
				],
			},
			{
				name: "test1",
				inputs: [],
				outputs: [
					{
						name: "test1",
						type: "uint128",
					},
				],
			},
			{
				name: "test2",
				inputs: [],
				outputs: [
					{
						name: "test2",
						type: "uint128",
					},
				],
			},
			{
				name: "test3",
				inputs: [],
				outputs: [
					{
						name: "test3",
						type: "uint128",
					},
				],
			},
			{
				name: "test4",
				inputs: [],
				outputs: [
					{
						name: "test4",
						type: "uint128",
					},
				],
			},
			{
				name: "test5",
				inputs: [],
				outputs: [
					{
						name: "test5",
						type: "uint128",
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
								name: "root0",
								type: "address",
							},
							{
								name: "root1",
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
			{
				name: "pubkeys",
				inputs: [],
				outputs: [
					{
						name: "pubkeys",
						type: "map(uint256,address)",
					},
				],
			},
			{
				name: "clients",
				inputs: [],
				outputs: [
					{
						name: "clients",
						type: "map(address,uint256)",
					},
				],
			},
			{
				name: "clientKeys",
				inputs: [],
				outputs: [
					{
						name: "clientKeys",
						type: "address[]",
					},
				],
			},
		],
		data: [],
		events: [],
	},
	tvc: "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",
};
module.exports = {DEXrootContract};
