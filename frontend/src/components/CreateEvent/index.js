import { thunkPostEvent, thunkPostEventImage } from "../../store/eventsReducer";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import "./CreateEvent.css";
import CalendarSVG from "../SVGComponents/CalendarSVG";
export default function CreateEvent() {
	const { groupId } = useParams();
	const dispatch = useDispatch();
	const [name, setName] = useState("");
	const [type, setType] = useState("In person");
	const [capacity, setCapacity] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [startTime, setStartTime] = useState("");

	const [endDate, setEndDate] = useState("");
	const [endTime, setEndTime] = useState("");
	const [previewImageUrl, setPreviewImageUrl] = useState("");
	const [onlineChecked, setOnlineChecked] = useState(false);

	const [errors, setErrors] = useState({});
	const history = useHistory();

	const handleSubmit = e => {
		e.preventDefault();

		const start = startDate + "T" + startTime;
		const end = endDate + "T" + endTime;

		const valErrors = {};

		if (new Date(start) > new Date(end)) {
			console.log(start);
			console.log(end);
			valErrors.startDate =
				"Event start time/date must be before end time/date";
		}
		if (!startDate.length || !endDate.length)
			valErrors.startDate = "Start/end time and date are required";
		if (!previewImageUrl.length)
			valErrors.previewImageUrl = "Preview Image is required";
		if (!name.length) valErrors.name = "Name is required";
		if (name.length < 5) valErrors.name = "Name must be at least 5 characters";
		if (!description.length) valErrors.description = "Description is required";
		if (!price.length) valErrors.price = "Price is required";
		if (!capacity.length) valErrors.capacity = "Capacity is required";
		if (Object.keys(valErrors).length) {
			setErrors(valErrors);
			console.log(valErrors);
			return;
		}

		const newEvent = {
			name,
			groupId,
			type,
			capacity,
			price,
			description,
			startDate: `${startDate}T${startTime}`,
			endDate: `${endDate}T${endTime}`
		};

		const newImage = {
			url: previewImageUrl,
			preview: true
		};

		dispatch(thunkPostEvent(newEvent, groupId))
			.then(res => {
				dispatch(thunkPostEventImage(newImage, res.id))
					.then(() => {
						history.push(`/events/${res.id}`);
					})
					.catch(async res => {
						const data = await res.json();
						setErrors(data.errors);
					});
			})
			.catch(async res => {
				const data = await res.json();
				setErrors(data.errors);
			});
	};
	return (
		<div id="create-event-outer-container">
			<div id="create-event-inner-container">
				<CalendarSVG />
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
						onBlur={e => {
							const price = e.target.value;
							const splitPrice = price.split(".");
							if (splitPrice.length === 2) {
								if (splitPrice[1].length > 2) {
									splitPrice[1] = splitPrice[1].slice(0, 2);
								}
								if (splitPrice[1].length < 2) {
									splitPrice[1] = splitPrice[1] + "0";
								}
								e.target.value = splitPrice.join(".");
								setPrice(e.target.value);
							} else {
								e.target.value = `${price}.00`;
								setPrice(e.target.value);
							}
						}}
						step="0.01"
						onChange={e => setPrice(e.target.value)}
					/>
					{errors.price && (
						<p className="create-event-errors">{errors.price}</p>
					)}
					<label htmlFor="event-capacity">Capacity</label>
					<input
						id="event-capacity"
						type="number"
						min="1"
						onBlur={e => {
							if (e.target.value % 1 !== 0) {
								e.target.value = Math.floor(e.target.value);
								setCapacity(e.target.value);
							} else if (e.target.value < 1) {
								e.target.value = 1;
								setCapacity(e.target.value);
							}
						}}
						onChange={e => setCapacity(e.target.value)}
					/>
					<div id="event-dates">
						{errors.startDate && (
							<p className="create-event-errors">{errors.startDate}</p>
						)}
						<div id="event-start">
							<div className="time-date-container">
								<label htmlFor="event-start-date">Start date</label>
								<input
									id="event-start-date"
									type="date"
									min={new Date(Date.now() + 24).toISOString().split("T")[0]}
									onChange={e => setStartDate(e.target.value)}
								/>
							</div>
							<div className="time-date-container">
								<label htmlFor="event-start-time">Start time</label>
								<input
									id="event-start-time"
									type="time"
									onChange={e => setStartTime(e.target.value)}
								/>
							</div>
						</div>
						<div id="event-end">
							<div className="time-date-container">
								<label htmlFor="event-end-date">End date</label>
								<input
									id="event-end-date"
									type="date"
									min={new Date(Date.now() + 24).toISOString().split("T")[0]}
									onChange={e => setEndDate(e.target.value)}
								/>
							</div>
							<div className="time-date-container">
								<label htmlFor="event-end-time">End time</label>
								<input
									id="event-end-time"
									type="time"
									onChange={e => setEndTime(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<label htmlFor="preview-url">Preview image url</label>
					<input
						type="url"
						id="preview-url"
						onChange={e => setPreviewImageUrl(e.target.value)}
					/>
					{errors.previewImageUrl && (
						<p className="create-event-errors">{errors.previewImageUrl}</p>
					)}
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
}
