import "./CreateAGroup.css";
import { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { postGroup } from "../../store/groupsReducer";
export default function CreateAGroup() {
	const dispatch = useDispatch();
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [type, setType] = useState("");
	const [privacy, setPrivacy] = useState(false);
	const [city, setCity] = useState("");
	const [state, setState] = useState("");

	const history = useHistory();
	const redirect = () => history.push("/home");

	const handleSubmit = e => {
		e.preventDefault();
		const newGroup = {
			name,
			about,
			type,
			private: privacy,
			city,
			state
		};

		const res = dispatch(postGroup(newGroup));

		redirect();
	};
	return (
		<div id="create-group-outer-container">
			<div id="create-group-inner-container">
				<form id="create-group-form" onSubmit={handleSubmit}>
					<h1>Create a group</h1>
					<label htmlFor="group-name">Name</label>
					<input
						id="group-name"
						type="text"
						onChange={e => setName(e.target.value)}
					/>
					<label htmlFor="group-about">Description</label>
					<textarea
						id="group-about"
						type="text-field"
						onChange={e => setAbout(e.target.value)}
					/>
					<p>Type</p>
					<div id="group-type-setting">
						<div className="group-radio-one">
							<label htmlFor="online">Online</label>
							<input
								type="radio"
								id="online"
								name="type"
								value="Online"
								onChange={e => setType(e.target.value)}
							/>
						</div>
						<div className="group-radio-two">
							<label htmlFor="in-person">In person</label>
							<input
								type="radio"
								id="in-person"
								name="type"
								value="In person"
								onChange={e => setType(e.target.value)}
							/>
						</div>
					</div>
					<p>Privacy</p>
					<div id="group-privacy-setting">
						<div className="group-radio-one">
							<label htmlFor="private">Private</label>
							<input
								type="radio"
								id="private"
								name="private"
								value={true}
								onChange={e => setPrivacy(e.target.value)}
							/>
						</div>
						<div className="group-radio-two">
							<label htmlFor="public">Public</label>
							<input
								type="radio"
								id="public"
								name="private"
								value={false}
								onChange={e => setPrivacy(e.target.value)}
							/>
						</div>
					</div>
					<label htmlFor="group-city">City</label>
					<input
						id="group-city"
						type="text"
						onChange={e => setCity(e.target.value)}
					/>
					<label htmlFor="group-state">State</label>
					<input
						id="group-state"
						type="text"
						onChange={e => setState(e.target.value)}
					/>
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
}
