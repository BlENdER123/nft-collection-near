const initialState = {
	errorModal: {
		hidden: true,
		message: "",
	},
};

export default function errorModalReducer(state = initialState, action) {
	switch (action.type) {
		case "openError":
			return {
				...state,
				errorModal: {
					hidden: false,
					message: action.payload,
				},
			};
		case "closeError":
			return {
				...state,
				errorModal: {
					hidden: true,
					message: "",
				},
			};
		default:
			return state;
	}
}
