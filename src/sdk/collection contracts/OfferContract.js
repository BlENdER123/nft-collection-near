const OfferContract = {
	abi: {
		"ABI version": 2,
		version: "2.1",
		header: ["pubkey", "time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "price",
						type: "uint128",
					},
					{
						name: "codeIndexOffer",
						type: "cell",
					},
					{
						name: "addrOwner",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "Buy",
				inputs: [],
				outputs: [],
			},
			{
				name: "CheckAddrOwner",
				inputs: [
					{
						name: "addrOwner",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "CheckAddrApproved",
				inputs: [
					{
						name: "addrApproved",
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
						name: "addrNft",
						type: "address",
					},
					{
						name: "addrOwner",
						type: "address",
					},
					{
						name: "price",
						type: "uint128",
					},
					{
						name: "check",
						type: "bool",
					},
				],
			},
			{
				name: "resolveCodeHashIndexOffer",
				inputs: [
					{
						name: "addrMarket",
						type: "address",
					},
					{
						name: "addrOwner",
						type: "address",
					},
				],
				outputs: [
					{
						name: "codeHashIndexOffer",
						type: "uint256",
					},
				],
			},
			{
				name: "resolveAddrIndexOffer",
				inputs: [
					{
						name: "addrMarket",
						type: "address",
					},
					{
						name: "addrOwner",
						type: "address",
					},
					{
						name: "addrOffer",
						type: "address",
					},
				],
				outputs: [
					{
						name: "addrIndexOffer",
						type: "address",
					},
				],
			},
		],
		data: [
			{
				key: 1,
				name: "_addrNft",
				type: "address",
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
				name: "_codeIndexOffer",
				type: "cell",
			},
			{
				name: "_addrNft",
				type: "address",
			},
			{
				name: "_addrOwner",
				type: "address",
			},
			{
				name: "_addrNftMarket",
				type: "address",
			},
			{
				name: "_price",
				type: "uint128",
			},
			{
				name: "_Check",
				type: "bool",
			},
			{
				name: "_buyer",
				type: "address",
			},
		],
	},
	tvc: "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",
	code: "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",
	codeHash: "8c6a529be82dfed8da3a81ce065c403827cddd27c67d85293b6e4b8b6199b6ed",
};
module.exports = {OfferContract};
