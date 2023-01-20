import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	thunkGetAllGroupEvents,
	thunkGetSingleEvent
} from "../../store/eventsReducer";
import dayMonthDate from "../../utils/dayMonthDate";

export default function GroupEvents({ groupId }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(thunkGetAllGroupEvents(groupId)).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch, groupId]);

	const handleEventClick = eventId => {
		dispatch(thunkGetSingleEvent(eventId)).then(() => {
			history.push(`/events/${eventId}`);
		});
	};

	const events = useSelector(state => state.events.allGroupEvents);
	const eventsValues = Object.values(events);
	const content = eventsValues.length ? (
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
	return isLoaded ? <>{content}</> : <h1>Loading events...</h1>;
}
