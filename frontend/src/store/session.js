// frontend/src/store/session.js
import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = user => {
	return {
		type: SET_USER,
		payload: user
	};
};

const removeUser = () => {
	return {
		type: REMOVE_USER
	};
};

export const login = user => async dispatch => {
	const { credential, password } = user;
	const response = await csrfFetch("/api/session", {
		method: "POST",
		body: JSON.stringify({
			credential,
			password
		})
	});
	const data = await response.json();
	dispatch(setUser(data.user));
	return response;
};

export const restoreUser = () => async dispatch => {
	const response = await csrfFetch("/api/session");
	const data = await response.json();
	dispatch(setUser(data.user));
	return response;
};

export const thunkUploadPicture = picObj => async dispatch => {
	const { image } = picObj;
	const formData = new FormData();

	if (image) {
		formData.append("image", image);
	}

	const res = await csrfFetch("/api/users/pictures", {
		method: "POST",
		body: formData,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});

	const data = await res.json();
	return data;
};

export const signup = user => async dispatch => {
	const { image, username, firstName, lastName, email, password } = user;

	const formData = new FormData();

	formData.append("username", username);
	formData.append("firstName", firstName);
	formData.append("lastName", lastName);
	formData.append("email", email);
	formData.append("password", password);

	if (image) formData.append("image", image);

	const response = await csrfFetch("/api/users", {
		method: "POST",
		body: formData,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});

	const data = await response.json();
	dispatch(setUser(data.user));
	return response;
};

export const logout = () => async dispatch => {
	const response = await csrfFetch("/api/session", {
		method: "DELETE"
	});
	dispatch(removeUser());
	return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case SET_USER:
			newState = Object.assign({}, state);
			newState.user = action.payload;
			return newState;
		case REMOVE_USER:
			newState = Object.assign({}, state);
			newState.user = null;
			return newState;
		default:
			return state;
	}
};

export default sessionReducer;
