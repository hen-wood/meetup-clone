import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "../CreateAGroup/CreateAGroup.css";
import "./EditGroup.css";
import { thunkPutGroup, thunkGetSingleGroup } from "../../store/groupsReducer";
import GroupImageSVG from "../SVGComponents/GroupImageSVG";

export default function EditGroup() {
	const dispatch = useDispatch();
	const history = useHistory();
	const { groupId } = useParams();

	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [type, setType] = useState("Online");
	const [onlineChecked, setOnlineChecked] = useState(true);
	const [privacy, setPrivacy] = useState(true);
	const [privateChecked, setPrivateChecked] = useState(false);
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [errors, setErrors] = useState({});

	useEffect(() => {
		dispatch(thunkGetSingleGroup(groupId)).then(async res => {
			await res;
			setName(res.name);
			setAbout(res.about);
			setType(res.type);
			setPrivacy(res.private);
			setCity(res.city);
			setState(res.state);
			setOnlineChecked(res.type === "Online");
			setPrivateChecked(res.private);
		});
	}, [dispatch, groupId]);

	const handleSubmit = e => {
		e.preventDefault();

		const valErrors = {};

		if (!name.length) valErrors.name = "Name is required";
		if (name.length > 60)
			valErrors.name = "Name must be shorter than 60 characters";
		if (!about.length) valErrors.about = "About is required";
		if (about.length < 50)
			valErrors.about = "About must be 50 characters or more";
		if (!city.length) valErrors.city = "City is required";
		if (city.toLowerCase() === city.toUpperCase())
			valErrors.city = "City must be all letters";
		if (state.toLowerCase() === state.toUpperCase())
			valErrors.state = "State must be all letters";
		if (!state.length) valErrors.state = "State is required";
		if (state.length < 2 || state.length > 2)
			valErrors.state = "State must be two letter abbreviation";

		if (Object.keys(valErrors).length) {
			setErrors(valErrors);
			return;
		}

		const editedGroup = {
			name,
			about,
			type,
			private: privacy,
			city: city[0].toUpperCase() + city.slice(1).toLowerCase(),
			state: state.toUpperCase()
		};

		dispatch(thunkPutGroup(editedGroup, groupId))
			.then(() => {
				history.push(`/groups/${groupId}`);
			})
			.catch(async res => {
				const data = await res.json();
				setErrors(data.errors);
			});
	};

	const group = useSelector(state => state.groups.singleGroup);
	return Object.keys(group).length ? (
		<div id="edit-group-outer-container">
			<GroupImageSVG />
			<div id="edit-group-inner-container">
				<form id="edit-group-form" onSubmit={handleSubmit}>
					<h1>Edit {group.name}</h1>
					<label htmlFor="edit-group-name">Name</label>
					<input
						id="edit-group-name"
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
					/>
					{errors.name && <p className="edit-group-errors">{errors.name}</p>}
					<label htmlFor="edit-group-about">About</label>
					<textarea
						id="edit-group-about"
						type="text"
						value={about}
						onChange={e => setAbout(e.target.value)}
					/>
					{errors.about && <p className="edit-group-errors">{errors.about}</p>}
					<p>Type</p>
					<div id="edit-group-type-setting">
						<div className="group-radio-one">
							<label htmlFor="edit-group-type-online">Online</label>
							<input
								id="edit-group-type-online"
								type="radio"
								name="edit-group-type"
								value="Online"
								checked={onlineChecked}
								onChange={e => {
									setType(e.target.value);
									setOnlineChecked(true);
								}}
							/>
						</div>
						<div className="group-radio-two">
							<label htmlFor="edit-group-type-in-person">In person</label>
							<input
								id="edit-group-type-in-person"
								type="radio"
								name="edit-group-type"
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
					<div id="edit-group-privacy-setting">
						<div className="group-radio-two">
							<label htmlFor="edit-group-privacy-false">Public</label>
							<input
								id="edit-group-privacy-false"
								type="radio"
								name="edit-group-privacy"
								value={false}
								checked={!privateChecked}
								onChange={e => {
									setPrivacy(e.target.value);
									setPrivateChecked(false);
								}}
							/>
						</div>
						<div className="group-radio-one">
							<label htmlFor="edit-group-privacy-true">Private</label>
							<input
								id="edit-group-privacy-true"
								type="radio"
								name="edit-group-privacy"
								value={true}
								checked={privateChecked}
								onChange={e => {
									setPrivacy(e.target.value);
									setPrivateChecked(true);
								}}
							/>
						</div>
					</div>
					<label htmlFor="edit-group-city">City</label>
					<input
						id="edit-group-city"
						type="text"
						value={city}
						onChange={e => setCity(e.target.value)}
					/>
					{errors.city && <p className="edit-group-errors">{errors.city}</p>}
					<label htmlFor="edit-group-state">State</label>
					<input
						id="edit-group-state"
						type="text"
						value={state}
						onChange={e => setState(e.target.value)}
					/>
					{errors.state && <p className="edit-group-errors">{errors.state}</p>}
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	) : (
		<div id="loading-form-data">
			<h1>Loading form data...</h1>
		</div>
	);
}
