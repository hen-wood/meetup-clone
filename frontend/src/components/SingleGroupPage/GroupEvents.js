import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroupEvents, getSingleEvent } from "../../store/eventsReducer";
import dayMonthDate from "../../utils/dayMonthDate";
export default function GroupEvents({ groupId }) {
	const dispatch = useDispatch();
	const history = useHistory();
	useEffect(() => {
		dispatch(getAllGroupEvents(groupId));
	}, [dispatch, groupId]);

	const handleEventClick = eventId => {
		dispatch(getSingleEvent(eventId)).then(() => {
			history.push(`/events/${eventId}`);
		});
	};

	const events = useSelector(state => state.events.allGroupEvents);
	const eventsValues = Object.values(events);
	return eventsValues.length ? (
		eventsValues.map(event => {
			const date = dayMonthDate(event.startDate);
			return (
				<div
					key={event.id}
					className="individual-group-event-container"
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
								{`${event.Group.name} · ${event.Venue.city}, ${event.Venue.state}`.toUpperCase()}
							</p>
						</div>
						<div className="attending-count">
							<p>{event.numAttending + " attendees"}</p>
						</div>
					</div>
				</div>
			);
		})
	) : (
		<div className="no-events-container">
			<h3>No events for this group 😭</h3>
		</div>
	);
}
