const LockStakeSafeContract = {
	abi: {
		"ABI version": 2,
		version: "2.1",
		header: ["pubkey", "time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "creator",
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
				],
				outputs: [],
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
				name: "onRoundComplete",
				inputs: [
					{
						name: "roundId",
						type: "uint64",
					},
					{
						name: "reward",
						type: "uint64",
					},
					{
						name: "ordinaryStake",
						type: "uint64",
					},
					{
						name: "vestingStake",
						type: "uint64",
					},
					{
						name: "lockStake",
						type: "uint64",
					},
					{
						name: "reinvest",
						type: "bool",
					},
					{
						name: "reason",
						type: "uint8",
					},
				],
				outputs: [],
			},
			{
				name: "receiveAnswer",
				inputs: [
					{
						name: "errcode",
						type: "uint32",
					},
					{
						name: "comment",
						type: "uint64",
					},
				],
				outputs: [],
			},
			{
				name: "onTransfer",
				inputs: [
					{
						name: "source",
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
				name: "depoolAddress",
				inputs: [],
				outputs: [
					{
						name: "depoolAddress",
						type: "address",
					},
				],
			},
			{
				name: "nftKeyAddress",
				inputs: [],
				outputs: [
					{
						name: "nftKeyAddress",
						type: "address",
					},
				],
			},
			{
				name: "depoolFee",
				inputs: [],
				outputs: [
					{
						name: "depoolFee",
						type: "uint128",
					},
				],
			},
			{
				name: "depoolMinStake",
				inputs: [],
				outputs: [
					{
						name: "depoolMinStake",
						type: "uint128",
					},
				],
			},
			{
				name: "salt",
				inputs: [],
				outputs: [
					{
						name: "salt",
						type: "uint256",
					},
				],
			},
			{
				name: "stakeList",
				inputs: [],
				outputs: [
					{
						name: "stakeList",
						type: "map(uint256,uint128)",
					},
				],
			},
			{
				name: "stakeTotal",
				inputs: [],
				outputs: [
					{
						name: "stakeTotal",
						type: "uint128",
					},
				],
			},
			{
				name: "depoolStakeReturn",
				inputs: [],
				outputs: [
					{
						name: "depoolStakeReturn",
						type: "uint128",
					},
				],
			},
			{
				name: "withdrawTotal",
				inputs: [],
				outputs: [
					{
						name: "withdrawTotal",
						type: "uint128",
					},
				],
			},
			{
				name: "onRoundCompleteList",
				inputs: [],
				outputs: [
					{
						components: [
							{
								name: "msgValue",
								type: "uint128",
							},
							{
								name: "roundId",
								type: "uint64",
							},
							{
								name: "reward",
								type: "uint64",
							},
							{
								name: "ordinaryStake",
								type: "uint64",
							},
							{
								name: "vestingStake",
								type: "uint64",
							},
							{
								name: "lockStake",
								type: "uint64",
							},
							{
								name: "reinvest",
								type: "bool",
							},
							{
								name: "reason",
								type: "uint8",
							},
						],
						name: "onRoundCompleteList",
						type: "map(uint256,tuple)",
					},
				],
			},
			{
				name: "onRoundCompleteCount",
				inputs: [],
				outputs: [
					{
						name: "onRoundCompleteCount",
						type: "uint8",
					},
				],
			},
			{
				name: "receiveAnswerList",
				inputs: [],
				outputs: [
					{
						components: [
							{
								name: "errcode",
								type: "uint32",
							},
							{
								name: "comment",
								type: "uint64",
							},
							{
								name: "msgValue",
								type: "uint128",
							},
						],
						name: "receiveAnswerList",
						type: "map(uint256,tuple)",
					},
				],
			},
			{
				name: "receiveAnswerCount",
				inputs: [],
				outputs: [
					{
						name: "receiveAnswerCount",
						type: "uint8",
					},
				],
			},
			{
				name: "onTransferList",
				inputs: [],
				outputs: [
					{
						components: [
							{
								name: "source",
								type: "address",
							},
							{
								name: "amount",
								type: "uint128",
							},
						],
						name: "onTransferList",
						type: "map(uint256,tuple)",
					},
				],
			},
			{
				name: "onTransferCount",
				inputs: [],
				outputs: [
					{
						name: "onTransferCount",
						type: "uint8",
					},
				],
			},
		],
		data: [
			{
				key: 1,
				name: "depoolAddress",
				type: "address",
			},
			{
				key: 2,
				name: "nftKeyAddress",
				type: "address",
			},
			{
				key: 3,
				name: "depoolFee",
				type: "uint128",
			},
			{
				key: 4,
				name: "depoolMinStake",
				type: "uint128",
			},
			{
				key: 5,
				name: "salt",
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
				name: "depoolAddress",
				type: "address",
			},
			{
				name: "nftKeyAddress",
				type: "address",
			},
			{
				name: "depoolFee",
				type: "uint128",
			},
			{
				name: "depoolMinStake",
				type: "uint128",
			},
			{
				name: "salt",
				type: "uint256",
			},
			{
				name: "stakeList",
				type: "map(uint256,uint128)",
			},
			{
				name: "stakeTotal",
				type: "uint128",
			},
			{
				name: "depoolStakeReturn",
				type: "uint128",
			},
			{
				name: "withdrawTotal",
				type: "uint128",
			},
			{
				components: [
					{
						name: "msgValue",
						type: "uint128",
					},
					{
						name: "roundId",
						type: "uint64",
					},
					{
						name: "reward",
						type: "uint64",
					},
					{
						name: "ordinaryStake",
						type: "uint64",
					},
					{
						name: "vestingStake",
						type: "uint64",
					},
					{
						name: "lockStake",
						type: "uint64",
					},
					{
						name: "reinvest",
						type: "bool",
					},
					{
						name: "reason",
						type: "uint8",
					},
				],
				name: "onRoundCompleteList",
				type: "map(uint256,tuple)",
			},
			{
				name: "onRoundCompleteCount",
				type: "uint8",
			},
			{
				components: [
					{
						name: "errcode",
						type: "uint32",
					},
					{
						name: "comment",
						type: "uint64",
					},
					{
						name: "msgValue",
						type: "uint128",
					},
				],
				name: "receiveAnswerList",
				type: "map(uint256,tuple)",
			},
			{
				name: "receiveAnswerCount",
				type: "uint8",
			},
			{
				components: [
					{
						name: "source",
						type: "address",
					},
					{
						name: "amount",
						type: "uint128",
					},
				],
				name: "onTransferList",
				type: "map(uint256,tuple)",
			},
			{
				name: "onTransferCount",
				type: "uint8",
			},
		],
	},
	tvc: "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",
	code: "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",
	codeHash: "e3e1715765cfdb0598028908889d15480a4c8ae650c898180552b63eae2684a0",
};
module.exports = {LockStakeSafeContract};
