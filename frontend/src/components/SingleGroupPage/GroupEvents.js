import { useState } from "react";
import PastEvents from "./PastEvents";
import UpcomingEvents from "./UpcomingEvents";

export default function GroupEvents({ events }) {
	const [eventList, setEventList] = useState("future");

	const eventsArr = Object.values(events);
	const pastEvents = eventsArr.filter(event => {
		return new Date(event.startDate) < new Date(Date.now());
	});
	const futureEvents = eventsArr.filter(event => {
		return new Date(event.startDate) > new Date(Date.now());
	});
	return (
		<div className="group-events__container">
			<div className="switch-box">
				<button
					className={
						eventList === "future"
							? "switch-box__tab switch-box__tab--selected"
							: "switch-box__tab"
					}
					onClick={() => setEventList("future")}
				>
					Upcoming
				</button>
				<button
					className={
						eventList === "past"
							? "switch-box__tab switch-box__tab--selected"
							: "switch-box__tab"
					}
					onClick={() => setEventList("past")}
				>
					Past
				</button>
			</div>
			<div className="group-event__cards">
				{eventList === "future" ? (
					<UpcomingEvents events={futureEvents} />
				) : (
					<PastEvents events={pastEvents} />
				)}
			</div>
		</div>
	);
}
