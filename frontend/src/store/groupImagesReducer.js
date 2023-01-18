import { csrfFetch } from "./csrf";

const ADD_GROUP_IMAGE = "groupImages/ADD_GROUP_IMAGE";

const addGroupImage = image => {
	return {
		type: ADD_GROUP_IMAGE,
		payload: image
	};
};

export const postGroupImage = () => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}/images`);
};
