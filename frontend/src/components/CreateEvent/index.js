import { postNewEvent, postNewEventImage } from "../../store/eventsReducer";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";

export default function CreateEvent() {
	const { groupId } = useParams();
	const dispatch = useDispatch();
	const [name, setName] = useState("");
	const [type, setType] = useState("Online");
	const [capacity, setCapacity] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [previewImageUrl, setPreviewImageUrl] = useState("");
	const [onlineChecked, setOnlineChecked] = useState(false);

	const [errors, setErrors] = useState({});
	const history = useHistory();

	const handleSubmit = e => {
		e.preventDefault();

		const valErrors = {};

		if (!previewImageUrl.length)
			valErrors.previewImageUrl = "Preview Image is required";
		if (!name.length) valErrors.name = "Name is required";
		if (name.length < 5) valErrors.name = "Name must be at least 5 characters";
		if (!description.length) valErrors.description = "Description is required";

		if (Object.keys(valErrors).length) {
			setErrors(valErrors);
			console.log(valErrors);
			return;
		}

		const newEvent = {
			name,
			groupId,
			venueId: 2,
			type,
			capacity,
			price,
			description,
			startDate,
			endDate
		};

		const newImage = {
			url: previewImageUrl,
			preview: true
		};

		dispatch(postNewEvent(newEvent, groupId))
			.then(res => {
				dispatch(postNewEventImage(newImage, res.id))
					.then(() => {
						history.push(`/home`);
					})
					.catch(async res => {
						const data = await res.json();
						console.log(data);
						setErrors(data.errors);
					});
			})
			.catch(async res => {
				const data = await res.json();
				console.log(data);
				setErrors(data.errors);
			});
	};
	return (
		<div id="create-event-outer-container">
			<div id="create-event-inner-container">
				<form id="create-event-form" onSubmit={handleSubmit}>
					<h1>Create new event</h1>
					<label htmlFor="event-name">Name</label>
					<input
						id="event-name"
						type="text"
						onChange={e => setName(e.target.value)}
					/>
					{errors.name && <p className="create-event-errors">{errors.name}</p>}
					<label htmlFor="event-description">Description</label>
					<textarea
						id="event-description"
						type="text-field"
						onChange={e => setDescription(e.target.value)}
					/>
					{errors.description && (
						<p className="create-event-errors">{errors.description}</p>
					)}
					<p>Type</p>
					<div id="event-type-setting">
						<div className="event-radio-one">
							<label htmlFor="online">Online</label>
							<input
								type="radio"
								id="online"
								name="type"
								value="Online"
								checked={onlineChecked}
								onChange={e => {
									setType(e.target.value);
									setOnlineChecked(true);
								}}
							/>
						</div>
						<div className="group-radio-two">
							<label htmlFor="in-person">In person</label>
							<input
								id="in-person"
								type="radio"
								name="type"
								value="In person"
								checked={!onlineChecked}
								onChange={e => {
									setType(e.target.value);
									setOnlineChecked(false);
								}}
							/>
						</div>
					</div>
					<label htmlFor="event-price">Price</label>
					<input
						id="event-price"
						type="number"
						min="0"
						step=".01"
						onChange={e => setPrice(e.target.value)}
					/>
					<label htmlFor="event-capacity">Capacity</label>
					<input
						id="event-capacity"
						type="number"
						min="1"
						step="1"
						onChange={e => setCapacity(e.target.value)}
					/>
					<label htmlFor="event-start-date">Start date</label>
					<input
						id="event-start-date"
						type="datetime-local"
						min={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
						onChange={e => setStartDate(e.target.value)}
					/>
					<input
						id="event-end-date"
						type="datetime-local"
						min={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
						onChange={e => setEndDate(e.target.value)}
					/>
					<label htmlFor="preview-url">Preview image url</label>
					<input
						type="url"
						id="preview-url"
						onChange={e => setPreviewImageUrl(e.target.value)}
					/>
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
}
