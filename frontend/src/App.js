// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage";
import HomePage from "./components/HomePage";
import EventsGroups from "./components/EventsGroups";
import CreateAGroup from "./components/CreateAGroup";
import SingleGroupPage from "./components/SingleGroupPage";
import EditGroup from "./components/EditGroup";
import SingleEventDetails from "./components/SingleEventDetails";
import CreateEvent from "./components/CreateEvent";

function App() {
	const user = useSelector(state => state.session.user);
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		dispatch(sessionActions.restoreUser()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	const content = isLoaded && <SplashPage />;
	return (
		<>
			<Navigation isLoaded={isLoaded} />
			{isLoaded && (
				<Switch>
					<Route exact path={"/"}>
						{content}
					</Route>
					<Route path="/home">
						<HomePage user={user} />
					</Route>
					<Route path="/all-groups">
						<EventsGroups activeTab={"groups"} />
					</Route>
					<Route path="/all-events">
						<EventsGroups activeTab={"events"} />
					</Route>
					<Route path="/create-group">
						<CreateAGroup />
					</Route>
					<Route exact path="/groups/:groupId">
						<SingleGroupPage />
					</Route>
					<Route path="/groups/:groupId/create-event">
						<CreateEvent />
					</Route>
					<Route path="/edit-group/:groupId">
						<EditGroup />
					</Route>
					<Route path="/events/:eventId">
						<SingleEventDetails />
					</Route>
				</Switch>
			)}
		</>
	);
}

export default App;
