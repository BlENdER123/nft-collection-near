const IndexContract = {
	abi: {
		"ABI version": 2,
		version: "2.1",
		header: ["time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "root",
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
				name: "destruct",
				inputs: [],
				outputs: [],
			},
		],
		data: [
			{
				key: 1,
				name: "_addrData",
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
				name: "_addrRoot",
				type: "address",
			},
			{
				name: "_addrOwner",
				type: "address",
			},
			{
				name: "_addrData",
				type: "address",
			},
		],
	},
	tvc: "te6ccgECGgEAA1gAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAgaK2zUZBAQkiu1TIOMDIMD/4wIgwP7jAvILFgYFGALm7UTQ10nDAfhmjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gkh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zz4R27yfA4HA1jtRNDXScMB+GYi0NMD+kAw+GmpOADcIccA4wIh1w0f8rwh4wMB2zz4R27yfBUVBwM8IIIQFe/A2rrjAiCCEEdWVNy64wIgghBHxi3auuMCEQoIAyYw+Eby4Ez4Qm7jANHbPNs8f/hnFAkSADT4SfhMxwXy4GT4TMjPhQjOgG/PQMmBAKD7AATkMPhCbuMA+Ebyc/pBldTR0PpA39H4QYjIz44rbNbMzsnbPCBu8tBlIG7yf9D6QPpAMPhJ+EzHBfLgZPgAIfhq+GuNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATHBZMg+GreMNs8f/hnDhkLEgIY0CCLOK2zWMcFioriDA0BCtdN0Ns8DQBC10zQiy9KQNcm9AQx0wkxiy9KGNcmINdKwgGS102SMG3iAhbtRNDXScIBio6A4hQPAf5w7UTQ9AWNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4ao0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPhrcSGAQPQOjiSNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATfEAAg+GyAQPQO8r3XC//4YnD4YwOEMPhG8uBM+EJu4wDR2zwjjigl0NMB+kAwMcjPhyDOcc8LYV4gyM+SV78Das5ZyM4ByM7Nzc3JcPsAkl8D4uMAf/hnFBMSADr4TPhL+Er4Q/hCyMv/yz/Pg85ZyM4ByM7NzcntVAAM+Er4S/hMAELtRNDT/9M/0wAx+kDU0dD6QNTR0PpA0fhs+Gv4avhj+GIACvhG8uBMAgr0pCD0oRgXABRzb2wgMC40OS4wAAAADCD4Ye0e2Q==",
	code: "te6ccgECFwEAAysAAgaK2zUWAQQkiu1TIOMDIMD/4wIgwP7jAvILEwMCFQLm7UTQ10nDAfhmjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gkh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zz4R27yfAsEA1jtRNDXScMB+GYi0NMD+kAw+GmpOADcIccA4wIh1w0f8rwh4wMB2zz4R27yfBISBAM8IIIQFe/A2rrjAiCCEEdWVNy64wIgghBHxi3auuMCDgcFAyYw+Eby4Ez4Qm7jANHbPNs8f/hnEQYPADT4SfhMxwXy4GT4TMjPhQjOgG/PQMmBAKD7AATkMPhCbuMA+Ebyc/pBldTR0PpA39H4QYjIz44rbNbMzsnbPCBu8tBlIG7yf9D6QPpAMPhJ+EzHBfLgZPgAIfhq+GuNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATHBZMg+GreMNs8f/hnCxYIDwIY0CCLOK2zWMcFioriCQoBCtdN0Ns8CgBC10zQiy9KQNcm9AQx0wkxiy9KGNcmINdKwgGS102SMG3iAhbtRNDXScIBio6A4hEMAf5w7UTQ9AWNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4ao0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPhrcSGAQPQOjiSNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATfDQAg+GyAQPQO8r3XC//4YnD4YwOEMPhG8uBM+EJu4wDR2zwjjigl0NMB+kAwMcjPhyDOcc8LYV4gyM+SV78Das5ZyM4ByM7Nzc3JcPsAkl8D4uMAf/hnERAPADr4TPhL+Er4Q/hCyMv/yz/Pg85ZyM4ByM7NzcntVAAM+Er4S/hMAELtRNDT/9M/0wAx+kDU0dD6QNTR0PpA0fhs+Gv4avhj+GIACvhG8uBMAgr0pCD0oRUUABRzb2wgMC40OS4wAAAADCD4Ye0e2Q==",
	codeHash: "52c9bdc0200d3f3542c0c841a50638e4226709ea5f61c46dcb24fcb38a541b40",
};
module.exports = {IndexContract};
