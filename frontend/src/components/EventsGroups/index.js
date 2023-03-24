import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./EventsGroups.css";
import "./mobile.css";
import Groups from "./Groups";
import Events from "./Events";
export default function EventsGroups({ activeTab }) {
	const navBar = document.querySelector(".navigation");
	navBar.className = "navigation splash-exit";
	const groupEventsDiv = useRef(null);
	const [atBottom, setAtBottom] = useState(false);

	const detectBottom = () => {
		const scrollTop = window.pageYOffset;
		const scrollHeight = document.body.scrollHeight;
		const clientHeight = document.documentElement.clientHeight;
		if (scrollHeight - clientHeight === scrollTop) {
			setAtBottom(true);
		} else {
			setAtBottom(false);
		}
	};

	useEffect(() => {
		document.addEventListener("scroll", detectBottom);
		return () => {
			document.removeEventListener("scroll", detectBottom);
		};
	}, []);

	const content =
		activeTab === "groups" ? (
			<Groups atBottom={atBottom} />
		) : (
			<Events atBottom={atBottom} />
		);
	return (
		<div id="events-groups-outer-container" ref={groupEventsDiv}>
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
