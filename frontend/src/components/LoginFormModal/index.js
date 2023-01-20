// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import { useHistory } from "react-router";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import SmallLogo from "../SVGComponents/SmallLogo";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";

function LoginFormModal() {
	const history = useHistory();
	const redirect = () => history.push("/home");
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const handleSubmit = e => {
		e.preventDefault();
		setErrors([]);
		return dispatch(sessionActions.login({ credential, password }))
			.then(() => {
				closeModal();
				const navBar = document.querySelector(".navigation");
				navBar.className = "navigation splash-exit";
				redirect();
			})
			.catch(async res => {
				const data = await res.json();
				console.log(data);
				if (data && data.statusCode === 400) setErrors(data.errors);
				if (data && data.statusCode === 401)
					setErrors({ message: data.message });
			});
	};

	const handleLoginDemo = e => {
		const credential = "demo@user.io";
		const password = "password";
		return dispatch(sessionActions.login({ credential, password }))
			.then(() => {
				closeModal();
				const navBar = document.querySelector(".navigation");
				navBar.className = "navigation splash-exit";
				redirect();
			})
			.catch(async res => {
				const data = await res.json();
				if (data && data.statusCode === 400) setErrors(data.errors);
				if (data && data.statusCode === 401)
					setErrors({ message: data.message });
			});
	};

	const errorKeys = Object.keys(errors);
	return (
		<>
			{<SmallLogo />}
			<i
				id="x-button"
				className="fa-solid fa-xmark"
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
			<form onSubmit={handleSubmit} id="login-form">
				<div id="login-errors">
					{errorKeys.map(key => (
						<p key={key}>{errors[key]}</p>
					))}
				</div>{" "}
				<div id="label-input-div">
					<label htmlFor="email">Email</label>
					<input
						name="email"
						type="text"
						value={credential}
						onChange={e => setCredential(e.target.value)}
						required
					/>
				</div>
				<div id="label-input-div">
					<label htmlFor="password">Password</label>
					<input
						name="password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<button type="submit">Log in</button>
				</div>
				<div>
					<button type="button" id="demo-user-button" onClick={handleLoginDemo}>
						Demo User
					</button>
				</div>
			</form>
		</>
	);
}

export default LoginFormModal;
