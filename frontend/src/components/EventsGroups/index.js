import { Link } from "react-router-dom";
import "./EventsGroups.css";
export default function EventsGroups({ activeTab }) {
	return (
		<div id="events-groups-outer-container">
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
		</div>
	);
}
