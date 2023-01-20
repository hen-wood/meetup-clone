import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";
import SmallLogo from "../SVGComponents/SmallLogo";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { useHistory } from "react-router-dom";
function SignupFormModal() {
	const dispatch = useDispatch();
	const history = useHistory();
	const redirect = () => history.push("/home");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const handleSubmit = e => {
		e.preventDefault();
		if (password === confirmPassword) {
			setErrors([]);
			return dispatch(
				sessionActions.signup({
					email,
					username,
					firstName,
					lastName,
					password
				})
			)
				.then(() => {
					closeModal();
					const navBar = document.querySelector(".navigation");
					navBar.className = "navigation splash-exit";
					redirect();
				})
				.catch(async res => {
					const data = await res.json();
					console.log(data);
					if (data && data.errors) setErrors(data.errors);
					if (data && data.statusCode === 403)
						setErrors({ message: data.message });
				});
		}
		return setErrors([
			"Confirm Password field must be the same as the Password field"
		]);
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
			<h1>Sign Up</h1>
			<div className="login-sign-up-prompt">
				Already a member?{" "}
				<span className="sign-up-link">
					<OpenModalMenuItem
						itemText="Log in"
						modalComponent={<LoginFormModal />}
					/>
				</span>
			</div>
			<form onSubmit={handleSubmit} id="signup-form">
				<div id="signup-errors">
					{errorKeys.map(key => (
						<p key={key}>{errors[key]}</p>
					))}
				</div>
				<div id="label-input-div">
					<label htmlFor="email">Email</label>
					<input
						type="text"
						name="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</div>
				<div id="label-input-div">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						value={username}
						onChange={e => setUsername(e.target.value)}
						required
					/>
				</div>
				<div id="label-input-div">
					<label htmlFor="first-name">First Name</label>
					<input
						type="text"
						name="first-name"
						value={firstName}
						onChange={e => setFirstName(e.target.value)}
						required
					/>
				</div>
				<div id="label-input-div">
					<label htmlFor="last-name">Last Name</label>
					<input
						type="text"
						name="last-name"
						value={lastName}
						onChange={e => setLastName(e.target.value)}
						required
					/>
				</div>
				<div id="label-input-div">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</div>
				<div id="label-input-div">
					<label htmlFor="confirm-password">Confirm Password</label>
					<input
						name="confirm-password"
						type="password"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<button type="submit">Sign Up</button>
				</div>
			</form>
		</>
	);
}

export default SignupFormModal;
