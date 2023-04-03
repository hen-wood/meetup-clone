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
		isLoaded && (
			<div className="logged-in-user-nav">
				<Link className="start-group-link" to="/create-group">
					Start a group - 100% off!
				</Link>
				<ProfileButton user={sessionUser} />
			</div>
		)
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
			<a
				className="about-links"
				href="https://github.com/hen-wood/meetup-clone"
				target="_blank"
				rel="noreferrer"
			>
				<i className="fa-brands fa-github"></i> Project repo
			</a>
			<a
				className="about-links"
				href="https://www.linkedin.com/in/henry-woodmansee/"
				target="_blank"
				rel="noreferrer"
			>
				<i className="fa-brands fa-linkedin"></i> Henry's Linkedin
			</a>
			{content}
		</div>
	);
}

export default Navigation;
