import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteEvent, getSingleEvent } from "../../store/eventsReducer";
import "./SingleEventDetails.css";
import { timeFormatForEvent } from "../../utils/timeFormatForEvent";
import { getGroupMemberships } from "../../store/groupsReducer";
import formatEventPrice from "../../utils/formatEventPrice";

export default function SingleEventDetails() {
	const { eventId } = useParams();
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);

	const history = useHistory();

	useEffect(() => {
		dispatch(getSingleEvent(eventId)).then(async res => {
			const data = await res;
			dispatch(getGroupMemberships(data.groupId)).then(() => {
				setIsLoaded(true);
			});
		});
	}, [dispatch, eventId]);

	const handleGroupClick = groupId => {
		history.push(`/groups/${groupId}`);
	};

	const handleDeleteClick = () => {
		dispatch(deleteEvent(eventId))
			.then(async res => {
				await res;
				history.push("/home");
			})
			.catch(async res => {
				const data = await res;
				console.log(data);
			});
	};

	const event = useSelector(state => state.events.singleEvent);
	const user = useSelector(state => state.session.user);
	const groupMembers = useSelector(state => state.groups.groupMembers);

	const isCohost =
		user &&
		Object.values(groupMembers).some(member => {
			return member.id === user.id && member.Membership.status === "co-host";
		});

	console.log(isCohost);

	const cohostOptions = isCohost && (
		<div>
			<b>
				<p>Co-host options</p>
			</b>
			<button id="delete-event-button" onClick={handleDeleteClick}>
				Delete event
			</button>
		</div>
	);

	return isLoaded ? (
		<div id="single-event-outer-container">
			<div id="single-event-inner-container">
				<h1>{event.name}</h1>
				<div id="single-event-info-container">
					<div id="single-event-image-container">
						<img
							id="single-event-preview-image"
							src={event.EventImages.find(image => image.preview === true).url}
							alt={`${event.name} preview image`}
						/>
					</div>
					<div
						id="event-group-and-time-container"
						onClick={() => handleGroupClick(event.Group.id)}
					>
						<div id="event-group-info-box">
							<b>
								<p>{event.Group.name}</p>
							</b>
							<p>{event.Group.private ? "Private group" : "Public group"}</p>
						</div>
						<div id="event-time-info-box">
							<div>
								<i className="fa-regular fa-clock"></i>
							</div>
							<div id="event-times">
								<p>{timeFormatForEvent(event.startDate)}</p>
								<p>{"to " + timeFormatForEvent(event.endDate)}</p>
							</div>
						</div>
						<div id="event-price-box">
							<p>{formatEventPrice(event.price)}</p>
						</div>
						{isCohost && cohostOptions}
					</div>
				</div>
				<h2 id="event-details-title">Details</h2>
				<p id="event-description">{event.description}</p>
			</div>
		</div>
	) : (
		<div id="single-event-outer-container">
			<div id="single-event-inner-container">
				<h1>Loading event...</h1>
			</div>
		</div>
	);
}
