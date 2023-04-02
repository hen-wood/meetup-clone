import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
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
	const [image, setImage] = useState(null);
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const handleSubmit = e => {
		e.preventDefault();
		if (password === confirmPassword) {
			setErrors([]);
			const formData = new FormData();
			if (image) {
				formData.append("image", image);
			}
			formData.append("email", email);
			formData.append("username", username);
			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			formData.append("password", password);
			return dispatch(sessionActions.signup(formData))
				.then(() => {
					closeModal();
					const navBar = document.querySelector(".navigation");
					navBar.className = "navigation splash-exit";
					redirect();
				})
				.catch(async res => {
					const data = await res.json();
					if (data && data.errors) setErrors(data.errors);
					if (data && data.statusCode === 403)
						setErrors({ message: data.message });
				});
		}
		return setErrors([
			"Confirm Password field must be the same as the Password field"
		]);
	};

	const updateFile = e => {
		const file = e.target.files[0];
		if (file) setImage(file);
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
			<div id="signup-errors">
				{errorKeys.map(key => (
					<p key={key}>{errors[key]}</p>
				))}
			</div>
			<form onSubmit={handleSubmit} id="signup-form">
				<div className="label-input-div">
					<label htmlFor="email">Email</label>
					<input
						type="text"
						id="email"
						name="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="label-input-div">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						value={username}
						onChange={e => setUsername(e.target.value)}
						required
					/>
				</div>
				<div className="label-input-div">
					<label htmlFor="first-name">First Name</label>
					<input
						type="text"
						id="first-name"
						name="first-name"
						value={firstName}
						onChange={e => setFirstName(e.target.value)}
						required
					/>
				</div>
				<div className="label-input-div">
					<label htmlFor="last-name">Last Name</label>
					<input
						type="text"
						id="last-name"
						name="last-name"
						value={lastName}
						onChange={e => setLastName(e.target.value)}
						required
					/>
				</div>
				<div className="label-input-div">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="label-input-div">
					<label htmlFor="confirm-password">Confirm Password</label>
					<input
						id="confirm-password"
						name="confirm-password"
						type="password"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				{!image ? (
					<>
						<label htmlFor="image-upload-input" className="custom-file-input">
							<i className="fa fa-cloud-upload upload-file-icon"></i> Upload
							profile picture (optional)
						</label>
						<input
							id="image-upload-input"
							name="image-upload-input"
							className="image-upload-input"
							type="file"
							onChange={updateFile}
						/>
					</>
				) : (
					<>
						<label
							htmlFor="image-upload-input"
							className="custom-file-input custom-file-input--loaded"
						>
							<i className="fa fa-check upload-file-icon"></i> Upload profile
							picture (optional)
						</label>
						<input
							id="image-upload-input"
							name="image-upload-input"
							className="image-upload-input"
							type="file"
							onChange={updateFile}
						/>
					</>
				)}
				<div>
					<button type="submit">Sign Up</button>
				</div>
			</form>
		</>
	);
}

export default SignupFormModal;
