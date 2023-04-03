import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = "events/GET_ALL_EVENTS";
const GET_ALL_GROUP_EVENTS = "events/GET_ALL_GROUP_EVENTS";
const GET_ALL_USER_GROUP_EVENTS = "events/GET_ALL_USER_GROUP_EVENTS";
const GET_EVENT_DETAILS = "events/GET_EVENT_DETAILS";
const POST_EVENT = "events/POST_EVENT";
const POST_EVENT_IMAGE = "events/POST_EVENT_IMAGE";
const DELETE_GROUP_EVENT = "events/DELETE_GROUP_EVENT";
const RESET_EVENTS = "events/RESET_EVENTS";

// Action creators

// GET actions
const actionGetAllEvents = allEvents => {
	const allEventsObj = {};
	allEvents.forEach(event => {
		allEventsObj[event.id] = event;
	});
	return {
		type: GET_ALL_EVENTS,
		payload: allEventsObj
	};
};

const actionGetGroupEvents = allGroupEvents => {
	const allGroupEventsObj = {};
	allGroupEvents.forEach(event => {
		allGroupEventsObj[event.id] = event;
	});
	return {
		type: GET_ALL_GROUP_EVENTS,
		payload: allGroupEventsObj
	};
};

export const actionGetUserEvents = userGroups => {
	const userEventsObj = {};
	userGroups.forEach(group => {
		const { Events } = group;
		Events.forEach(event => {
			userEventsObj[event.id] = event;
		});
	});
	return {
		type: GET_ALL_USER_GROUP_EVENTS,
		payload: userEventsObj
	};
};

const actionGetSingleEvent = singleEvent => {
	return {
		type: GET_EVENT_DETAILS,
		payload: singleEvent
	};
};

// POST actions
const actionPostEventImage = newImage => {
	return {
		type: POST_EVENT_IMAGE,
		payload: newImage
	};
};

const actionPostEvent = newEvent => {
	return {
		type: POST_EVENT,
		payload: newEvent
	};
};

// DELETE actions
const actionDeleteEvent = eventId => {
	return {
		type: DELETE_GROUP_EVENT,
		payload: eventId
	};
};

// RESET action
export const actionResetEvents = () => {
	return { type: RESET_EVENTS };
};

// Thunks

// GET thunks
export const thunkGetAllEvents = page => async dispatch => {
	const response = await fetch(`/api/events?page=${page}`);
	if (response.ok) {
		const data = await response.json();
		dispatch(actionGetAllEvents(data.Events));
		return data;
	} else {
		return response;
	}
};

export const thunkGetSingleEvent = eventId => async dispatch => {
	const response = await fetch(`/api/events/${eventId}`);

	if (response.ok) {
		const data = await response.json();
		dispatch(actionGetSingleEvent(data));
		return data;
	} else {
		return response;
	}
};

export const thunkGetAllGroupEvents = groupId => async dispatch => {
	const response = await fetch(`/api/groups/${groupId}/events`);

	if (response.ok) {
		const data = await response.json();
		dispatch(actionGetGroupEvents(data.Events));
		return data;
	} else {
		return response;
	}
};

// POST thunks
export const thunkPostEvent = (newEvent, groupId) => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}/events`, {
		method: "POST",
		body: JSON.stringify(newEvent),
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(actionPostEvent(data));
		return data;
	} else {
		return response;
	}
};

export const thunkPostEventImage = (newImage, eventId) => async dispatch => {
	const response = await csrfFetch(`/api/events/${eventId}/images`, {
		method: "POST",
		body: JSON.stringify(newImage),
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(actionPostEventImage(data));
		return data;
	} else {
		return response;
	}
};

// DELETE thunks
export const thunkDeleteEvent = eventId => async dispatch => {
	const response = await csrfFetch(`/api/events/${eventId}`, {
		method: "DELETE"
	});
	if (response.ok) {
		const data = await response.json();
		dispatch(actionDeleteEvent(eventId));
		return data;
	} else {
		return response;
	}
};

const initialState = {
	allEvents: {},
	singleEvent: {},
	allGroupEvents: {},
	allUserGroupEvents: {},
	eventImages: {}
};

export default function eventsReducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case GET_ALL_EVENTS:
			newState = { ...state };
			newState.allEvents = { ...state.allEvents, ...action.payload };
			return newState;
		case GET_ALL_GROUP_EVENTS:
			newState = { ...state };
			newState.allGroupEvents = { ...state.allGroupEvents };
			newState.allGroupEvents = action.payload;
			return newState;
		case GET_ALL_USER_GROUP_EVENTS:
			return {
				...state,
				allUserGroupEvents: { ...state.allUserGroupEvents, ...action.payload }
			};
		case GET_EVENT_DETAILS:
			newState = { ...state };
			newState.singleEvent = { ...state.singleEvent };
			newState.singleEvent = action.payload;
			return newState;
		case POST_EVENT:
			newState = { ...state };
			newState.allGroupEvents = { ...state.allGroupEvents };
			newState.allGroupEvents[action.payload.id] = action.payload;
			return newState;
		case POST_EVENT_IMAGE:
			newState = { ...state };
			newState.eventImages = { ...state.eventImages };
			newState.eventImages[action.payload.id] = action.payload;
			return newState;
		case DELETE_GROUP_EVENT:
			newState = { ...state };
			newState.allGroupEvents = { ...state.allGroupEvents };
			newState.allEvents = { ...state.allEvents };
			delete newState.allGroupEvents[action.payload];
			delete newState.allEvents[action.payload];
			return newState;
		case RESET_EVENTS:
			return initialState;
		default:
			return state;
	}
}
