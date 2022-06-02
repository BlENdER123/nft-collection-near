const DataContract = {
	abi: {
		"ABI version": 2,
		version: "2.1",
		header: ["time"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "name",
						type: "string",
					},
					{
						name: "descriprion",
						type: "string",
					},
					{
						name: "addrOwner",
						type: "address",
					},
					{
						name: "addrAuthor",
						type: "address",
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
						name: "codeIndex",
						type: "cell",
					},
					{
						name: "codeDataChunk",
						type: "cell",
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
					{
						name: "sendGasToAddr",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "setRoyalty",
				inputs: [
					{
						name: "royalty",
						type: "uint128",
					},
				],
				outputs: [],
			},
			{
				name: "setAddrApproved",
				inputs: [
					{
						name: "addrApproved",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "transfer",
				inputs: [
					{
						name: "addrTo",
						type: "address",
					},
				],
				outputs: [],
			},
			{
				name: "deployDataChunk",
				inputs: [
					{
						name: "chunk",
						type: "bytes",
					},
					{
						name: "chunkNumber",
						type: "uint128",
					},
				],
				outputs: [],
			},
			{
				name: "getAddrOwner",
				inputs: [
					{
						name: "answerId",
						type: "uint32",
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
				name: "getAddrApproved",
				inputs: [
					{
						name: "answerId",
						type: "uint32",
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
				name: "getInfo",
				inputs: [],
				outputs: [
					{
						name: "name",
						type: "string",
					},
					{
						name: "descriprion",
						type: "string",
					},
					{
						name: "addrOwner",
						type: "address",
					},
					{
						name: "addrAuthor",
						type: "address",
					},
					{
						name: "createdAt",
						type: "uint128",
					},
					{
						name: "addrRoot",
						type: "address",
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
					{
						name: "royalty",
						type: "uint128",
					},
				],
			},
			{
				name: "resolveDataChunk",
				inputs: [
					{
						name: "addrData",
						type: "address",
					},
					{
						name: "chunkNumber",
						type: "uint128",
					},
				],
				outputs: [
					{
						name: "addrDataChunk",
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
				name: "_deployed",
				inputs: [],
				outputs: [
					{
						name: "_deployed",
						type: "bool",
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
				name: "_codeDataChunk",
				type: "cell",
			},
			{
				name: "_name",
				type: "string",
			},
			{
				name: "_descriprion",
				type: "string",
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
				name: "_createdAt",
				type: "uint128",
			},
			{
				name: "_addrRoot",
				type: "address",
			},
			{
				name: "_contentHash",
				type: "uint256",
			},
			{
				name: "_mimeType",
				type: "string",
			},
			{
				name: "_chunks",
				type: "uint8",
			},
			{
				name: "_chunkSize",
				type: "uint128",
			},
			{
				name: "_size",
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
				name: "_meta",
				type: "tuple",
			},
			{
				name: "_id",
				type: "uint256",
			},
			{
				name: "_deployed",
				type: "bool",
			},
			{
				name: "_royalty",
				type: "uint128",
			},
			{
				name: "_addrApproved",
				type: "address",
			},
		],
	},
	tvc: "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",
	code: "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",
	codeHash: "63c6992f9a8a48e9e20ef6bc6bdaabf2afeb0afe7821b00b6386f4b4d2b275a4",
};
module.exports = {DataContract};
