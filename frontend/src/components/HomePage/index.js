import "./HomePage.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { thunkGetUserGroups } from "../../store/groupsReducer";
import * as sessionActions from "../../store/session";
import UserGroupEvents from "./UserGroupEvents";

export default function HomePage() {
	const history = useHistory();
	const navBar = document.querySelector(".navigation");
	navBar.className = "navigation event-groups-nav splash-exit";
	const dispatch = useDispatch();
	const user = useSelector(state => state.session.user);

	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		console.log({ user });
		if (user)
			dispatch(thunkGetUserGroups(user.id)).then(() => {
				setIsLoaded(true);
			});
		else
			dispatch(sessionActions.restoreUser()).then(data => {
				if (!data.user) {
					history.push("/");
				}
			});
	}, [dispatch, user]);

	const userGroups = useSelector(state => state.groups.userGroups);

	const userGroupEvents = useSelector(state => state.events.allUserGroupEvents);
	return isLoaded ? (
		<div className="home-page-outer-container">
			<div className="home-page-inner-container">
				<div id="user-nav">
					<div id="user-nav-top">
						<div id="user-nav-welcome">
							<h2>Welcome, {user.firstName + "👋"}</h2>
						</div>
					</div>
					<UserGroupEvents eventsObj={userGroupEvents} groupsObj={userGroups} />
				</div>
			</div>
		</div>
	) : (
		<div className="main-container">
			<div className="group-page-container">
				<div className="gr-loading__container">
					<h1 className="loading-text">Loading home page...</h1>
				</div>
			</div>
		</div>
	);
}
