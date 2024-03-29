import "./CreateAGroup.css";
import { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { thunkPostGroup, thunkPostGroupImage } from "../../store/groupsReducer";
import GroupImageSVG from "../SVGComponents/GroupImageSVG";

export default function CreateAGroup() {
	const dispatch = useDispatch();
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [type, setType] = useState("Online");
	const [privacy, setPrivacy] = useState(false);
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [onlineChecked, setOnlineChecked] = useState(true);
	const [publicChecked, setPublicChecked] = useState(true);
	const [image, setImage] = useState(null);

	const [errors, setErrors] = useState({});
	const history = useHistory();
	const redirect = path => history.push(path);

	const handleSubmit = e => {
		e.preventDefault();

		const valErrors = {};

		if (!image) valErrors.previewImage = "Preview Image is required";
		if (!name.length) valErrors.name = "Name is required";
		if (name.length > 60)
			valErrors.name = "Name must be shorter than 60 characters";
		if (!about.length) valErrors.about = "About is required";
		if (about.length < 50)
			valErrors.about = "About must be 50 characters or more";
		if (!city.length) valErrors.city = "City is required";
		if (city.toLowerCase() === city.toUpperCase())
			valErrors.city = "City must be all letters";
		if (city.length > 20) {
			valErrors.city = "City must be 20 characters or less";
		}
		if (state.toLowerCase() === state.toUpperCase())
			valErrors.state = "State must be all letters";
		if (!state.length) valErrors.state = "State is required";
		if (state.length < 2 || state.length > 2)
			valErrors.state = "State must be two letter abbreviation";

		if (Object.keys(valErrors).length) {
			setErrors(valErrors);
			return;
		}

		const newGroup = {
			name,
			about,
			type,
			private: privacy,
			city: city[0].toUpperCase() + city.slice(1).toLowerCase(),
			state: state.toUpperCase()
		};

		const formData = new FormData();
		formData.append("image", image);
		formData.append("preview", true);

		dispatch(thunkPostGroup(newGroup))
			.then(res => {
				dispatch(thunkPostGroupImage(formData, res.id))
					.then(() => {
						redirect(`/groups/${res.id}`);
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

	const updateFile = e => {
		const file = e.target.files[0];
		if (file) setImage(file);
	};
	return (
		<div id="create-group-outer-container">
			<GroupImageSVG />
			<div id="create-group-inner-container">
				<form id="create-group-form" onSubmit={handleSubmit}>
					<h1>Create a group</h1>
					<label htmlFor="group-name">Name</label>
					<input
						id="group-name"
						type="text"
						onChange={e => setName(e.target.value)}
					/>
					{errors.name && <p className="create-group-errors">{errors.name}</p>}
					<label htmlFor="group-about">About</label>
					<textarea
						id="group-about"
						type="text-field"
						onChange={e => setAbout(e.target.value)}
					/>
					{errors.about && (
						<p className="create-group-errors">{errors.about}</p>
					)}
					<p>Type</p>
					<div id="group-type-setting">
						<div className="group-radio-one">
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
								type="radio"
								id="in-person"
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
					<p>Privacy</p>
					<div id="group-privacy-setting">
						<div className="group-radio-two">
							<label htmlFor="public">Public</label>
							<input
								type="radio"
								id="public"
								name="private"
								value={false}
								checked={publicChecked}
								onChange={e => {
									setPrivacy(e.target.value);
									setPublicChecked(true);
								}}
							/>
						</div>
						<div className="group-radio-one">
							<label htmlFor="private">Private</label>
							<input
								type="radio"
								id="private"
								name="private"
								value={true}
								checked={!publicChecked}
								onChange={e => {
									setPrivacy(e.target.value);
									setPublicChecked(false);
								}}
							/>
						</div>
					</div>
					<label htmlFor="group-city">City</label>
					<input
						id="group-city"
						type="text"
						onChange={e => setCity(e.target.value)}
					/>
					{errors.city && <p className="create-group-errors">{errors.city}</p>}
					<label htmlFor="group-state">State</label>
					<input
						id="group-state"
						type="text"
						onChange={e => setState(e.target.value)}
					/>
					{errors.state && (
						<p className="create-group-errors">{errors.state}</p>
					)}
					{!image ? (
						<>
							<label htmlFor="image-upload-input" className="custom-file-input">
								<i className="fa fa-cloud-upload upload-file-icon"></i> Upload
								group preview image
							</label>
							<input
								id="image-upload-input"
								name="image-upload-input"
								className="image-upload-input"
								type="file"
								onChange={updateFile}
							/>
						</>
					) : (
						<>
							<label
								htmlFor="image-upload-input"
								className="custom-file-input custom-file-input--loaded"
							>
								<i className="fa fa-check upload-file-icon"></i> Upload group
								preview image
							</label>
							<input
								id="image-upload-input"
								name="image-upload-input"
								className="image-upload-input"
								type="file"
								onChange={updateFile}
							/>
						</>
					)}
					{errors.previewImage && (
						<p className="create-group-errors">{errors.previewImageUrl}</p>
					)}
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
}
