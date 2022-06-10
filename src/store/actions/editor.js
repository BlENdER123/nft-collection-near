import {UPDATE_ALL_DATA, CREATE_NEW_LAYER, UPDATE_ONE_LAYER} from "./types";

export function updateAllData(data) {
	console.log(data);
	return {
		type: UPDATE_ALL_DATA,
		payload: data,
	};
}
export function updateOneLayer(data) {
	return {
		type: UPDATE_ONE_LAYER,
		payload: data,
	};
}
export function createNewLayer(data) {
	return {
		type: CREATE_NEW_LAYER,
		payload: data,
	};
}
