module.exports = {
	DEXConnectorContract: {
		abi: {
			"ABI version": 2,
			header: ["pubkey", "time", "expire"],
			functions: [
				{name: "constructor", inputs: [], outputs: []},
				{
					name: "deployEmptyWallet",
					inputs: [{name: "root", type: "address"}],
					outputs: [],
				},
				{
					name: "expectedWalletAddressCallback",
					inputs: [
						{name: "wallet", type: "address"},
						{name: "wallet_public_key", type: "uint256"},
						{name: "owner_address", type: "address"},
					],
					outputs: [],
				},
				{name: "setTransferCallback", inputs: [], outputs: []},
				{name: "setBouncedCallback", inputs: [], outputs: []},
				{
					name: "transfer",
					inputs: [
						{name: "to", type: "address"},
						{name: "tokens", type: "uint128"},
						{name: "payload", type: "cell"},
					],
					outputs: [],
				},
				{
					name: "burn",
					inputs: [
						{name: "tokens", type: "uint128"},
						{name: "callback_address", type: "address"},
						{name: "callback_payload", type: "cell"},
					],
					outputs: [],
				},
				{
					name: "getBalance",
					inputs: [],
					outputs: [{name: "balance", type: "uint128"}],
				},
				{
					name: "soUINT",
					inputs: [],
					outputs: [{name: "soUINT", type: "uint256"}],
				},
				{
					name: "dexclient",
					inputs: [],
					outputs: [{name: "dexclient", type: "address"}],
				},
				{
					name: "drivenRoot",
					inputs: [],
					outputs: [{name: "drivenRoot", type: "address"}],
				},
				{
					name: "driven",
					inputs: [],
					outputs: [{name: "driven", type: "address"}],
				},
				{
					name: "statusConnected",
					inputs: [],
					outputs: [{name: "statusConnected", type: "bool"}],
				},
			],
			data: [
				{key: 1, name: "soUINT", type: "uint256"},
				{key: 2, name: "dexclient", type: "address"},
			],
			events: [],
		},
		tvc: "te6ccgECKQEAB00AAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBCSK7VMg4wMgwP/jAiDA/uMC8gsmBgQoAQAFAviNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4aSHbPNMAAY4agQIA1xgg+QEB0wABlNP/AwGTAvhC4vkQ8qiV0wAB8nri0z8B+EMhufK0IPgjgQPoqIIIG3dAoLnytPhj0x8B+CO88rnTHwHbPPhHbvJ8DQcBQiLQ0wP6QDD4aak4ANwhxwDcIdcNH/K8Id0B2zz4R27yfAcEUCCCEC6I4sS74wIgghBb0RUbu+MCIIIQaoeNM7vjAiCCEG0qjiO64wIZEwoIA0Qw+EJu4wDXDX+V1NHQ03/f+kGV1NHQ+kDf1NHbPNs8f/hnJQkjAIr4SfhLxwXy4GX4J28QaKb+YKG1f3L7AlMB+EtwJsjPkEEfJBLLf8t/zlnIzszNyfhNyM+FiM5xzwtuIc8UyYEAgPsAXwQEUCCCEF8zz0m64wIgghBgGCIIuuMCIIIQaLVfP7rjAiCCEGqHjTO64wISEAwLAVAw0ds8+EshjhuNBHAAAAAAAAAAAAAAAAA6oeNM4MjOzslw+wDef/hnJQJCMPhCbuMA+Ebyc3/4ZtH4SfhLxwXy4GX4AHD4bts8f/hnDSMCFu1E0NdJwgGKjoDiJQ4B1HDtRND0BXEhgED0DpPXC/+RcOL4anIhgED0Do4kjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE3/hrjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+GwPAHSNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4bXD4boBA9A7yvdcL//hicPhjcPhmAxww+EJu4wDR2zzbPH/4ZyURIwBu+En4S8cF8uBl+CdvEGim/mChtX9y+wL4S8jPkBcUAD7OyfhNyM+FiM5xzwtuIc8UyYEAgPsAMAFSMNHbPPhOIY4cjQRwAAAAAAAAAAAAAAAAN8zz0mDIzsoAyXD7AN5/+GclBFAgghAzNqVSuuMCIIIQTr7/UbrjAiCCEFc7gvu64wIgghBb0RUbuuMCGBYVFAFQMNHbPPhMIY4bjQRwAAAAAAAAAAAAAAAANvRFRuDIzs7JcPsA3n/4ZyUBUDDR2zz4TSGOG40EcAAAAAAAAAAAAAAAADXO4L7gyM7OyXD7AN5/+GclA0Qw+EJu4wD6QZXU0dD6QN/XDX+V1NHQ03/f1NHbPNs8f/hnJRcjAJL4SfhLxwXy4GX4J28QaKb+YKG1f3L7AiB/+EtwU1bIz5EvxYOKzst/y39VIMjOygDMzcn4TcjPhYjOcc8LbiHPFMmBAID7AF8EAVIw0ds8+EohjhyNBHAAAAAAAAAAAAAAAAAszalUoMjOy//JcPsA3n/4ZyUEUCCCEAhwHJ264wIgghARc3lcuuMCIIIQJidocbrjAiCCEC6I4sS64wIiIB4aAy4w+EJu4wD6QZXU0dD6QN/R2zzbPH/4ZyUbIwGC+En4S8cF8uBlaKb+YIIQstBeALV/vvLgZ/gnbxBopv5gobV/cvsC+E6zjoCOEfhLyM+FiM6Ab89AyYEAgPsA4jAcAdwg+Gz4S/gojQ0VCsWcgAAAAAAAAAAAAAAACy0F4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIMjOzgHIzs3JIcjPhYjOjQSRZaC8AAAAAAAAAAAAAAAAAADAzxYhzxTJcPsA+Cj4KB0Ayo0JFWzqfsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIMjOzgHIzs3JIsjPhYjOjQSRZaC8AAAAAAAAAAAAAAAAAADAzxYhzxTJcPsA+EvIz4WIzoBvz0DJgQCA+wBbAm4w0ds8IY4oI9DTAfpAMDHIz4cgzo0EAAAAAAAAAAAAAAAACmJ2hxjPFst/yXD7AJEw4uMAf/hnHyMAInD4SfhLxwXy4GX4APgnbxAxA1Qw+EJu4wD6QZXU0dD6QN/XDf+V1NHQ0//f+kGV1NHQ+kDf0ds82zx/+GclISMAmvhJ+EzHBSCdMCHAACCWMCD4KMcF3t7y4Gb4J28QaKb+YKG1f3L7An/4biL4bSLIz5Cxl2Q+zsn4S8jPhYjOcc8LbiHPFMmBAID7AF8EAxww+EJu4wDR2zzbPH/4ZyUkIwBY+E74TfhM+Ev4SvhG+EP4QsjL/8s/ygDL/1UwyM5VIMjOWcjOygDNzc3J7VQAdPhJ+EvHBfLgZfgnbxBopv5gobV/cvsCf/hLyM+Rx7uh1s7KAMn4TcjPhYjOcc8LbiHPFMmBAID7ADAAWu1E0NP/0z/SANP/1NHQ+kDU0dD6QNTR0PpA0gDR+G74bfhs+Gv4avhm+GP4YgIK9KQg9KEoJwAUc29sIDAuNDcuMAAA",
		code: "te6ccgECJgEAByAABCSK7VMg4wMgwP/jAiDA/uMC8gsjAwElAQACAviNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4aSHbPNMAAY4agQIA1xgg+QEB0wABlNP/AwGTAvhC4vkQ8qiV0wAB8nri0z8B+EMhufK0IPgjgQPoqIIIG3dAoLnytPhj0x8B+CO88rnTHwHbPPhHbvJ8CgQBQiLQ0wP6QDD4aak4ANwhxwDcIdcNH/K8Id0B2zz4R27yfAQEUCCCEC6I4sS74wIgghBb0RUbu+MCIIIQaoeNM7vjAiCCEG0qjiO64wIWEAcFA0Qw+EJu4wDXDX+V1NHQ03/f+kGV1NHQ+kDf1NHbPNs8f/hnIgYgAIr4SfhLxwXy4GX4J28QaKb+YKG1f3L7AlMB+EtwJsjPkEEfJBLLf8t/zlnIzszNyfhNyM+FiM5xzwtuIc8UyYEAgPsAXwQEUCCCEF8zz0m64wIgghBgGCIIuuMCIIIQaLVfP7rjAiCCEGqHjTO64wIPDQkIAVAw0ds8+EshjhuNBHAAAAAAAAAAAAAAAAA6oeNM4MjOzslw+wDef/hnIgJCMPhCbuMA+Ebyc3/4ZtH4SfhLxwXy4GX4AHD4bts8f/hnCiACFu1E0NdJwgGKjoDiIgsB1HDtRND0BXEhgED0DpPXC/+RcOL4anIhgED0Do4kjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE3/hrjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+GwMAHSNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4bXD4boBA9A7yvdcL//hicPhjcPhmAxww+EJu4wDR2zzbPH/4ZyIOIABu+En4S8cF8uBl+CdvEGim/mChtX9y+wL4S8jPkBcUAD7OyfhNyM+FiM5xzwtuIc8UyYEAgPsAMAFSMNHbPPhOIY4cjQRwAAAAAAAAAAAAAAAAN8zz0mDIzsoAyXD7AN5/+GciBFAgghAzNqVSuuMCIIIQTr7/UbrjAiCCEFc7gvu64wIgghBb0RUbuuMCFRMSEQFQMNHbPPhMIY4bjQRwAAAAAAAAAAAAAAAANvRFRuDIzs7JcPsA3n/4ZyIBUDDR2zz4TSGOG40EcAAAAAAAAAAAAAAAADXO4L7gyM7OyXD7AN5/+GciA0Qw+EJu4wD6QZXU0dD6QN/XDX+V1NHQ03/f1NHbPNs8f/hnIhQgAJL4SfhLxwXy4GX4J28QaKb+YKG1f3L7AiB/+EtwU1bIz5EvxYOKzst/y39VIMjOygDMzcn4TcjPhYjOcc8LbiHPFMmBAID7AF8EAVIw0ds8+EohjhyNBHAAAAAAAAAAAAAAAAAszalUoMjOy//JcPsA3n/4ZyIEUCCCEAhwHJ264wIgghARc3lcuuMCIIIQJidocbrjAiCCEC6I4sS64wIfHRsXAy4w+EJu4wD6QZXU0dD6QN/R2zzbPH/4ZyIYIAGC+En4S8cF8uBlaKb+YIIQstBeALV/vvLgZ/gnbxBopv5gobV/cvsC+E6zjoCOEfhLyM+FiM6Ab89AyYEAgPsA4jAZAdwg+Gz4S/gojQ0VCsWcgAAAAAAAAAAAAAAACy0F4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIMjOzgHIzs3JIcjPhYjOjQSRZaC8AAAAAAAAAAAAAAAAAADAzxYhzxTJcPsA+Cj4KBoAyo0JFWzqfsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIMjOzgHIzs3JIsjPhYjOjQSRZaC8AAAAAAAAAAAAAAAAAADAzxYhzxTJcPsA+EvIz4WIzoBvz0DJgQCA+wBbAm4w0ds8IY4oI9DTAfpAMDHIz4cgzo0EAAAAAAAAAAAAAAAACmJ2hxjPFst/yXD7AJEw4uMAf/hnHCAAInD4SfhLxwXy4GX4APgnbxAxA1Qw+EJu4wD6QZXU0dD6QN/XDf+V1NHQ0//f+kGV1NHQ+kDf0ds82zx/+GciHiAAmvhJ+EzHBSCdMCHAACCWMCD4KMcF3t7y4Gb4J28QaKb+YKG1f3L7An/4biL4bSLIz5Cxl2Q+zsn4S8jPhYjOcc8LbiHPFMmBAID7AF8EAxww+EJu4wDR2zzbPH/4ZyIhIABY+E74TfhM+Ev4SvhG+EP4QsjL/8s/ygDL/1UwyM5VIMjOWcjOygDNzc3J7VQAdPhJ+EvHBfLgZfgnbxBopv5gobV/cvsCf/hLyM+Rx7uh1s7KAMn4TcjPhYjOcc8LbiHPFMmBAID7ADAAWu1E0NP/0z/SANP/1NHQ+kDU0dD6QNTR0PpA0gDR+G74bfhs+Gv4avhm+GP4YgIK9KQg9KElJAAUc29sIDAuNDcuMAAA",
	},
};
