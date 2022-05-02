module.exports = {
	WrappedTONVaultContract: {
		abi: {
			"ABI version": 2,
			header: ["pubkey", "time", "expire"],
			functions: [
				{
					name: "constructor",
					inputs: [
						{name: "owner_", type: "address"},
						{name: "root", type: "address"},
						{name: "root_tunnel", type: "address"},
						{name: "receive_safe_fee", type: "uint128"},
						{name: "settings_deploy_wallet_grams", type: "uint128"},
						{name: "initial_balance", type: "uint128"},
					],
					outputs: [],
				},
				{
					name: "drain",
					inputs: [{name: "receiver", type: "address"}],
					outputs: [],
				},
				{
					name: "setConfiguration",
					inputs: [
						{
							components: [
								{name: "root_tunnel", type: "address"},
								{name: "root", type: "address"},
								{name: "receive_safe_fee", type: "uint128"},
								{name: "settings_deploy_wallet_grams", type: "uint128"},
								{name: "initial_balance", type: "uint128"},
							],
							name: "_configuration",
							type: "tuple",
						},
					],
					outputs: [],
				},
				{
					name: "withdraw",
					inputs: [{name: "amount", type: "uint128"}],
					outputs: [],
				},
				{
					name: "grant",
					inputs: [{name: "amount", type: "uint128"}],
					outputs: [],
				},
				{
					name: "receiveTokenWalletAddress",
					inputs: [{name: "wallet", type: "address"}],
					outputs: [],
				},
				{
					name: "wrap",
					inputs: [
						{name: "tokens", type: "uint128"},
						{name: "wallet_public_key", type: "uint256"},
						{name: "owner_address", type: "address"},
						{name: "gas_back_address", type: "address"},
					],
					outputs: [],
				},
				{
					name: "tokensReceivedCallback",
					inputs: [
						{name: "token_wallet_", type: "address"},
						{name: "token_root_", type: "address"},
						{name: "tokens_amount", type: "uint128"},
						{name: "value3", type: "uint256"},
						{name: "value4", type: "address"},
						{name: "value5", type: "address"},
						{name: "original_gas_to", type: "address"},
						{name: "value7", type: "uint128"},
						{name: "value8", type: "cell"},
					],
					outputs: [],
				},
				{
					name: "transferOwnership",
					inputs: [{name: "owner_", type: "address"}],
					outputs: [],
				},
				{name: "renounceOwnership", inputs: [], outputs: []},
				{
					name: "owner",
					inputs: [],
					outputs: [{name: "owner", type: "address"}],
				},
				{
					name: "configuration",
					inputs: [],
					outputs: [
						{
							components: [
								{name: "root_tunnel", type: "address"},
								{name: "root", type: "address"},
								{name: "receive_safe_fee", type: "uint128"},
								{name: "settings_deploy_wallet_grams", type: "uint128"},
								{name: "initial_balance", type: "uint128"},
							],
							name: "configuration",
							type: "tuple",
						},
					],
				},
				{
					name: "token_wallet",
					inputs: [],
					outputs: [{name: "token_wallet", type: "address"}],
				},
				{
					name: "total_wrapped",
					inputs: [],
					outputs: [{name: "total_wrapped", type: "uint128"}],
				},
			],
			data: [{key: 1, name: "_randomNonce", type: "uint256"}],
			events: [],
		},
		tvc: "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",
		code: "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",
	},
};
