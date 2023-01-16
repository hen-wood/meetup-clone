import { Link } from "react-router-dom";
import "./EventsGroups.css";
import Groups from "./Groups";
export default function EventsGroups({ activeTab }) {
	const navBar = document.querySelector(".navigation");
	navBar.className = "navigation splash-exit";
	return (
		<div id="events-groups-outer-container">
			<div id="events-groups-content-container">
				<div id="events-groups-tabs-container">
					<Link
						to="/home/events"
						className={activeTab === "events" ? "active" : ""}
					>
						Events
					</Link>
					<Link
						to="/home/groups"
						className={activeTab === "groups" ? "active" : ""}
					>
						Groups
					</Link>
				</div>
				<Groups />
			</div>
		</div>
	);
}
