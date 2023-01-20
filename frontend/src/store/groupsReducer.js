import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";
const GET_USER_GROUPS = "groups/GET_USER_GROUPS";
const GET_SINGLE_GROUP = "groups/GET_SINGLE_GROUP";
const GET_GROUP_MEMBERSHIPS = "groups/GET_GROUP_MEMBERSHIPS";
const POST_GROUP = "groups/POST_GROUP";
const PUT_GROUP = "groups/PUT_GROUP";
const POST_GROUP_IMAGE = "groupImages/POST_GROUP_IMAGE";
const DELETE_GROUP = "groups/DELETE_GROUP";

// Action creators

// GET actions
const actionGetAllGroups = allGroups => {
	const allGroupsObj = {};
	allGroups.forEach(group => {
		allGroupsObj[group.id] = group;
	});
	return {
		type: GET_ALL_GROUPS,
		payload: allGroupsObj
	};
};

const actionGetGroupMemberships = memberships => {
	const membershipsObj = {};
	memberships.forEach(member => {
		membershipsObj[member.id] = member;
	});
	return {
		type: GET_GROUP_MEMBERSHIPS,
		payload: membershipsObj
	};
};

const actionGetUserGroups = userGroups => {
	const userGroupsObj = {};
	userGroups.forEach(group => {
		userGroupsObj[group.id] = group;
	});
	return {
		type: GET_USER_GROUPS,
		payload: userGroupsObj
	};
};

const actionGetSingleGroup = singleGroup => {
	return {
		type: GET_SINGLE_GROUP,
		payload: singleGroup
	};
};

// POST actions
const actionPostGroup = newGroup => {
	return {
		type: POST_GROUP,
		payload: newGroup
	};
};

const actionPostGroupImage = image => {
	return {
		type: POST_GROUP_IMAGE,
		payload: image
	};
};

// PUT actions
const actionPutGroup = updatedGroup => {
	return {
		type: PUT_GROUP,
		payload: updatedGroup
	};
};

// DELETE actions
const actionDeleteGroup = groupId => {
	return {
		type: DELETE_GROUP,
		payload: groupId
	};
};

// Thunks

// GET thunks
export const thunkGetAllGroups = () => async dispatch => {
	const response = await fetch("/api/groups");
	if (response.ok) {
		const data = await response.json();
		dispatch(actionGetAllGroups(data.Groups));
		return data;
	}
};
export const thunkGetGroupMemberships = groupId => async dispatch => {
	const response = await fetch(`/api/groups/${groupId}/members`);
	if (response.ok) {
		const data = await response.json();
		dispatch(actionGetGroupMemberships(data.Members));
		return data;
	}
};
export const thunkGetUserGroups = () => async dispatch => {
	const response = await csrfFetch("/api/groups/current");
	if (response.ok) {
		const data = await response.json();
		dispatch(actionGetUserGroups(data.Groups));
		return data;
	}
};
export const thunkGetSingleGroup = groupId => async dispatch => {
	const response = await fetch(`/api/groups/${groupId}`);
	if (response.ok) {
		const data = await response.json();
		dispatch(actionGetSingleGroup(data));
		return data;
	}
};

// PUT thunks
export const thunkPutGroup = (updatedGroup, groupId) => async dispatch => {
	const res = await csrfFetch(`/api/groups/${groupId}`, {
		method: "PUT",
		body: JSON.stringify(updatedGroup),
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (res.ok) {
		const data = await res.json();
		dispatch(actionPutGroup(data));
		return data;
	} else {
		return res;
	}
};

// POST thunks
export const thunkPostGroup = newGroup => async dispatch => {
	const response = await csrfFetch("/api/groups", {
		method: "POST",
		body: JSON.stringify(newGroup),
		headers: {
			"Content-Type": "application/json"
		}
	});
	if (response.ok) {
		const data = await response.json();
		dispatch(actionPostGroup(data));
		return data;
	} else {
		return response;
	}
};
export const thunkPostGroupImage = (image, groupId) => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}/images`, {
		method: "POST",
		body: JSON.stringify(image),
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(actionPostGroupImage(data));
		return data;
	} else {
		return response;
	}
};

// DELETE thunks
export const thunkDeleteGroup = groupId => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}`, {
		method: "DELETE"
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(actionDeleteGroup(groupId));
		return data;
	} else {
		return response;
	}
};

const initialState = {
	allGroups: {},
	singleGroup: {},
	userGroups: {},
	groupMembers: {}
};

export default function groupsReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case GET_ALL_GROUPS:
			newState = { ...state };
			newState.allGroups = action.payload;
			return newState;
		case POST_GROUP:
			newState = { ...state };
			const { id } = action.payload;
			newState.allGroups[id] = action.payload;
			return newState;
		case GET_USER_GROUPS:
			newState = { ...state };
			newState.userGroups = { ...action.payload };
			console.log(newState.userGroups);
			return newState;
		case GET_SINGLE_GROUP:
			newState = { ...state };
			newState.singleGroup = { ...action.payload };
			return newState;
		case DELETE_GROUP:
			newState = { ...state };
			const { groupId } = action.payload;
			delete newState.allGroups[groupId];
			return newState;
		case PUT_GROUP:
			newState = { ...state };
			const updatedGroupId = action.payload.id;
			newState.allGroups[updatedGroupId] = { ...action.payload };
			return newState;
		case GET_GROUP_MEMBERSHIPS:
			newState = { ...state };
			newState.groupMembers = { ...state.groupMembers };
			newState.groupMembers = action.payload;
			return newState;
		default:
			return state;
	}
}
