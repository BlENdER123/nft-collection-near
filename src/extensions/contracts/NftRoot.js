const NftRootContract = {
	abi: {
		"ABI version": 2,
		version: "2.1",
		header: ["pubkey", "time", "expire"],
		functions: [
			{
				name: "constructor",
				inputs: [
					{
						name: "codeIndex",
						type: "cell",
					},
					{
						name: "codeData",
						type: "cell",
					},
					{
						name: "codeLockStakeSafe",
						type: "cell",
					},
				],
				outputs: [],
			},
			{
				name: "createLockStakeSafeWithNftKey",
				inputs: [
					{
						name: "_donor",
						type: "address",
					},
					{
						name: "_depoolAddress",
						type: "address",
					},
					{
						name: "_depoolFee",
						type: "uint128",
					},
					{
						name: "_depoolMinStake",
						type: "uint128",
					},
					{
						name: "_amountLockStake",
						type: "uint128",
					},
					{
						name: "_periodLockStake",
						type: "uint32",
					},
					{
						name: "_apyLockStake",
						type: "uint32",
					},
				],
				outputs: [
					{
						name: "createAmount",
						type: "uint128",
					},
					{
						name: "addressNftKey",
						type: "address",
					},
					{
						name: "addressLockStakeSafe",
						type: "address",
					},
				],
			},
			{
				name: "deployBasis",
				inputs: [
					{
						name: "codeIndexBasis",
						type: "cell",
					},
				],
				outputs: [],
			},
			{
				name: "destructBasis",
				inputs: [],
				outputs: [],
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
				name: "_codeData",
				type: "cell",
			},
			{
				name: "_codeIndex",
				type: "cell",
			},
			{
				name: "_totalMinted",
				type: "uint256",
			},
			{
				name: "_addrBasis",
				type: "address",
			},
			{
				name: "_codeLockStakeSafe",
				type: "cell",
			},
		],
	},
	tvc: "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",
	code: "te6ccgECLAEACBcABCSK7VMg4wMgwP/jAiDA/uMC8gspBAErAQACAvztRNDXScMB+GaNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4aSHbPNMAAY4dgQIA1xgg+QEB0wABlNP/AwGTAvhC4iD4ZfkQ8qiV0wAB8nri0z8B+EMhufK0IPgjgQPoqIIIG3dAoLnytPhj0x8B+CO88rkcAwEU0x8B2zz4R27yfAUDWO1E0NdJwwH4ZiLQ0wP6QDD4aak4ANwhxwDjAiHXDR/yvCHjAwHbPPhHbvJ8KCgFAiggghAzNtDcu+MCIIIQfZWKwLvjAg8GBFAgghBGg6gDuuMCIIIQSMLUlrrjAiCCEHdrmoC64wIgghB9lYrAuuMCDQsJBwMmMPhG8uBM+EJu4wDR2zzjAH/4ZycIHwBK+E3Iz4WIzo0FTmJaAAAAAAAAAAAAAAAAAAAj4xbtQM8WyXD7AAOmMPhG8uBM+EJu4wD6QZXU0dD6QN/6QZXU0dD6QN/R2zwhjigj0NMB+kAwMcjPhyDOjQQAAAAAAAAAAAAAAAAPdrmoCM8Wy//JcPsAkTDi4wB/+GcnCh8BEnBfIts8+QBsMRoDKDD4RvLgTPhCbuMA1NHbPNs8f/hnJwwfAexopv5gghAdzWUAvPLgaNs8bXDIy/9wWIBA9EMByMv/cliAQPRD+ChxWIBA9BbI9ADJAcjPhID0APQAz4HJXyD5AMjPigBAy//J0AEhyM+FiM6NBJBfXhAAAAAAAAAAAAAAAAAAAcDPFszPkNFqvn/JcPsA+G0wIAOWMPhG8uBM+EJu4wD6QZXU0dD6QN/XDf+V1NHQ0//f0ds8IY4fI9DTAfpAMDHIz4cgznHPC2EByM+TGg6gDs7NyXD7AJEw4uMAf/hnJw4fAnSNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQi2zxTAts8+QBwyM+GQMoHy//J0GxBIRYEUCCCEAQQX6e64wIgghAEKYxjuuMCIIIQHXhkybrjAiCCEDM20Ny64wIeGxcQA/4w+Eby4Ez4Qm7jAPpBldTR0PpA3/pBldTR0PpA39cNf5XU0dDTf9/XDX+V1NHQ03/f1w1/ldTR0NN/39cNH5XU0dDTH9/XDR+V1NHQ0x/f0ds8I44mJdDTAfpAMDHIz4cgznHPC2FeIMjPkszbQ3LLf84ByM7Nzclw+wCSXwPiJxIRAQrbPH/4Zx8B1nCNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARopv5gJoIQTXxtAKC1f4IQTXxtAKC1f4IQBfXhAKC1f74gEwP8jikwVHVnoLV/pwO1f4IQC+vCAKC1f74gjhAwJMIAIJkwJIIQIdWfALne3t7y4Gb4J28QaKb+YKG1f4IQBfXhAKC1f3L7Amim/mAz+EUgbpIwcN74JfgV+CYk+CjbPCD4TNs8IPkAyM+KAEDL/8nQN20lyMv/cFiAQPRDLnFYIRYUAfyAQPQWJ3JYgED0Fi3Iy39zWIBA9EMsyMt/dFiAQPRDJMjL/3VYgED0Q8j0AMn4TsjPhID0APQAz4HJIPkAyM+KAEDL/8nQN1R5qyn4S/hJU3f5AMjPigBAy//J0FVgJ8jPhYjOjQSRNfG0AAAAAAAAAAAAAAAAAAHAzxbMz4MVANJVUMjPkF5iNGbOzFUwyM7Lf8sfyx/Nzclw+wA4U6v4SVMz+QDIz4oAQMv/ydBVMCTIz4WIzovgAAAAAAAAAAAAAAAAAHDPFszPg1UgyM+QJQJwjs7Lf8sfzcmBAID7ADf4TKT4bF8GbHMASm1wyMv/cFiAQPRDAcjL/3FYgED0Q8j0AMkByM+EgPQA9ADPgckDpjD4RvLgTPhCbuMA+kGV1NHQ+kDf+kGV1NHQ+kDf+kGV1NHQ+kDf0ds8IY4fI9DTAfpAMDHIz4cgznHPC2EByM+SdeGTJs7NyXD7AJEw4uMAf/hnJxgfAnaNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARTMds8UwPbPPkAcMjPhkDKB8v/ydBsURoZAERtcMjL/3BYgED0QwFxWIBA9BbI9ADJAcjPhID0APQAz4HJARwByM5czjH4S9AByds8MSICPDD4Qm7jAPhG8nPU1NTR+AAi+GsB+Gr4bjDbPH/4ZxwfAhbtRNDXScIBio6A4icdA4xw7UTQ9AWI+GqI+Gtw+GyNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4bYj4boBA9A7yvdcL//hicPhjKysrA4Iw+Eby4Ez4Qm7jANHbPCGOKCPQ0wH6QDAxyM+HIM6NBAAAAAAAAAAAAAAAAAhBBfp4zxbL/8lw+wCRMOLjAH/4ZycgHwBC+E74TfhM+Ev4SvhD+ELIy//LP8+DzMzL/1nIzszNye1UARBw+CjbPPkAMSEBGMhczjH4StAByds8MSICFiGLOK2zWMcFioriJCMBCAHbPMklASYB1NQwEtDbPMjPjits1hLMzxHJJQFm1YsvSkDXJvQE0wkxINdKkdSOgOKLL0oY1yYwAcjPi9KQ9ACAIM8LCc+L0obMEszIzxHOJgEEiAErAEbtRNDT/9M/0wAx1NTT/9TR0PpA1NH4bvht+Gz4a/hq+GP4YgAK+Eby4EwCCvSkIPShKyoAFHNvbCAwLjQ4LjAAAA==",
	codeHash: "64eb783f6473159997e8179e223ff0d956a95b0342b6390a4b05d525789ab4a3",
};
module.exports = {NftRootContract};
