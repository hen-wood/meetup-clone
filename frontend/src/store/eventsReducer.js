import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = "events/GET_ALL_EVENTS";
const GET_ALL_GROUP_EVENTS = "events/GET_ALL_GROUP_EVENTS";
const GET_EVENT_DETAILS = "events/GET_EVENT_DETAILS";
const CREATE_GROUP_EVENT = "events/CREATE_GROUP_EVENT";
const ADD_EVENT_IMAGE = "events/ADD_EVENT_IMAGE";

const createEventImage = newImage => {
	return {
		type: ADD_EVENT_IMAGE,
		payload: newImage
	};
};

const createGroupEvent = newEvent => {
	return {
		type: CREATE_GROUP_EVENT,
		payload: newEvent
	};
};

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

export const postNewEvent = (newEvent, groupId) => async dispatch => {
	const response = await csrfFetch(`/api/groups/${groupId}/events`, {
		method: "POST",
		body: JSON.stringify(newEvent),
		headers: {
			"Content-Type": "application/json"
		}
	});

	const data = await response.json();
	console.log(data);
	dispatch(createGroupEvent(data));
	return data;
};

export const postNewEventImage = (newImage, eventId) => async dispatch => {
	const response = await csrfFetch(`/api/events/${eventId}/images`, {
		method: "POST",
		body: JSON.stringify(newImage),
		headers: {
			"Content-Type": "application/json"
		}
	});

	const data = await response.json();
	dispatch(createEventImage(data));
	return data;
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
	allGroupEvents: {},
	eventImages: {}
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
		case CREATE_GROUP_EVENT:
			console.log("creating group");
			newState = { ...state };
			newState.allGroupEvents = { ...state.allGroupEvents };
			newState.allGroupEvents[action.payload.id] = action.payload;
			return newState;
		case ADD_EVENT_IMAGE:
			console.log("creating image");
			newState = { ...state };
			newState.eventImages = { ...state.eventImages };
			newState.eventImages[action.payload.id] = action.payload;
			return newState;
		default:
			return state;
	}
}
