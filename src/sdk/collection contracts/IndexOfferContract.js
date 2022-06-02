const IndexOfferContract = {
	abi: {
		"ABI version": 2,
		version: "2.1",
		header: ["time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "addrNft",
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
			},
			{
				name: "destruct",
				inputs: [
					{
						name: "sendGasToAddr",
						type: "address",
					},
				],
				outputs: [],
			},
		],
		data: [
			{
				key: 1,
				name: "_addrOffer",
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
				name: "_addrMarket",
				type: "address",
			},
			{
				name: "_addrOwner",
				type: "address",
			},
			{
				name: "_addrOffer",
				type: "address",
			},
			{
				name: "_addrNft",
				type: "address",
			},
		],
	},
	tvc: "te6ccgECGgEAA2gAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAgaK2zUZBAQkiu1TIOMDIMD/4wIgwP7jAvILFgYFGALm7UTQ10nDAfhmjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gkh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zz4R27yfAwHA1jtRNDXScMB+GYi0NMD+kAw+GmpOADcIccA4wIh1w0f8rwh4wMB2zz4R27yfBUVBwM6IIILo63XuuMCIIIQFe/A2rrjAiCCEEdWVNy64wIRDwgEkDD4Qm7jAPhG8nP6QZXU0dD6QN/R+EGIyM+OK2zWzM7J2zwgbvLQZSBu8n/Q+kD6QDD4SfhMxwXy4GT4AAH4avhr+G3bPH/4ZwwZCRICGNAgizits1jHBYqK4goLAQrXTdDbPAsAQtdM0IsvSkDXJvQEMdMJMYsvShjXJiDXSsIBktdNkjBt4gIW7UTQ10nCAYqOgOIUDQH+cO1E0PQFjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+GqNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4a3EhgED0Do4kjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE3w4AbPhsjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+G2AQPQO8r3XC//4YnD4YwOEMPhG8uBM+EJu4wDR2zwjjigl0NMB+kAwMcjPhyDOcc8LYV4gyM+SV78Das5ZyM4ByM7Nzc3JcPsAkl8D4uMAf/hnFBASAAz4SvhL+EwDODD4RvLgTPhCbuMA+kGV1NHQ+kDf0ds82zx/+GcUExIASPhN+Ez4S/hK+EP4QsjL/8s/z4POVSDIzlnIzgHIzs3NzcntVAAw+En4TMcF8uBkyM+FCM6Ab89AyYEAoPsAAFDtRNDT/9M/0wAx+kDU0dD6QNTR0PpA1NHQ+kDR+G34bPhr+Gr4Y/hiAAr4RvLgTAIK9KQg9KEYFwAUc29sIDAuNDkuMAAAAAwg+GHtHtk=",
	code: "te6ccgECFwEAAzsAAgaK2zUWAQQkiu1TIOMDIMD/4wIgwP7jAvILEwMCFQLm7UTQ10nDAfhmjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gkh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zz4R27yfAkEA1jtRNDXScMB+GYi0NMD+kAw+GmpOADcIccA4wIh1w0f8rwh4wMB2zz4R27yfBISBAM6IIILo63XuuMCIIIQFe/A2rrjAiCCEEdWVNy64wIODAUEkDD4Qm7jAPhG8nP6QZXU0dD6QN/R+EGIyM+OK2zWzM7J2zwgbvLQZSBu8n/Q+kD6QDD4SfhMxwXy4GT4AAH4avhr+G3bPH/4ZwkWBg8CGNAgizits1jHBYqK4gcIAQrXTdDbPAgAQtdM0IsvSkDXJvQEMdMJMYsvShjXJiDXSsIBktdNkjBt4gIW7UTQ10nCAYqOgOIRCgH+cO1E0PQFjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+GqNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4a3EhgED0Do4kjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE3wsAbPhsjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+G2AQPQO8r3XC//4YnD4YwOEMPhG8uBM+EJu4wDR2zwjjigl0NMB+kAwMcjPhyDOcc8LYV4gyM+SV78Das5ZyM4ByM7Nzc3JcPsAkl8D4uMAf/hnEQ0PAAz4SvhL+EwDODD4RvLgTPhCbuMA+kGV1NHQ+kDf0ds82zx/+GcREA8ASPhN+Ez4S/hK+EP4QsjL/8s/z4POVSDIzlnIzgHIzs3NzcntVAAw+En4TMcF8uBkyM+FCM6Ab89AyYEAoPsAAFDtRNDT/9M/0wAx+kDU0dD6QNTR0PpA1NHQ+kDR+G34bPhr+Gr4Y/hiAAr4RvLgTAIK9KQg9KEVFAAUc29sIDAuNDkuMAAAAAwg+GHtHtk=",
	codeHash: "9fc53d67a53f29d94ac46d9763e7188736f650d0528b0e4d598e2d3b877586dc",
};
module.exports = {IndexOfferContract};
