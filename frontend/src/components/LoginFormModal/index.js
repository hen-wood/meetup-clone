// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = e => {
		e.preventDefault();
		setErrors([]);
		return dispatch(sessionActions.login({ credential, password }))
			.then(closeModal)
			.catch(async res => {
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
			});
	};

	return (
		<>
			<h1>Log In</h1>
			<form onSubmit={handleSubmit}>
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label>
					Username or Email
					<input
						type="text"
						value={credential}
						onChange={e => setCredential(e.target.value)}
						required
					/>
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</label>
				<button type="submit">Log In</button>
			</form>
		</>
	);
}

export default LoginFormModal;

// export default function LoginFormPage() {
// 	const dispatch = useDispatch();
// 	const history = useHistory();
// 	const sessionUser = useSelector(state => state.user);
// 	const [credential, setCredential] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [valErrors, setValErrors] = useState({});
// 	const [wrongCredError, setWrongCredError] = useState("");
// 	const [currentEmailError, setCurrentEmailError] = useState("");
// 	const [currentPasswordError, setCurrentPasswordError] = useState("");
// 	const [emailFormStarted, setEmailFormStarted] = useState(false);
// 	const [passwordFormStarted, setPasswordFormStarted] = useState(false);

// 	console.log("session user", sessionUser);
// 	if (sessionUser) {
// 		history.push("/");
// 		return <Redirect to="/" />;
// 	}

// 	const handleSubmit = e => {
// 		e.preventDefault();

// 		const payload = {
// 			credential,
// 			password
// 		};
// 		return dispatch(postSessionLogIn({ credential, password })).catch(
// 			async res => {
// 				const data = await res.json();
// 				if (data.statusCode === 400) {
// 					setValErrors(data.errors);
// 					setWrongCredError("");
// 				} else if (data.statusCode === 401) {
// 					setWrongCredError(data.message);
// 					setValErrors({});
// 				}
// 			}
// 		);
// 	};

// 	const checkForEmailErrors = email => {
// 		console.log(currentEmailError);
// 		if (!email.length && emailFormStarted) {
// 			setCurrentEmailError("Email is required");
// 		} else if (!validateEmail(credential) && emailFormStarted) {
// 			setCurrentEmailError("Email has invalid format");
// 		} else {
// 			setCurrentEmailError("");
// 		}
// 	};

// 	const checkForPasswordErrors = password => {
// 		if (password.length < 1 && passwordFormStarted) {
// 			setCurrentPasswordError("Password is required");
// 		} else {
// 			setCurrentPasswordError("");
// 		}
// 	};
// 	return (
// 		<form onSubmit={handleSubmit}>
// 			<p>{wrongCredError}</p>
// 			<div>
// 				<div>
// 					<label htmlFor="email">Email</label>
// 				</div>
// 				<input
// 					type="text"
// 					name="email"
// 					onChange={e => {
// 						setCredential(e.target.value);
// 						if (emailFormStarted) {
// 							checkForEmailErrors(e.target.value);
// 						}
// 					}}
// 					onBlur={e => {
// 						checkForEmailErrors(e.target.value);
// 						setEmailFormStarted(true);
// 					}}
// 				/>
// 				<p className="error">{currentEmailError}</p>
// 				<p>{valErrors.credential}</p>
// 			</div>
// 			<div>
// 				<div>
// 					<label htmlFor="password">Password</label>
// 				</div>
// 				<input
// 					type="text"
// 					name="password"
// 					onChange={e => {
// 						setPassword(e.target.value);
// 						if (passwordFormStarted) {
// 							checkForPasswordErrors(e.target.value);
// 						}
// 					}}
// 					onBlur={e => {
// 						checkForPasswordErrors(e.target.value);
// 						setPasswordFormStarted(true);
// 					}}
// 				/>
// 				<p className="error">{currentPasswordError}</p>
// 				<p>{valErrors.password}</p>
// 			</div>
// 			<button type="submit">Log in</button>
// 		</form>
// 	);
// }
