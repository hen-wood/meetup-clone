import "./Events.css";
import "./mobile.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../store/eventsReducer";
import { useEffect } from "react";
import dayMonthDate from "../../utils/dayMonthDate";
export default function Events() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllEvents());
	}, [dispatch]);

	const eventsObj = useSelector(state => state.events.allEvents);
	const eventKeys = Object.keys(eventsObj);

	const content = eventKeys.length ? (
		eventKeys.map(key => {
			const event = eventsObj[key];
			const date = dayMonthDate(event.startDate);
			return (
				<div key={event.id} className="individual-event-container">
					<div className="event-preview-image-container">
						<img
							src={
								event.previewImage
									? event.previewImage
									: "https://i.imgur.com/NO25iZV.png"
							}
							alt={event.name + " preview image"}
						/>
					</div>
					<div className="event-text-content-container">
						<div>
							<h3 className="event-time">{date}</h3>
							<h2 className="event-text-title">{event.name}</h2>
							<p className="event-text-group-city-state">
								{`${event.Group.name} · ${event.Venue.city}, ${event.Venue.state}`.toUpperCase()}
							</p>
						</div>
						<div className="attending-count">
							<p>{event.numAttending + " attendees"}</p>
							<i className="fa-solid fa-arrow-up-from-bracket" />
						</div>
					</div>
				</div>
			);
		})
	) : (
		<h3>Loading events...</h3>
	);

	return <div id="group-event-list-container">{content}</div>;
}
