import "./SingleGroupPage.css";
import { getSingleGroup } from "../../store/groupsReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteGroup } from "../../store/groupsReducer";

export default function SingleGroupPage() {
	const history = useHistory();
	const deleteRedirect = () => history.push("/home");
	const dispatch = useDispatch();
	const { groupId } = useParams();
	useEffect(() => {
		dispatch(getSingleGroup(groupId));
	}, [dispatch, groupId]);

	const currentGroup = useSelector(state => state.groups.singleGroup);

	const user = useSelector(state => state.session.user);

	const preview = useSelector(
		state => state.groups.allGroups[groupId].previewImage
	);
	const showDeleteButton =
		user && currentGroup && currentGroup.organizerId === user.id;

	const handleDelete = () => {
		dispatch(deleteGroup(groupId));
		deleteRedirect();
	};
	const deleteButton = (
		<button id="delete-group-button" onClick={handleDelete}>
			Delete This Group
		</button>
	);
	const content =
		currentGroup && currentGroup.id === +groupId ? (
			<div id="single-group-page-info-container">
				<img
					id="single-group-page-preview-image"
					src={preview && preview}
					alt={groupId.name + " preview image"}
				/>

				<div id="single-group-page-info-text">
					<h1>{currentGroup.name}</h1>
					<pre>
						<i className="fa-solid fa-location-dot" />
						{`   ${currentGroup.city}, ${currentGroup.state}`}
					</pre>
					<pre>
						<i className="fa-solid fa-users"></i>
						{` ${currentGroup.numMembers} members · ${
							groupId.private ? "Private group" : "Public group"
						}`}
					</pre>
					<pre>
						<i className="fa-solid fa-user"></i>
						{"   "}Organized by{" "}
						<b>
							{currentGroup.Organizer.firstName +
								" " +
								currentGroup.Organizer.lastName}
						</b>{" "}
					</pre>
					{showDeleteButton && deleteButton}
				</div>
			</div>
		) : (
			<h1>Loading group data...</h1>
		);
	return (
		<div id="single-group-page-container">
			<div id="single-group-page-inner-container">{content}</div>
		</div>
	);
}
