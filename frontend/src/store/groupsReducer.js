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

export const getAllGroups = () => async dispatch => {
	const response = await fetch("/api/groups");
	const data = await response.json();
	dispatch(setGroups(data.Groups));
	return response;
};

const initialState = {
	allGroups: [],
	singleGroup: null
};

export default function groupsReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case GET_ALL_GROUPS:
			newState = { ...state };
			newState.allGroups = { ...state.allGroups };
			newState.allGroups = action.payload;
			return newState;
		default:
			return state;
	}
}
