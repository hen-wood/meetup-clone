import "./SingleGroupPage.css";
import {
	thunkGetSingleGroup,
	thunkGetUserGroups,
	thunkGetGroupMemberships,
	thunkPostGroupImage
} from "../../store/groupsReducer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, NavLink } from "react-router-dom";
import { thunkDeleteGroup } from "../../store/groupsReducer";
import GroupEvents from "./GroupEvents";

export default function SingleGroupPage() {
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const history = useHistory();
	const [isLoaded, setIsLoaded] = useState(false);
	const [image, setImage] = useState(null);
	const deleteRedirect = () => history.push("/home");
	const editRedirect = () => history.push(`/edit-group/${groupId}`);
	const createEventRedirect = () =>
		history.push(`/groups/${groupId}/create-event`);

	useEffect(() => {
		dispatch(thunkGetSingleGroup(groupId)).then(async res => {
			const data = await res;
			console.log(data);
			dispatch(thunkGetGroupMemberships(data.id)).then(() => {
				setIsLoaded(true);
			});
		});
	}, [dispatch]);

	const currentGroup = useSelector(state => state.groups.singleGroup);
	const preview = currentGroup.GroupImages?.find(
		img => img.preview === true
	).url;
	const user = useSelector(state => state.session.user);

	const members = useSelector(state => state.groups.groupMembers);

	const membersArr = Object.values(members);

	const userMembership =
		user &&
		membersArr.find(member => {
			return member.id === user.id;
		});

	const isCohost =
		userMembership && userMembership.Membership.status === "co-host";

	const showOrgOptions =
		user && currentGroup && currentGroup.organizerId === user.id;

	const showCohostOptions = user && isCohost && !showOrgOptions;

	const handleDelete = () => {
		dispatch(thunkDeleteGroup(groupId))
			.then(() => {
				dispatch(thunkGetUserGroups())
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

	const handleCreateEvent = () => {
		createEventRedirect();
	};

	const handleUploadImage = e => {
		e.preventDefault();
		dispatch(thunkPostGroupImage({ image, groupId, preview: false })).then(
			() => {
				dispatch(thunkGetSingleGroup(groupId)).then(() => {
					console.log("success");
				});
			}
		);
	};

	const updateFile = e => {
		const file = e.target.files[0];
		if (file) setImage(file);
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
			<button id="add-group-event-button" onClick={handleCreateEvent}>
				Add event
			</button>
			<form onSubmit={handleUploadImage}>
				<label htmlFor="image-upload-field">Upload new group pic</label>
				<input id="image-upload-field" type="file" onChange={updateFile} />
				<button id="add-group-image" type="submit">
					Add pic
				</button>
			</form>
		</div>
	);

	const cohostOptions = (
		<div id="organizer-options">
			<p>Co-host options</p>
			<button id="add-group-event-button" onClick={handleCreateEvent}>
				Add event
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
							src={preview}
							alt={currentGroup.name}
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
						{showOrgOptions && organizerOptions}
						{showCohostOptions && cohostOptions}
						<div id="group-title-and-nav-link">
							<NavLink to="/all-groups">See all groups</NavLink>
						</div>
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
				<div id="group-images">
					{currentGroup.GroupImages.map(img => {
						return (
							<img
								id="group-img-indiv"
								key={img.id}
								src={img.url}
								alt={currentGroup.name}
							/>
						);
					})}
				</div>
			</div>
		) : (
			<h1>No group data 😭...</h1>
		);
	return isLoaded ? (
		<div id="single-group-page-container">{content}</div>
	) : (
		<div id="single-group-page-container">
			<h1>Loading group...</h1>
		</div>
	);
}
