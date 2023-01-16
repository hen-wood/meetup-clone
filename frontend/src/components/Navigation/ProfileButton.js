import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const ulRef = useRef();

	const openMenu = () => {
		if (showMenu) return;
		setShowMenu(true);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = e => {
			if (!ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener("click", closeMenu);

		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);

	const closeMenu = () => setShowMenu(false);

	const logout = e => {
		e.preventDefault();
		dispatch(sessionActions.logout());
		closeMenu();
		const navBar = document.querySelector(".navigation");
		navBar.className = "navigation";
	};

	const menuClassName = showMenu ? "menu-drop-down" : " hidden";
	const chevronClassName = "fa-solid fa-chevron-" + (showMenu ? "up" : "down");
	return (
		<>
			<div className="profile-button-container" onClick={openMenu}>
				<i id="profile-button" className="fas fa-user-circle" />
				<i id="drop-down-chevron" className={chevronClassName} />
				<div className={menuClassName} ref={ulRef}>
					<p className="drop-down-link">Your events</p>
					<p className="drop-down-link">Your groups</p>
					<div id="drop-down-divider" />
					<p className="drop-down-link" onClick={logout}>
						Log out
					</p>
				</div>
			</div>
		</>
	);
}

export default ProfileButton;
