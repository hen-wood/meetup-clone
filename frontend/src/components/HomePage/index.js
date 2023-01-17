import "./HomePage.css";
import { Link } from "react-router-dom";
export default function HomePage({ user }) {
	return (
		<div className="home-page-outer-container">
			<div className="home-page-inner-container">
				<h2>Welcome, {user.firstName + "👋"}</h2>
				<Link to="create-group">Start a new group</Link>
				<div className="user-events-groups">
					<div className="user-events">
						<h3>Events from your groups</h3>
					</div>
					<div className="user-groups">
						<h3>Your groups</h3>
					</div>
				</div>
			</div>
		</div>
	);
}
