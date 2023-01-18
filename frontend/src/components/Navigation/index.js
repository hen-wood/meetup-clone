// frontend/src/components/Navigation/index.js
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import Logo from "../SVGComponents/Logo";
function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);
	const content = sessionUser ? (
		isLoaded && <ProfileButton user={sessionUser} />
	) : (
		<div className="login-signup-container">
			<OpenModalMenuItem
				itemText="Log in"
				modalComponent={<LoginFormModal />}
			/>
			<OpenModalMenuItem
				itemText="Sign up"
				modalComponent={<SignupFormModal />}
			/>
		</div>
	);
	return (
		<div className={"navigation splash-exit"}>
			<Link to="/">
				<Logo />
			</Link>
			{content}
		</div>
	);
}

export default Navigation;
