// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import SmallLogo from "../SVGComponents/SmallLogo";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";

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

	const handleLoginDemo = () => {
		const credential = "demo@user.io";
		const password = "password";
		return dispatch(sessionActions.login({ credential, password }))
			.then(closeModal)
			.catch(async res => {
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
			});
	};
	return (
		<>
			{<SmallLogo />}
			<i
				id="x-button"
				class="fa-solid fa-xmark"
				onClick={e => {
					e.target.parentNode.className = "modal-content-exit";
					e.target.parentNode.parentNode.className = "modal-background-exit";
					setTimeout(() => {
						closeModal();
					}, 350);
				}}
			></i>

			<h1>Log in</h1>
			<div className="login-sign-up-prompt">
				Not a member yet?{" "}
				<span className="sign-up-link">
					<OpenModalMenuItem
						itemText="Sign up"
						modalComponent={<SignupFormModal />}
					/>
				</span>
			</div>
			<form onSubmit={handleSubmit}>
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label htmlFor="email">Email</label>
				<input
					name="email"
					type="text"
					value={credential}
					onChange={e => setCredential(e.target.value)}
					required
				/>
				<label htmlFor="password">Password</label>
				<input
					name="password"
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
				<div>
					<button type="submit">Log in</button>
				</div>
				<button type="button" id="demo-user-button" onClick={handleLoginDemo}>
					Demo User
				</button>
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
