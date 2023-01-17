import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";

const setGroups = allGroups => {
	const allGroupsObj = {};
	allGroups.forEach(group => {
		allGroupsObj[group.id] = group;
	});
	return {
		type: GET_ALL_GROUPS,
		payload: allGroupsObj
	};
};

const GET_USER_GROUPS = "groups/GET_USER_GROUPS";

const setUserGroups = userGroups => {
	const userGroupsObj = {};
	userGroups.forEach(group => {
		userGroupsObj[group.id] = group;
	});
	return {
		type: GET_USER_GROUPS,
		payload: userGroupsObj
	};
};

const CREATE_GROUP = "groups/CREATE_GROUP";

const createGroup = newGroup => {
	return {
		type: CREATE_GROUP,
		payload: newGroup
	};
};

export const getAllGroups = () => async dispatch => {
	const response = await fetch("/api/groups");
	const data = await response.json();
	dispatch(setGroups(data.Groups));
	return response;
};

export const getUserGroups = () => async dispatch => {
	const response = await csrfFetch("/api/groups/current");
	const data = await response.json();
	dispatch(setUserGroups(data.Groups));
	return response;
};

export const postGroup = newGroup => async dispatch => {
	const response = await csrfFetch("/api/groups", {
		method: "POST",
		body: JSON.stringify(newGroup),
		headers: {
			"Content-Type": "application/json"
		}
	});
	const data = await response.json();
	dispatch(createGroup(data));
	return response;
};

const initialState = {
	allGroups: {},
	singleGroup: null,
	userGroups: {}
};

export default function groupsReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case GET_ALL_GROUPS:
			newState = { ...state };
			newState.allGroups = action.payload;
			return newState;
		case CREATE_GROUP:
			newState = { ...state };
			const { id } = action.payload;
			newState.allGroups[id] = action.payload;
			return newState;
		case GET_USER_GROUPS:
			newState = { ...state };
			newState.userGroups = action.payload;
			return newState;
		default:
			return state;
	}
}
