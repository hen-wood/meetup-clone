import "./SingleGroupPage.css";
import { getSingleGroup, getUserGroups } from "../../store/groupsReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteGroup } from "../../store/groupsReducer";
import GroupEvents from "./GroupEvents";

export default function SingleGroupPage() {
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const history = useHistory();
	const deleteRedirect = () => history.push("/home");
	const editRedirect = () => history.push(`/edit-group/${groupId}`);

	useEffect(() => {
		dispatch(getSingleGroup(groupId)).then().catch();
	}, [dispatch, groupId]);

	const currentGroup = useSelector(state => state.groups.singleGroup);

	const user = useSelector(state => state.session.user);

	const showDeleteButton =
		user && currentGroup && currentGroup.organizerId === user.id;

	const handleDelete = () => {
		dispatch(deleteGroup(groupId))
			.then(() => {
				console.log("just deleted");
				dispatch(getUserGroups())
					.then(() => {
						deleteRedirect();
					})
					.catch(async res => console.log(res));
			})
			.catch(async res => {
				console.log(res);
			});
	};

	const handleEdit = () => {
		editRedirect();
	};

	const organizerOptions = (
		<div id="organizer-options">
			<p>Organizer options</p>
			<button id="delete-group-button" onClick={handleDelete}>
				Delete group
			</button>
			<button id="edit-group-button" onClick={handleEdit}>
				Edit group
			</button>
		</div>
	);
	const content =
		currentGroup && currentGroup.id === +groupId ? (
			<div id="single-group-page-inner-container">
				<div id="single-group-page-info-container">
					<div id="single-page-image-container">
						<img
							id="single-group-page-preview-image"
							src={
								currentGroup.GroupImages.find(image => image.preview === true)
									.url
							}
							alt={currentGroup.name + " preview image"}
						/>
					</div>

					<div id="single-group-page-info-text">
						<div id="single-group-page-info-text-top">
							<h1>{currentGroup.name}</h1>
							<pre>
								<i className="fa-solid fa-location-dot" />
								{`   ${currentGroup.city}, ${currentGroup.state}`}
							</pre>
							<pre>
								<i className="fa-solid fa-users"></i>
								{` ${currentGroup.numMembers} members · ${
									currentGroup.private ? "Private group" : "Public group"
								} · ${currentGroup.type}`}
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
						</div>
						{showDeleteButton && organizerOptions}
					</div>
				</div>
				<div id="single-group-about-container">
					<h2 id="single-group-about-title">What we're about</h2>
					<p id="single-group-about-text">{currentGroup.about}</p>
				</div>
				<div>
					<h2>Events for {currentGroup.name}</h2>
					<GroupEvents groupId={currentGroup.id} />
				</div>
			</div>
		) : (
			<h1>Loading group data...</h1>
		);
	return <div id="single-group-page-container">{content}</div>;
}
