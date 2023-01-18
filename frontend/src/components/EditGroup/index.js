import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import "../CreateAGroup/CreateAGroup.css";
import "./EditGroup.css";
import { putGroup } from "../../store/groupsReducer";

export default function EditGroup() {
	const dispatch = useDispatch();
	const history = useHistory();
	const group = useSelector(state => state.groups.singleGroup);

	const [name, setName] = useState(group.name);
	const [about, setAbout] = useState(group.about);
	const [type, setType] = useState(group.type);
	const [onlineChecked, setOnlineChecked] = useState(group.type === "Online");
	const [privacy, setPrivacy] = useState(group.private);
	const [privateChecked, setPrivateChecked] = useState(group.private);
	const [city, setCity] = useState(group.city);
	const [state, setState] = useState(group.state);

	const handleSubmit = e => {
		e.preventDefault();
		const editedGroup = {
			name,
			about,
			type,
			private: privacy,
			city,
			state
		};

		dispatch(putGroup(editedGroup, group.id))
			.then(res => {
				console.log(res);
				history.push(`/groups/${group.id}`);
			})
			.catch(err => {
				console.log(err);
			});
	};

	return group ? (
		<div id="edit-group-outer-container">
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
					<label htmlFor="edit-group-about">About</label>
					<textarea
						id="edit-group-about"
						type="text"
						value={about}
						onChange={e => setAbout(e.target.value)}
					/>
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
					<label htmlFor="edit-group-state">State</label>
					<input
						id="edit-group-state"
						type="text"
						value={state}
						onChange={e => setState(e.target.value)}
					/>
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	) : (
		<h1>loading...</h1>
	);
	// 	<div id="create-group-outer-container">
	// 		<div id="create-group-inner-container">
	// 			<form id="create-group-form" onSubmit={handleSubmit}>
	// 				<h1>Edit {group.name}</h1>
	// 				<label htmlFor="group-name">Name</label>
	// 				<input
	// 					id="group-name"
	// 					type="text"
	// 					value={name}
	// 					onChange={e => setName(e.target.value)}
	// 				/>
	// 				<label htmlFor="group-about">Description</label>
	// 				<textarea
	// 					id="group-about"
	// 					type="text-field"
	// 					value={about}
	// 					onChange={e => setAbout(e.target.value)}
	// 				/>
	// 				<p>Type</p>
	// 				<div id="group-type-setting">
	// 					<div className="group-radio-one">
	// 						<label htmlFor="online">Online</label>
	// 						<input
	// 							type="radio"
	// 							id="online"
	// 							name="type"
	// 							value="Online"
	// 							checked={type === "Online"}
	// 							onChange={e => setType(e.target.value)}
	// 						/>
	// 					</div>
	// 					<div className="group-radio-two">
	// 						<label htmlFor="in-person">In person</label>
	// 						<input
	// 							type="radio"
	// 							id="in-person"
	// 							name="type"
	// 							value="In person"
	// 							checked={type === "In person"}
	// 							onChange={e => setType(e.target.value)}
	// 						/>
	// 					</div>
	// 				</div>
	// 				<p>Privacy</p>
	// 				<div id="group-privacy-setting">
	// 					<div className="group-radio-one">
	// 						<label htmlFor="private">Private</label>
	// 						<input
	// 							type="radio"
	// 							id="private"
	// 							name="private"
	// 							value={"private"}
	// 							checked={privacy === true}
	// 							onChange={e => setPrivacy(e.target.value)}
	// 						/>
	// 					</div>
	// 					<div className="group-radio-two">
	// 						<label htmlFor="public">Public</label>
	// 						<input
	// 							type="radio"
	// 							id="public"
	// 							name="private"
	// 							value={"public"}
	// 							checked={privacy === false}
	// 							onChange={e => setPrivacy(e.target.value)}
	// 						/>
	// 					</div>
	// 				</div>
	// 				<label htmlFor="group-city">City</label>
	// 				<input
	// 					id="group-city"
	// 					type="text"
	// 					value={city}
	// 					onChange={e => setCity(e.target.value)}
	// 				/>
	// 				<label htmlFor="group-state">State</label>
	// 				<input
	// 					id="group-state"
	// 					type="text"
	// 					value={state}
	// 					onChange={e => setState(e.target.value)}
	// 				/>
	// 				<button type="submit">Submit</button>
	// 			</form>
	// 		</div>
	// 	</div>
	// ) : (
	// 	<h1>loading page...</h1>
	// );
}
