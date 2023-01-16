import "./Groups.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../store/groupsReducer";
import { useEffect } from "react";

export default function Groups() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllGroups());
	}, [dispatch]);

	const groupsObj = useSelector(state => state.groups.allGroups);
	const groupKeys = Object.keys(groupsObj);

	const content = groupKeys.length ? (
		groupKeys.map(key => {
			const group = groupsObj[key];
			const privacy = group.private ? "Private" : "Public";
			return (
				<div key={group.id} className="individual-group-container">
					<div className="group-preview-image-container">
						<img
							src={
								group.previewImage
									? group.previewImage
									: "https://i.imgur.com/NO25iZV.png"
							}
							alt={group.name + " preview image"}
						/>
					</div>
					<div className="group-text-content-container">
						<div>
							<h3 className="group-text-title">{group.name}</h3>
							<h3 className="group-text-city-state">
								{`${group.city}, ${group.state}`.toUpperCase()}
							</h3>
						</div>
						<p className="group-text-about">{group.about}</p>
						<div className="member-count-privacy-status">
							<p>{group.numMembers + " members · " + privacy}</p>
							<i className="fa-solid fa-arrow-up-from-bracket" />
						</div>
					</div>
				</div>
			);
		})
	) : (
		<h3>Loading groups...</h3>
	);

	return <div id="group-event-list-container">{content}</div>;
}
