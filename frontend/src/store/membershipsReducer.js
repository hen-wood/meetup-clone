import { csrfFetch } from "./csrf";

const GET_PENDING_MEMBERSHIPS = "memberships/GET_PENDING_MEMBERSHIPS";
const ADD_PENDING_MEMBERSHIP = "memberships/ADD_PENDING_MEMBERSHIP";
const DELETE_PENDING_MEMBERSHIP = "memberships/DELETE_PENDING_MEMBERSHIP";

const actionSetPendingMemberships = membershipsArr => {
	const membershipsObj = {};
	membershipsArr.forEach(membership => {
		membershipsObj[membership.groupId] = membership;
	});
	return {
		type: GET_PENDING_MEMBERSHIPS,
		payload: membershipsObj
	};
};

const actionAddPendingMembership = membership => {
	return {
		type: ADD_PENDING_MEMBERSHIP,
		payload: membership
	};
};

const actionDeletePendingMembership = groupId => {
	return {
		type: DELETE_PENDING_MEMBERSHIP,
		payload: groupId
	};
};

export const thunkGetPendingMemberships = () => async dispatch => {
	const res = await csrfFetch(`/api/user-memberships/pending`);

	const data = await res.json();
	if (res.ok) {
		dispatch(actionSetPendingMemberships(data));
	}
};

export const thunkRequestMembership = groupId => async dispatch => {
	const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
		method: "POST"
	});
	const data = await res.json();
	if (res.ok) {
		dispatch(actionAddPendingMembership(data));
	}
};

export const thunkDeletePendingMembership =
	(groupId, memberId) => async dispatch => {
		const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
			method: "DELETE",
			body: JSON.stringify({ memberId })
		});
		const data = await res.json();
		if (res.ok) {
			dispatch(actionDeletePendingMembership(groupId));
		}
	};

const initialState = {
	pending: {}
};

export default function membershipsReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case GET_PENDING_MEMBERSHIPS:
			newState = { ...state, pending: { ...action.payload } };
			return newState;
		case ADD_PENDING_MEMBERSHIP:
			newState = {
				...state,
				pending: { ...state.pending, [action.payload.groupId]: action.payload }
			};
			return newState;
		case DELETE_PENDING_MEMBERSHIP:
			newState = { ...state };
			delete newState.pending[action.payload];
			return newState;
		default:
			return state;
	}
}
