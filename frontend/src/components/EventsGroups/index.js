import { Link } from "react-router-dom";
import "./EventsGroups.css";
import "./mobile.css";
import Groups from "./Groups";
import Events from "./Events";
export default function EventsGroups({ activeTab }) {
	const navBar = document.querySelector(".navigation");
	navBar.className = "navigation splash-exit";

	const content = activeTab === "groups" ? <Groups /> : <Events />;
	return (
		<div id="events-groups-outer-container">
			<div id="events-groups-content-container">
				<div id="events-groups-tabs-container">
					<Link
						to="/all-events"
						className={activeTab === "events" ? "active" : ""}
					>
						Events
					</Link>
					<Link
						to="/all-groups"
						className={activeTab === "groups" ? "active" : ""}
					>
						Groups
					</Link>
				</div>
				{content}
			</div>
		</div>
	);
}
