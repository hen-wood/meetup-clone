import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { formatEventDate } from "./formatEventDate";
import { thunkGetSingleEvent } from "../../store/eventsReducer";

export function PastEvents({ events }) {
	const history = useHistory();
	const dispatch = useDispatch;
	const handleEventClick = eventId => {
		dispatch(thunkGetSingleEvent(eventId)).then(() => {
			history.push(`/events/${eventId}`);
		});
	};

	return events.length ? (
		events.map(event => {
			const date = formatEventDate(event.startDate);
			return (
				new Date(event.startDate) < new Date(Date.now()) && (
					<div
						key={event.id}
						className="gr-about__event-card"
						onClick={() => handleEventClick(event.id)}
					>
						<div className="gr-about__event-card__top">
							<div className="gr-about__event-card__stats">
								<p className="gr-about__event-card__date">{date}</p>
								<h2 className="gr-about__event-card__title">{event.name}</h2>
							</div>
							<img
								className="gr-about__event-card__image"
								src={event.previewImage}
								alt={event.name}
							/>
						</div>
					</div>
				)
			);
		})
	) : (
		<div className="no-events__container">
			<h2 className="no-events__title">No upcoming events</h2>
		</div>
	);
}
