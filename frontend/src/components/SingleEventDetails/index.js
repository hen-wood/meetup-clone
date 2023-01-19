import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleEvent } from "../../store/eventsReducer";

export default function SingleEventDetails() {
	const { eventId } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getSingleEvent(eventId));
	}, [dispatch, eventId]);

	const event = useSelector(state => state.events.singleEvent);
	return event.name ? (
		<div>
			<h1>{event.name}</h1>
			<h2>{event.Group.name}</h2>
		</div>
	) : (
		<h1>Loading...</h1>
	);
}
