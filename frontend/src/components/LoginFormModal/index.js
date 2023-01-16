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
			.then(() => {
				closeModal();
				const navBar = document.querySelector(".navigation");
				navBar.className = "navigation splash-exit";
			})
			.catch(async res => {
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
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
			})
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
