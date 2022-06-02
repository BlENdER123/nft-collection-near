const NFTMarketContract = {
	abi: {
		"ABI version": 2,
		version: "2.1",
		header: ["pubkey", "time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "root",
						type: "cell",
					},
					{
						name: "oneRoot",
						type: "cell",
					},
					{
						name: "data",
						type: "cell",
					},
					{
						name: "dataChunk",
						type: "cell",
					},
					{
						name: "index",
						type: "cell",
					},
					{
						name: "indexBasis",
						type: "cell",
					},
					{
						name: "offer",
						type: "cell",
					},
					{
						name: "indexOffer",
						type: "cell",
					},
				],
				outputs: [],
			},
			{
				name: "putOnSale",
				inputs: [
					{
						name: "addrNft",
						type: "address",
					},
					{
						name: "price",
						type: "uint128",
					},
				],
				outputs: [],
			},
			{
				name: "deployColection",
				inputs: [
					{
						name: "name",
						type: "string",
					},
					{
						name: "description",
						type: "string",
					},
					{
						name: "icon",
						type: "string",
					},
				],
				outputs: [],
			},
			{
				name: "getInfo",
				inputs: [],
				outputs: [
					{
						name: "countColections",
						type: "uint128",
					},
					{
						name: "oneRoot",
						type: "address",
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
			{
				name: "resolveCodeHashOffer",
				inputs: [],
				outputs: [
					{
						name: "codeHashOffer",
						type: "uint256",
					},
				],
			},
			{
				name: "resolveAddrOffer",
				inputs: [
					{
						name: "addrNft",
						type: "address",
					},
				],
				outputs: [
					{
						name: "addrOffer",
						type: "address",
					},
				],
			},
			{
				name: "resolveCodeHashNftRoot",
				inputs: [],
				outputs: [
					{
						name: "codeHashData",
						type: "uint256",
					},
				],
			},
			{
				name: "resolveNftRoot",
				inputs: [
					{
						name: "addrOwner",
						type: "address",
					},
					{
						name: "id",
						type: "uint128",
					},
				],
				outputs: [
					{
						name: "addrNftRoot",
						type: "address",
					},
				],
			},
		],
		data: [],
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
				name: "_codeNftRoot",
				type: "cell",
			},
			{
				name: "_codeOffer",
				type: "cell",
			},
			{
				name: "_codeIndexOffer",
				type: "cell",
			},
			{
				name: "oneNFTRoot",
				type: "address",
			},
			{
				name: "_data",
				type: "cell",
			},
			{
				name: "_dataChunk",
				type: "cell",
			},
			{
				name: "_index",
				type: "cell",
			},
			{
				name: "_indexBasis",
				type: "cell",
			},
			{
				name: "_indexOffer",
				type: "cell",
			},
			{
				name: "_countColections",
				type: "uint128",
			},
		],
	},
	tvc: "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",
	code: "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",
	codeHash: "b94299367172d3ff509c8eb0839bf7ed40d9f8ab5ccc5094f38efd323e5cad21",
};
module.exports = {NFTMarketContract};
