import produce from "immer";

import {
	UPDATE_ALL_DATA,
	CREATE_NEW_LAYER,
	UPDATE_ONE_LAYER,
} from "../actions/types";

const initialState = JSON.parse(localStorage.getItem("class")) ?? {
	projectState: [
		{
			name: "background",
			active: true,
			imgs: [],
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			z_index: 0,
			rarityLayer: "4",
		},
	],
};

// name: "background",
// active: true,
// imgs: [{
//     src: "",
//     url: "",
//     name: "",
//     rarity: "4",
//     width: 0,
//     height: 0,
// }],
// x: 0,
// y: 0,
// width: 0,
// height: 0,
// z_index: 0,
// rarityLayer: "4"

export default function editorReducer(state = initialState, action) {
	switch (action.type) {
		case UPDATE_ALL_DATA:
			return {...state, projectState: action.payload};
		case UPDATE_ONE_LAYER:
			return {
				...state,
				projectState: [
					...state.projectState.slice(0, action.payload.index),
					action.payload.updatedLayer,
					...state.projectState.slice(action.payload.index + 1),
				],
			};
		case CREATE_NEW_LAYER:
			return {
				...state,
				projectState: [
					...state.projectState,
					action.payload,
					// ...state.projectState.slice(action.payload.index + 1)
				],
			};
		default:
			return state;
	}
}
