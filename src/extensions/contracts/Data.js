const DataContract = {
	abi: {
		"ABI version": 2,
		version: "2.1",
		header: ["time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "addrOwner",
						type: "address",
					},
					{
						name: "codeIndex",
						type: "cell",
					},
					{
						name: "safeLockStake",
						type: "address",
					},
					{
						name: "amountLockStake",
						type: "uint128",
					},
					{
						name: "periodLockStake",
						type: "uint32",
					},
					{
						name: "apyLockStake",
						type: "uint32",
					},
				],
				outputs: [],
			},
			{
				name: "transferOwnership",
				inputs: [
					{
						name: "addrTo",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "getInfo",
				inputs: [],
				outputs: [
					{
						name: "addrRoot",
						type: "address",
					},
					{
						name: "addrOwner",
						type: "address",
					},
					{
						name: "addrData",
						type: "address",
					},
				],
			},
			{
				name: "getDetails",
				inputs: [],
				outputs: [
					{
						name: "addrRoot",
						type: "address",
					},
					{
						name: "addrOwner",
						type: "address",
					},
					{
						name: "addrData",
						type: "address",
					},
					{
						name: "safeLockStake",
						type: "address",
					},
					{
						name: "amountLockStake",
						type: "uint128",
					},
					{
						name: "timeStartLockStake",
						type: "uint256",
					},
					{
						name: "periodLockStake",
						type: "uint32",
					},
					{
						name: "apyLockStake",
						type: "uint32",
					},
				],
			},
			{
				name: "getOwner",
				inputs: [],
				outputs: [
					{
						name: "addrOwner",
						type: "address",
					},
				],
			},
			{
				name: "withdrawDePoolPart",
				inputs: [
					{
						name: "amount",
						type: "uint128",
					},
				],
				outputs: [],
			},
			{
				name: "withdrawDePoolAll",
				inputs: [],
				outputs: [],
			},
			{
				name: "withdrawLockStakeSafePart",
				inputs: [
					{
						name: "destination",
						type: "address",
					},
					{
						name: "amount",
						type: "uint128",
					},
				],
				outputs: [],
			},
			{
				name: "withdrawLockStakeSafeAll",
				inputs: [
					{
						name: "destination",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "resolveCodeHashIndex",
				inputs: [
					{
						name: "addrRoot",
						type: "address",
					},
					{
						name: "addrOwner",
						type: "address",
					},
				],
				outputs: [
					{
						name: "codeHashIndex",
						type: "uint256",
					},
				],
			},
			{
				name: "resolveIndex",
				inputs: [
					{
						name: "addrRoot",
						type: "address",
					},
					{
						name: "addrData",
						type: "address",
					},
					{
						name: "addrOwner",
						type: "address",
					},
				],
				outputs: [
					{
						name: "addrIndex",
						type: "address",
					},
				],
			},
			{
				name: "_id",
				inputs: [],
				outputs: [
					{
						name: "_id",
						type: "uint256",
					},
				],
			},
			{
				name: "_safeLockStake",
				inputs: [],
				outputs: [
					{
						name: "_safeLockStake",
						type: "address",
					},
				],
			},
			{
				name: "_amountLockStake",
				inputs: [],
				outputs: [
					{
						name: "_amountLockStake",
						type: "uint128",
					},
				],
			},
			{
				name: "_timeStartLockStake",
				inputs: [],
				outputs: [
					{
						name: "_timeStartLockStake",
						type: "uint256",
					},
				],
			},
			{
				name: "_periodLockStake",
				inputs: [],
				outputs: [
					{
						name: "_periodLockStake",
						type: "uint32",
					},
				],
			},
			{
				name: "_apyLockStake",
				inputs: [],
				outputs: [
					{
						name: "_apyLockStake",
						type: "uint32",
					},
				],
			},
		],
		data: [
			{
				key: 1,
				name: "_id",
				type: "uint256",
			},
		],
		events: [],
		fields: [
			{
				name: "_pubkey",
				type: "uint256",
			},
			{
				name: "_timestamp",
				type: "uint64",
			},
			{
				name: "_constructorFlag",
				type: "bool",
			},
			{
				name: "_codeIndex",
				type: "cell",
			},
			{
				name: "_addrRoot",
				type: "address",
			},
			{
				name: "_addrOwner",
				type: "address",
			},
			{
				name: "_addrAuthor",
				type: "address",
			},
			{
				name: "_id",
				type: "uint256",
			},
			{
				name: "_safeLockStake",
				type: "address",
			},
			{
				name: "_amountLockStake",
				type: "uint128",
			},
			{
				name: "_timeStartLockStake",
				type: "uint256",
			},
			{
				name: "_periodLockStake",
				type: "uint32",
			},
			{
				name: "_apyLockStake",
				type: "uint32",
			},
		],
	},
	tvc: "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",
	code: "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",
	codeHash: "e788567af91024ea2d5350cb1fc018585da088908b76fa2d601a58e7d82e883b",
};
module.exports = {DataContract};
