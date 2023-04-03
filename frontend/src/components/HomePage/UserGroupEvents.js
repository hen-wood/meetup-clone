import { useState } from "react";
import Calendar from "react-calendar";
import compareDates from "./compareDates";
import formatDateTitle from "./formatDateTitle";
import dayMonthDate from "../../utils/dayMonthDate";
import "react-calendar/dist/Calendar.css";
import "./UserGroupEvents.css";
import { useDispatch } from "react-redux";
import { thunkGetSingleEvent } from "../../store/eventsReducer";
import { useHistory } from "react-router-dom";

export default function UserGroupEvents({ eventsObj, groupsObj }) {
	const history = useHistory();
	const dispatch = useDispatch();
	const redirectSingleGroup = groupId => history.push(`/groups/${groupId}`);
	const eventsArr = Object.values(eventsObj);
	const [selectedDate, setSelectedDate] = useState(new Date());

	const handleEventClick = eventId => {
		dispatch(thunkGetSingleEvent(eventId)).then(() => {
			history.push(`/events/${eventId}`);
		});
	};

	const handleDayClick = date => {
		setSelectedDate(date);
	};

	const handleGroupClick = groupId => {
		redirectSingleGroup(groupId);
	};
	return (
		<div className="calendar-events__container">
			<h3 className="user-group-events__title">Events from your groups</h3>
			<div className="calendar-events__container__inner">
				<div className="calendar-events-left">
					<Calendar
						onChange={setSelectedDate}
						value={selectedDate}
						minDetail={"month"}
						next2Label={null}
						prev2Label={null}
						onClickDay={handleDayClick}
					/>
					<h3 className="user-group-events__title">Your groups</h3>
					<div className="your-groups__container">
						{Object.values(groupsObj).map(group => {
							const preview = group.GroupImages.find(
								img => img.preview === true
							);
							console.log(preview);
							return (
								<div
									key={group.id}
									className="your-groups-card"
									onClick={() => handleGroupClick(group.id)}
								>
									<img
										className="your-groups-card__image"
										src={preview ? preview.url : ""}
										alt={group.name}
									/>
									<p>{group.name}</p>
								</div>
							);
						})}
					</div>
				</div>
				<div className="home-page-events">
					<div className="home-page-events--selected">
						<h3 className="home-page-events__title">
							{formatDateTitle(selectedDate)}
						</h3>
						{eventsArr.filter(event =>
							compareDates(selectedDate, event.startDate)
						).length ? (
							eventsArr
								.filter(event => compareDates(selectedDate, event.startDate))
								.map(event => {
									const date = dayMonthDate(event.startDate);
									const previewImage = event.EventImages.find(
										image => image.preview === true
									);
									return (
										<div
											key={event.id}
											className="individual-event-container"
											onClick={() => handleEventClick(event.id)}
										>
											<div className="event-preview-image-container">
												<img
													src={
														previewImage
															? previewImage.url
															: "https://i.imgur.com/NO25iZV.png"
													}
													alt={event.name}
												/>
											</div>
											<div className="event-text-content-container">
												<div>
													<h3 className="event-time">{date}</h3>
													<h4 className="event-text-title">{event.name}</h4>
													<p className="event-text-group-city-state">
														{groupsObj[event.groupId].name.toUpperCase()}
													</p>
												</div>
												<div className="attending-count">
													<p>
														{event.Attendances.length !== 1
															? event.Attendances.length + " attendees"
															: event.Attendances.length + " attendee"}
													</p>
												</div>
											</div>
										</div>
									);
								})
						) : (
							<div className="no-events__container">
								<i className="fa-regular fa-calendar no-events-icon"></i>
								<p className="no-events__title">
									No events on {formatDateTitle(selectedDate)}
								</p>
							</div>
						)}
					</div>
					<div className="home-page-events--all">
						<h3 className="home-page-events__title">
							All events from your groups
						</h3>
						{eventsArr.length ? (
							eventsArr.map(event => {
								const date = dayMonthDate(event.startDate);
								const previewImage = event.EventImages.find(
									image => image.preview === true
								);
								return (
									<div
										key={event.id}
										className="individual-event-container"
										onClick={() => handleEventClick(event.id)}
									>
										<div className="event-preview-image-container">
											<img
												src={
													previewImage
														? previewImage.url
														: "https://i.imgur.com/NO25iZV.png"
												}
												alt={event.name}
											/>
										</div>
										<div className="event-text-content-container">
											<div>
												<h3 className="event-time">{date}</h3>
												<h4 className="event-text-title">{event.name}</h4>
												<p className="event-text-group-city-state">
													{groupsObj[event.groupId].name.toUpperCase()}
												</p>
											</div>
											<div className="attending-count">
												<p>
													{event.Attendances.length !== 1
														? event.Attendances.length + " attendees"
														: event.Attendances.length + " attendee"}
												</p>
											</div>
										</div>
									</div>
								);
							})
						) : (
							<div className="no-events__container">
								<i className="fa-regular fa-calendar no-events-icon"></i>
								<p className="no-events__title">
									No events found for your groups
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
