import "./SingleGroupPage.css";
import { getSingleGroup } from "../../store/groupsReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteGroup } from "../../store/groupsReducer";

export default function SingleGroupPage() {
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const history = useHistory();
	const deleteRedirect = () => history.push("/home");
	const editRedirect = () => history.push(`/edit-group/${groupId}`);
	useEffect(() => {
		dispatch(getSingleGroup(groupId));
	}, [dispatch, groupId]);

	const currentGroup = useSelector(state => state.groups.singleGroup);

	const user = useSelector(state => state.session.user);

	const showDeleteButton =
		user && currentGroup && currentGroup.organizerId === user.id;

	const handleDelete = () => {
		dispatch(deleteGroup(groupId))
			.then(res => {
				deleteRedirect();
			})
			.catch(err => {
				console.log(err);
			});
	};

	const handleEdit = () => {
		editRedirect();
	};

	const organizerOptions = (
		<div id="organizer-options">
			<button id="delete-group-button" onClick={handleDelete}>
				Delete this group
			</button>
			<button id="edit-group-button" onClick={handleEdit}>
				Edit this group
			</button>
		</div>
	);
	const content = currentGroup ? (
		<div id="single-group-page-info-container">
			<img
				id="single-group-page-preview-image"
				src={currentGroup.GroupImages.find(image => image.preview === true).url}
				alt={currentGroup.name + " preview image"}
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
						currentGroup.private ? "Private group" : "Public group"
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
				{showDeleteButton && organizerOptions}
			</div>
			<p>
				{currentGroup.about}
				<b>{currentGroup.type}</b>
			</p>
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
