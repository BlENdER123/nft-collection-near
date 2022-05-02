const GContract = {
	abi: {
		"ABI version": 2,
		header: ["time"],
		functions: [
			{
				name: "pay",
				inputs: [
					{
						name: "addr",
						type: "address",
					},
					{
						name: "count",
						type: "uint128",
					},
				],
				outputs: [],
			},
			{
				name: "constructor",
				inputs: [],
				outputs: [],
			},
		],
		data: [],
		events: [],
	},
	tvc: "te6ccgECDwEAAZ4AAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBCSK7VMg4wMgwP/jAiDA/uMC8gsMBQQOAooh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AY4d+EMhuSCfMCD4I4ED6KiCCBt3QKC53pMg+GPg8jTYMNMfAds8+Edu8nwIBgE6ItDXCwOpOADcIccA3CHXDR/yvCHdAds8+Edu8nwGAiggghAwbS+puuMCIIIQaLVfP7rjAgkHAiow+Ehu4wD4RvJzcfhm0fgA2zx/+GcICgBq7UTQINdJwgGOENP/0z/TANF/+Gj4Zvhj+GKOGPQFcAGAQPQO8r3XC//4YnD4Y3D4Zn/4aOICODD6QZXU0dD6QN/XDX+V1NHQ03/f0ds84wB/+GcLCgAg+Eb4Q/hCyMv/yz/LAMntVAB6+ACCGBnYHZYAIcAAIJMwXL7fjhJTAsjPhQjOAfoCgGvPQMlz+wCOElMSyM+FCM4B+gKAa89AyXP7AOJfAwIK9KQg9KEODQAUc29sIDAuNDUuMAAA",
};
module.exports = {GContract};
