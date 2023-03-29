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
			<div className="group-events__up-past-box">
				<button
					className={
						eventList === "future"
							? "up-past-box__tab up-past-box__tab--selected"
							: "up-past-box__tab"
					}
					onClick={() => setEventList("future")}
				>
					Upcoming
				</button>
				<button
					className={
						eventList === "past"
							? "up-past-box__tab up-past-box__tab--selected"
							: "up-past-box__tab"
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
