import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {decrypt} from "../extensions/seedPhrase";
import {getClientKeys} from "../extensions/webhook/script";

export default function useKeyPair() {
	const encryptedSeedPhrase = useSelector(
		(state) => state.enterSeedPhrase.encryptedSeedPhrase,
	);
	const seedPhrasePassword = useSelector(
		(state) => state.enterSeedPhrase.seedPhrasePassword,
	);

	const [keyPair, setKeyPair] = useState(null);

	useEffect(async () => {
		if (!encryptedSeedPhrase || !seedPhrasePassword) return;

		const decrypted = await decrypt(encryptedSeedPhrase, seedPhrasePassword);
		const keys = await getClientKeys(decrypted.phrase);

		setKeyPair(keys);
	}, [encryptedSeedPhrase, seedPhrasePassword]);

	return {
		keyPair,
	};
}
