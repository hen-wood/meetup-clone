// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage";
import HomePage from "./components/HomePage";
import EventsGroups from "./components/EventsGroups";

function App() {
	const user = useSelector(state => state.session.user);
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
	}, [dispatch]);

	const content = user && isLoaded ? <HomePage user={user} /> : <SplashPage />;
	return (
		<>
			<Navigation isLoaded={isLoaded} />
			{isLoaded && (
				<Switch>
					<Route exact path={"/"}>
						{content}
					</Route>
					<Route path="/home/groups">
						<EventsGroups activeTab={"groups"} />
					</Route>
					<Route path="/home/events">
						<EventsGroups activeTab={"events"} />
					</Route>
				</Switch>
			)}
		</>
	);
}

export default App;
