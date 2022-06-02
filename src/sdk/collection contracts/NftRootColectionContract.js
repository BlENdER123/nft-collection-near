const NftRootColectionContract = {
	abi: {
		"ABI version": 2,
		version: "2.1",
		header: ["time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "codeData",
						type: "cell",
					},
					{
						name: "codeDataChunk",
						type: "cell",
					},
					{
						name: "codeIndex",
						type: "cell",
					},
					{
						name: "codeIndexBasis",
						type: "cell",
					},
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
					{
						name: "addrAuthor",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "deployMetadata",
				inputs: [
					{
						name: "wid",
						type: "int8",
					},
					{
						name: "name",
						type: "string",
					},
					{
						name: "description",
						type: "string",
					},
					{
						name: "contentHash",
						type: "uint256",
					},
					{
						name: "mimeType",
						type: "string",
					},
					{
						name: "chunks",
						type: "uint8",
					},
					{
						name: "chunkSize",
						type: "uint128",
					},
					{
						name: "size",
						type: "uint128",
					},
					{
						components: [
							{
								name: "height",
								type: "uint128",
							},
							{
								name: "width",
								type: "uint128",
							},
							{
								name: "duration",
								type: "uint128",
							},
							{
								name: "extra",
								type: "string",
							},
							{
								name: "json",
								type: "string",
							},
						],
						name: "meta",
						type: "tuple",
					},
				],
				outputs: [],
			},
			{
				name: "mintNft",
				inputs: [],
				outputs: [],
			},
			{
				name: "getInfo",
				inputs: [],
				outputs: [
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
					{
						name: "totalSupply",
						type: "uint128",
					},
					{
						name: "maxMinted",
						type: "uint256",
					},
					{
						name: "addrAuthor",
						type: "address",
					},
					{
						name: "addrOwner",
						type: "address",
					},
				],
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
				name: "resolveCodeHashData",
				inputs: [],
				outputs: [
					{
						name: "codeHashData",
						type: "uint256",
					},
				],
			},
			{
				name: "resolveData",
				inputs: [
					{
						name: "addrRoot",
						type: "address",
					},
					{
						name: "id",
						type: "uint256",
					},
				],
				outputs: [
					{
						name: "addrData",
						type: "address",
					},
				],
			},
			{
				name: "_inited",
				inputs: [],
				outputs: [
					{
						name: "_inited",
						type: "bool",
					},
				],
			},
		],
		data: [
			{
				key: 1,
				name: "_addrOwner",
				type: "address",
			},
			{
				key: 2,
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
				name: "_codeData",
				type: "cell",
			},
			{
				name: "_codeIndex",
				type: "cell",
			},
			{
				name: "_checkList",
				type: "uint8",
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
				name: "_addrBasis",
				type: "address",
			},
			{
				name: "_version",
				type: "string",
			},
			{
				name: "_totalSupply",
				type: "uint128",
			},
			{
				name: "_name",
				type: "string",
			},
			{
				name: "_description",
				type: "string",
			},
			{
				name: "_icon",
				type: "string",
			},
			{
				name: "_inited",
				type: "bool",
			},
			{
				name: "_codeDataChunk",
				type: "cell",
			},
			{
				name: "_codeIndexBasis",
				type: "cell",
			},
			{
				name: "_maxMinted",
				type: "uint256",
			},
			{
				name: "_id",
				type: "uint256",
			},
			{
				name: "_addrCreator",
				type: "address",
			},
		],
	},
	tvc: "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",
	code: "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",
	codeHash: "07cf3d4b84066246c1c270e5201b6ad9e66c04e28c5207a757d2194c625235b9",
};
module.exports = {NftRootColectionContract};
