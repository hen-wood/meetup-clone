// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";

function App() {
	const user = useSelector(state => state.session.user);
	console.log(user);
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
					<Route path="/signup">
						<SignupFormPage />
					</Route>
				</Switch>
			)}
			{content}
			<Footer />
		</>
	);
}

export default App;
