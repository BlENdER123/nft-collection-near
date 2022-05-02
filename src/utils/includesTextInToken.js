export default function includesTextInToken(token, text) {
	return (
		token.symbol.toLowerCase().includes(text.toLowerCase()) ||
		token.tokenName.toLowerCase().includes(text.toLowerCase())
	);
}
