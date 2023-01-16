const GET_ALL_EVENTS = "groups/GET_ALL_EVENTS";

const setEvents = allEvents => {
	const allEventsObj = {};
	allEvents.forEach(event => {
		allEventsObj[event.id] = event;
	});
	return {
		type: GET_ALL_EVENTS,
		payload: allEventsObj
	};
};

export const getAllEvents = () => async dispatch => {
	const response = await fetch("/api/events");
	const data = await response.json();
	dispatch(setEvents(data.Events));
	return response;
};

const initialState = {
	allEvents: [],
	singleEvent: null
};

export default function eventsReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case GET_ALL_EVENTS:
			newState = { ...state };
			newState.allEvents = { ...state.allEvents };
			newState.allEvents = action.payload;
			return newState;
		default:
			return state;
	}
}
