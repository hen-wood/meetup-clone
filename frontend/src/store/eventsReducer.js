const GET_ALL_EVENTS = "events/GET_ALL_EVENTS";
const GET_ALL_GROUP_EVENTS = "events/GET_ALL_GROUP_EVENTS";
const GET_EVENT_DETAILS = "events/GET_EVENT_DETAILS";

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

const setGroupEvents = allGroupEvents => {
	const allGroupEventsObj = {};
	allGroupEvents.forEach(event => {
		allGroupEventsObj[event.id] = event;
	});
	return {
		type: GET_ALL_GROUP_EVENTS,
		payload: allGroupEventsObj
	};
};

const setSingleEvent = singleEvent => {
	return {
		type: GET_EVENT_DETAILS,
		payload: singleEvent
	};
};

export const getAllEvents = () => async dispatch => {
	const response = await fetch("/api/events");
	const data = await response.json();
	dispatch(setEvents(data.Events));
	return response;
};

export const getAllGroupEvents = groupId => async dispatch => {
	const response = await fetch(`/api/groups/${groupId}/events`);
	const data = await response.json();
	dispatch(setGroupEvents(data.Events));
	return response;
};

export const getSingleEvent = eventId => async dispatch => {
	const response = await fetch(`/api/events/${eventId}`);
	const data = await response.json();
	dispatch(setSingleEvent(data));
	return response;
};

const initialState = {
	allEvents: {},
	singleEvent: {},
	allGroupEvents: {}
};

export default function eventsReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case GET_ALL_EVENTS:
			newState = { ...state };
			newState.allEvents = { ...state.allEvents };
			newState.allEvents = action.payload;
			return newState;
		case GET_ALL_GROUP_EVENTS:
			newState = { ...state };
			newState.allGroupEvents = { ...state.allGroupEvents };
			newState.allGroupEvents = action.payload;
			return newState;
		case GET_EVENT_DETAILS:
			newState = { ...state };
			newState.singleEvent = { ...state.singleEvent };
			newState.singleEvent = action.payload;
			return newState;
		default:
			return state;
	}
}
