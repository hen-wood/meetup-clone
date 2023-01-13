import { csrfFetch } from "./csrf";

const LOG_IN = "session/LOG_IN";
const setUser = user => {
	return {
		type: LOG_IN,
		payload: user
	};
};

// const LOG_OUT = "session/LOG_OUT";
// const removeUser = user => {
// 	return {
// 		type: LOG_OUT
// 	};
// };

export const postSessionLogIn = user => async dispatch => {
	const { credential, password } = user;
	const res = await csrfFetch(`/api/session`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			credential,
			password
		})
	});

	if (res.ok) {
		const user = await res.json();
		dispatch(setUser(user));
		return res;
	} else {
		console.log("TODO: LOGIN ERROR HANDLING");
	}
};

// export const postSessionLogOut = credentials => async dispatch => {
// 	const res = await csrfFetch(`/api/session`, {
// 		method: "DELETE",
// 		headers: {
// 			"Content-Type": "application/json"
// 		},
// 		body: JSON.stringify(credentials)
// 	});

// 	if (res.ok) {
// 		const user = await res.json();
// 		dispatch(actionLogIn(user));
// 	} else {
// 		console.log("TODO: LOGIN ERROR HANDLING");
// 	}
// };

const initialState = { user: null };

export default function sessionReducer(state = initialState, action) {
	switch (action.type) {
		case LOG_IN:
			const logInState = { ...state };
			logInState.user = action.payload;
			return logInState;
		// case LOG_OUT:
		// 	const logOutState = { ...state };
		// 	logOutState.user = action.input;
		// 	return logOutState;
		default:
			return state;
	}
}
