import io from "socket.io-client";

//import axios from "axios";

const SOCKET_URL = "http://localhost:3008";
let socket;

export const initWebSocket = (dispatch, accountId) => {
	socket = io(SOCKET_URL, {
		query: {
			token: accountId,
		},
	});
	if (socket) {
		socket.on("connect", function () {
			console.log("Connected", window.walletAccount["WalletConnection"]);
			dispatch({
				type: "CONNECT_WALLET_SUCCESS",
				payload: {
					allKeys: ["ed25519:25zcnn92FEJf3gLcNmeoPpEWsC6uiLNAqcMSJDYo3B2P"],
					accountId: "oliver",
					_authDataKey: "undefined_wallet_auth_key",
					_networkId: "default",
					_walletBaseUrl: "https://wallet.testnet.near.org",
				},
			});

			// socket.emit("clien.connect", {userId: "olivertest.testnet"});
		});
		socket.on("events", function (data) {
			console.log("event", data);
		});
		socket.on("sendall", function (data) {
			console.log("sendall", data);
		});
		socket.on("disconnect", function () {
			console.log("Disconnected");
		});
	}
};

export const switchChannel = (prevChannel, channel) => {
	if (socket) {
		socket.emit("CHANNEL_SWITCH", {prevChannel, channel});
	}
};
export const subscribeToMessages = (callback) => {
	if (!socket) {
		return;
	}
	socket.once("details", (args) => {
		// ...
	});
};

export const sendMessage = (data) => {
	if (!socket) {
		return;
	}

	socket.emit("MESSAGE_SEND", data);
};

export const fetchChannels = async () => {
	const response = await axios.get(`${SOCKET_URL}/getChannels`);

	return response.data.channels;
};

export const fetchChannelMessages = async (channel) => {
	const response = await axios.get(
		`${SOCKET_URL}/channels/${channel}/messages`,
	);

	return response.data.allMessages;
};
