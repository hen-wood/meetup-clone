import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";
import SmallLogo from "../SVGComponents/SmallLogo";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
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
				.then(closeModal)
				.catch(async res => {
					const data = await res.json();
					if (data && data.errors) setErrors(data.errors);
				});
		}
		return setErrors([
			"Confirm Password field must be the same as the Password field"
		]);
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
			<form onSubmit={handleSubmit}>
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label htmlFor="email">Email</label>
				<input
					type="text"
					name="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					required
				/>
				<label htmlFor="username">Username</label>
				<input
					type="text"
					name="username"
					value={username}
					onChange={e => setUsername(e.target.value)}
					required
				/>
				<label htmlFor="first-name">First Name</label>
				<input
					type="text"
					name="first-name"
					value={firstName}
					onChange={e => setFirstName(e.target.value)}
					required
				/>
				<label htmlFor="last-name">Last Name</label>
				<input
					type="text"
					name="last-name"
					value={lastName}
					onChange={e => setLastName(e.target.value)}
					required
				/>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					name="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
				<label htmlFor="confirm-password">Confirm Password</label>
				<input
					name="confirm-password"
					type="password"
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
					required
				/>
				<div>
					<button type="submit">Sign Up</button>
				</div>
			</form>
		</>
	);
}

export default SignupFormModal;
