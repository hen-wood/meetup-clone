import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";
const GET_USER_GROUPS = "groups/GET_USER_GROUPS";
const GET_SINGLE_GROUP = "groups/GET_SINGLE_GROUP";
const CREATE_GROUP = "groups/CREATE_GROUP";
const UPDATE_GROUP = "groups/UPDATE_GROUP";
const ADD_GROUP_IMAGE = "groupImages/ADD_GROUP_IMAGE";
const REMOVE_GROUP = "groups/REMOVE_GROUP";

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

const setSingleGroup = singleGroup => {
	return {
		type: GET_SINGLE_GROUP,
		payload: singleGroup
	};
};

const createGroup = newGroup => {
	return {
		type: CREATE_GROUP,
		payload: newGroup
	};
};

const updateGroup = updatedGroup => {
	return {
		type: UPDATE_GROUP,
		payload: updatedGroup
	};
};

const addGroupImage = image => {
	return {
		type: ADD_GROUP_IMAGE,
		payload: image
	};
};

const removeGroup = groupId => {
	return {
		type: REMOVE_GROUP,
		payload: groupId
	};
};

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

export const putGroup = (updatedGroup, groupId) => async dispatch => {
	const res = await csrfFetch(`/api/groups/${groupId}`, {
		method: "PUT",
		body: JSON.stringify(updatedGroup),
		headers: {
			"Content-Type": "application/json"
		}
	});

	const data = await res.json();
	dispatch(updateGroup(data));
	// return res;
};

export const postGroupImage = (image, groupId) => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}/images`, {
		method: "POST",
		body: JSON.stringify(image),
		headers: {
			"Content-Type": "application/json"
		}
	});

	const data = await response.json();
	dispatch(addGroupImage(data));
	return data;
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

export const getSingleGroup = groupId => async dispatch => {
	const response = await fetch(`/api/groups/${groupId}`);
	const data = await response.json();
	dispatch(setSingleGroup(data));
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
	return data;
};

export const deleteGroup = groupId => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}`, {
		method: "DELETE"
	});
	const data = await response.json();
	dispatch(removeGroup(groupId));
	return data;
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
		case GET_SINGLE_GROUP:
			newState = { ...state };
			newState.singleGroup = action.payload;
			return newState;
		case REMOVE_GROUP:
			newState = { ...state };
			const { groupId } = action.payload;
			delete newState.allGroups[groupId];
			return newState;
		case UPDATE_GROUP:
			newState = { ...state };
			const updatedGroupId = action.payload.id;
			newState.allGroups[updatedGroupId] = { ...action.payload };
			return newState;
		default:
			return state;
	}
}
