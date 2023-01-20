import "./Events.css";
import "./mobile.css";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllEvents } from "../../store/eventsReducer";
import { useEffect, useState } from "react";
import dayMonthDate from "../../utils/dayMonthDate";
import { thunkGetSingleEvent } from "../../store/eventsReducer";
import { useHistory } from "react-router-dom";

export default function Events() {
	const dispatch = useDispatch();
	const history = useHistory();
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		dispatch(thunkGetAllEvents()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	const handleEventClick = eventId => {
		dispatch(thunkGetSingleEvent(eventId)).then(() => {
			history.push(`/events/${eventId}`);
		});
	};

	const eventsObj = useSelector(state => state.events.allEvents);
	const eventKeys = Object.keys(eventsObj);

	const content = eventKeys.length ? (
		eventKeys.map(key => {
			const event = eventsObj[key];
			const date = dayMonthDate(event.startDate);
			return (
				<div
					key={event.id}
					className="individual-event-container"
					onClick={() => handleEventClick(event.id)}
				>
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
								{`${event.Group.name} · ${event.Group.city}, ${event.Group.state}`.toUpperCase()}
							</p>
						</div>
						<div className="attending-count">
							<p>
								{event.numAttending !== 1
									? event.numAttending + " attendees"
									: event.numAttending + " attendee"}
							</p>
						</div>
					</div>
				</div>
			);
		})
	) : (
		<h3>No events yet 😭...</h3>
	);

	return isLoaded ? (
		<div id="group-event-list-container">{content}</div>
	) : (
		<div id="group-event-list-container">
			<h1>Loading events...</h1>
		</div>
	);
}
