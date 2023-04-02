import { csrfFetch } from "./csrf";
import { actionGetUserEvents } from "./eventsReducer";

const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";
const GET_USER_GROUPS = "groups/GET_USER_GROUPS";
const GET_SINGLE_GROUP = "groups/GET_SINGLE_GROUP";
const GET_GROUP_MEMBERSHIPS = "groups/GET_GROUP_MEMBERSHIPS";
const POST_GROUP = "groups/POST_GROUP";
const ADD_MEMBERSHIP = "groups/ADD_MEMBERSHIP";
const UPGRADE_MEMBER_TO_COHOST = "groups/UPGRADE_MEMBER_TO_COHOST";
const UPGRADE_MEMBER_FROM_PENDING = "groups/UPGRADE_MEMBER_FROM_PENDING";
const PUT_GROUP = "groups/PUT_GROUP";
const POST_GROUP_IMAGE = "groupImages/POST_GROUP_IMAGE";
const DELETE_GROUP = "groups/DELETE_GROUP";
const DELETE_MEMBERSHIP = "groups/DELETE_MEMBERSHIP";
const RESET_SINGLE_GROUP = "groups/RESET_SINGLE_GROUP";

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

const actionAddMembership = (user, membership) => {
	return {
		type: ADD_MEMBERSHIP,
		payload: { ...user, Membership: membership }
	};
};

// PUT actions
const actionPutGroup = updatedGroup => {
	return {
		type: PUT_GROUP,
		payload: updatedGroup
	};
};

const actionUpgradeToCohost = member => {
	return {
		type: UPGRADE_MEMBER_TO_COHOST,
		payload: member
	};
};

// DELETE actions
const actionDeleteGroup = groupId => {
	return {
		type: DELETE_GROUP,
		payload: groupId
	};
};

const actionDeleteMembership = userId => {
	return {
		type: DELETE_MEMBERSHIP,
		payload: userId
	};
};

// RESET action (cleanup function)
export const actionResetSingleGroup = () => {
	return {
		type: RESET_SINGLE_GROUP
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
		dispatch(actionGetUserEvents(data.Groups));
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

export const thunkUpgradeToCohost = (member, groupId) => async dispatch => {
	const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
		method: "PUT",
		body: JSON.stringify({ memberId: member.id, status: "co-host" }),
		headers: {
			"Content-Type": "application/json"
		}
	});
	if (res.ok) {
		await res.json();
		dispatch(actionUpgradeToCohost(member));
		return;
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

export const thunkPostGroupImage = (formData, groupId) => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}/images`, {
		method: "POST",
		body: formData,
		headers: {
			"Content-Type": "multipart/form-data"
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

export const thunkAddMembership = (user, groupId) => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
		method: "POST"
	});
	const data = await response.json();
	if (response.ok) {
		dispatch(actionAddMembership(user, data));
		return;
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

export const thunkDeleteMember = (groupId, memberId) => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
		method: "DELETE",
		body: JSON.stringify({ memberId })
	});
	if (response.ok) {
		await response.json();
		dispatch(actionDeleteMembership(memberId));
		return;
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
			newState.singleGroup = action.payload;
			return newState;
		case ADD_MEMBERSHIP:
			newState = {
				...state,
				groupMembers: {
					...state.groupMembers,
					[action.payload.id]: action.payload
				},
				singleGroup: {
					...state.singleGroup,
					numMembers: state.singleGroup.numMembers + 1
				}
			};
			return newState;
		case UPGRADE_MEMBER_TO_COHOST:
			newState = {
				...state,
				groupMembers: {
					...state.groupMembers,
					[action.payload.id]: {
						...state.groupMembers[action.payload.id],
						status: "co-host"
					}
				}
			};
			return newState;
		case GET_USER_GROUPS:
			newState = { ...state };
			newState.userGroups = { ...action.payload };
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
		case RESET_SINGLE_GROUP:
			newState = { ...state, groupMembers: {}, singleGroup: {} };
			return newState;
		case DELETE_MEMBERSHIP:
			newState = { ...state };
			state.singleGroup.numMembers--;
			delete state.groupMembers[action.payload];
			return newState;
		case POST_GROUP_IMAGE:
			if (!state.singleGroup.GroupImages) {
				return {
					...state,
					singleGroup: {
						...state.singleGroup,
						GroupImages: [{ ...action.payload, preview: true }]
					}
				};
			} else {
				return {
					...state,
					singleGroup: {
						...state.singleGroup,
						GroupImages: [...state.singleGroup.GroupImages, action.payload]
					}
				};
			}

		default:
			return state;
	}
}
