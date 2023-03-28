import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	thunkGetAllGroupEvents,
	thunkGetSingleEvent
} from "../../store/eventsReducer";
import { formatEventDate } from "./formatEventDate";

export function UpcomingEvents({ groupId }) {
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

	const findNumOfEvents = (pastOrFuture, eventsArr) => {
		return eventsArr.filter(event =>
			pastOrFuture === "past"
				? new Date(event.startDate) < new Date(Date.now())
				: new Date(event.startDate) > new Date(Date.now())
		).length;
	};

	const events = useSelector(state => state.events.allGroupEvents);
	const eventsValues = Object.values(events);
	return isLoaded ? (
		<div className="group-about__events">
			<h2 className="group-about__title">
				Upcoming Events ({findNumOfEvents("future", eventsValues)})
			</h2>
			{eventsValues.map(event => {
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
											<p className="gr-about__event-card__loc__text">
												{event.Venue.city}, {event.Venue.state}
											</p>
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
								<button className="gr-about__event-card__button">Attend</button>
							</div>
						</div>
					)
				);
			})}
			<h2 className="group-about__title">
				Past Events ({findNumOfEvents("past", eventsValues)})
			</h2>
			{eventsValues.map(event => {
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
			})}
		</div>
	) : (
		<div className="group-about__events">
			<h1>Loading events...</h1>
		</div>
	);
}
