import { useHistory } from "react-router-dom";
import { formatEventDate } from "./formatEventDate";

export default function UpcomingEvents({ events, status, isPrivate }) {
	const history = useHistory();
	const handleEventClick = eventId => {
		history.push(`/events/${eventId}`);
	};
	return events.length ? (
		events.map(event => {
			const date = formatEventDate(event.startDate);
			return (
				new Date(event.startDate) > new Date(Date.now()) && (
					<div
						key={event.id}
						className="gr-about__event-card"
						onClick={() => handleEventClick(event.id)}
					>
						<div className="gr-about__event-card__top">
							<div className="gr-about__event-card__stats">
								<p className="gr-about__event-card__date">{date}</p>
								<h2 className="gr-about__event-card__title">{event.name}</h2>
								{event.venueId && (
									<div className="gr-about__event-card__stat">
										<i className="fa-solid fa-location-dot gr-about__event-card__loc__icon"></i>
										{!isPrivate || status.length > 0 ? (
											<p className="gr-about__event-card__loc__text">
												{event.Venue.city}, {event.Venue.state}
											</p>
										) : (
											<p className="gr-about__event-card__loc__text">
												Location visible to members
											</p>
										)}
									</div>
								)}
							</div>
							<img
								className="gr-about__event-card__image"
								src={event.previewImage}
								alt={event.name}
							/>
						</div>
						<p className="gr-about__event-card__description">
							{event.description}
						</p>
						<div className="gr-about__event-card__bottom">
							<p className="gr-about__event-card__num-att">
								{event.numAttending} attendees
							</p>
						</div>
					</div>
				)
			);
		})
	) : (
		<div className="no-events__container">
			<i className="fa-regular fa-calendar no-events-icon"></i>
			<h2 className="no-events__title">No upcoming events</h2>
		</div>
	);
}
