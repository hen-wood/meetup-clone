import "./SingleGroupPage.css";
import {
	thunkGetSingleGroup,
	thunkGetUserGroups,
	thunkGetGroupMemberships,
	actionResetSingleGroup,
	thunkDeleteMember,
	thunkAddMembership
} from "../../store/groupsReducer";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	useHistory,
	useParams,
	NavLink,
	Switch,
	Route
} from "react-router-dom";
import { thunkDeleteGroup } from "../../store/groupsReducer";
import GroupEvents from "./GroupEvents";
import {
	thunkDeletePendingMembership,
	thunkRequestMembership
} from "../../store/membershipsReducer";
import { GroupNavbar } from "./GroupNavbar";
import { GroupAbout } from "./GroupAbout";

// export default function SingleGroupPage() {
// 	const dispatch = useDispatch();
// 	const { groupId } = useParams();
// 	const history = useHistory();
// 	const [isLoaded, setIsLoaded] = useState(false);
// 	const [status, setStatus] = useState("");

// 	const deleteRedirect = () => history.push("/home");
// 	const editRedirect = () => history.push(`/edit-group/${groupId}`);
// 	const createEventRedirect = () =>
// 		history.push(`/groups/${groupId}/create-event`);

// 	useEffect(() => {
// 		dispatch(thunkGetSingleGroup(groupId)).then(async res => {
// 			const data = await res;
// 			dispatch(thunkGetGroupMemberships(data.id)).then(() => {
// 				setIsLoaded(true);
// 			});
// 		});

// 		return () => {
// 			dispatch(actionResetSingleGroup());
// 		};
// 	}, [dispatch]);

// 	const user = useSelector(state => state.session.user);
// 	const currentGroup = useSelector(state => state.groups.singleGroup);
// 	const members = useSelector(state => state.groups.groupMembers);
// 	const usersPendingMemberships = useSelector(
// 		state => state.memberships.pending
// 	);

// 	const preview = currentGroup.GroupImages?.find(
// 		img => img.preview === true
// 	).url;

// 	useEffect(() => {
// 		if (user && currentGroup.Organizer && members) {
// 			if (currentGroup.Organizer.id === user.id) {
// 				setStatus("organizer");
// 			} else if (members[user.id]) {
// 				setStatus(members[user.id].Membership.status);
// 			} else if (usersPendingMemberships[groupId]) {
// 				setStatus("pending");
// 			}
// 		}
// 	}, [user, usersPendingMemberships, members, currentGroup]);

// 	const handleDelete = () => {
// 		dispatch(thunkDeleteGroup(groupId))
// 			.then(() => {
// 				dispatch(thunkGetUserGroups())
// 					.then(() => {
// 						deleteRedirect();
// 					})
// 					.catch(async res => console.log(res));
// 			})
// 			.catch(async res => {
// 				console.log(res);
// 			});
// 	};

// 	const handleEdit = () => {
// 		editRedirect();
// 	};

// 	const handleCreateEvent = () => {
// 		createEventRedirect();
// 	};

// 	const handleRequestMembership = async () => {
// 		if (currentGroup.private) {
// 			dispatch(thunkRequestMembership(groupId));
// 		} else {
// 			dispatch(thunkAddMembership(user, groupId));
// 		}
// 	};

// 	const handleDeletePendingMembership = async () => {
// 		dispatch(thunkDeletePendingMembership(groupId, user.id)).then(() => {
// 			setStatus("");
// 		});
// 	};

// 	const handleDeleteMembership = async () => {
// 		dispatch(thunkDeleteMember(groupId, user.id))
// 			.catch(async e => {
// 				const err = await e.json();
// 				console.log(err);
// 			})
// 			.then(() => {
// 				setStatus("");
// 			});
// 	};

// 	const organizerOptions = (
// 		<div id="organizer-options">
// 			<p>Organizer options</p>
// 			<button className="group-event-option-button" onClick={handleDelete}>
// 				Delete group
// 			</button>
// 			<button className="group-event-option-button" onClick={handleEdit}>
// 				Edit group
// 			</button>
// 			<button className="group-event-option-button" onClick={handleCreateEvent}>
// 				Add event
// 			</button>
// 		</div>
// 	);

// 	const cohostOptions = (
// 		<div id="organizer-options">
// 			<p>Co-host options</p>
// 			<button className="group-event-option-button" onClick={handleCreateEvent}>
// 				Add event
// 			</button>
// 			<button
// 				className="group-event-option-button"
// 				onClick={handleDeleteMembership}
// 			>
// 				Leave group
// 			</button>
// 		</div>
// 	);

// 	const pendingOptions = (
// 		<div id="organizer-options">
// 			<p>Your membership is pending</p>
// 			<button
// 				className="group-event-option-button"
// 				onClick={handleDeletePendingMembership}
// 			>
// 				Delete membership request
// 			</button>
// 		</div>
// 	);

// 	const joinOptions = (
// 		<div id="organizer-options">
// 			<p>You are not a member of this group</p>
// 			<button
// 				className="group-event-option-button"
// 				onClick={handleRequestMembership}
// 			>
// 				Join this group
// 			</button>
// 		</div>
// 	);

// 	const memberOptions = (
// 		<div id="organizer-options">
// 			<p>You are a member of this group</p>
// 			<button
// 				className="group-event-option-button"
// 				onClick={handleDeleteMembership}
// 			>
// 				Leave group
// 			</button>
// 		</div>
// 	);

// 	const content =
// 		currentGroup && currentGroup.id === +groupId ? (
// 			<div id="single-group-page-inner-container">
// 				<div id="single-group-page-info-container">
// 					<div id="single-page-image-container">
// 						<img
// 							id="single-group-page-preview-image"
// 							src={preview}
// 							alt={currentGroup.name}
// 						/>
// 					</div>

// 					<div id="single-group-page-info-text">
// 						<div id="single-group-page-info-text-top">
// 							<h1>{currentGroup.name}</h1>
// 							<pre>
// 								<i className="fa-solid fa-location-dot" />
// 								{`   ${currentGroup.city}, ${currentGroup.state}`}
// 							</pre>
// 							<pre>
// 								<i className="fa-solid fa-users"></i>
// 								{` ${currentGroup.numMembers} members · ${
// 									currentGroup.private ? "Private group" : "Public group"
// 								} · ${currentGroup.type}`}
// 							</pre>
// 							<pre>
// 								<i className="fa-solid fa-user"></i>
// 								{"   "}Organized by{" "}
// 								<b>
// 									{currentGroup.Organizer.firstName +
// 										" " +
// 										currentGroup.Organizer.lastName}
// 								</b>{" "}
// 							</pre>
// 						</div>
// 						{status === "organizer"
// 							? organizerOptions
// 							: status === "co-host"
// 							? cohostOptions
// 							: status === "pending"
// 							? pendingOptions
// 							: status === "member"
// 							? memberOptions
// 							: joinOptions}
// 						<div id="group-title-and-nav-link">
// 							<NavLink to="/all-groups">See all groups</NavLink>
// 						</div>
// 					</div>
// 				</div>
// 				<div id="single-group-about-container">
// 					<h2 id="single-group-about-title">What we're about</h2>
// 					<p id="single-group-about-text">{currentGroup.about}</p>
// 				</div>
// 				<div>
// 					<h2>Events for {currentGroup.name}</h2>
// 					<GroupEvents groupId={currentGroup.id} />
// 				</div>
// 			</div>
// 		) : (
// 			<h1>No group data 😭...</h1>
// 		);
// 	return isLoaded ? (
// 		<div id="single-group-page-container">{content}</div>
// 	) : (
// 		<div id="single-group-page-container">
// 			<h1>Loading group...</h1>
// 		</div>
// 	);
// }

export default function SingleGroupPage() {
	const dispatch = useDispatch();
	const history = useHistory();
	const { groupId } = useParams();
	const [isLoaded, setIsLoaded] = useState(false);
	const [currTab, setCurrTab] = useState("About");
	const [status, setStatus] = useState("");
	const [showMenu, setShowMenu] = useState(false);

	const menuRef = useRef(null);

	const user = useSelector(state => state.session.user);
	const usersPendingMemberships = useSelector(
		state => state.memberships.pending
	);
	const group = useSelector(state => state.groups.singleGroup);
	const members = useSelector(state => state.groups.groupMembers);

	const preview = group.GroupImages?.find(img => img.preview === true).url;

	useEffect(() => {
		dispatch(thunkGetSingleGroup(groupId)).then(async res => {
			const data = await res;
			dispatch(thunkGetGroupMemberships(data.id)).then(() => {
				setIsLoaded(true);
			});
		});
		return () => {
			dispatch(actionResetSingleGroup());
		};
	}, [dispatch]);

	useEffect(() => {
		if (user && group.Organizer && members) {
			if (group.Organizer.id === user.id) {
				setStatus("organizer");
			} else if (members[user.id]) {
				setStatus(members[user.id].Membership.status);
			} else if (usersPendingMemberships[groupId]) {
				setStatus("pending");
			}
		}
	}, [user, usersPendingMemberships, members, group]);

	return isLoaded ? (
		<div className="main-container">
			<div className="group-page-container">
				<div className="group-page__top">
					<img
						className="group-page__preview-image"
						src={preview}
						alt={group.name}
					/>
					<div className="group-page__info">
						<h1 className="group-page__name">{group.name}</h1>
						<div className="group-page__stats-container">
							<div className="group-page__stat">
								<i className="fa-solid fa-location-dot group-page__stat__icon"></i>
								<p className="group-page__stat__text">
									{group.city}, {group.state}
								</p>
							</div>
							<div className="group-page__stat">
								<i className="fa-solid fa-users group-page__stat__icon"></i>
								<p className="group-page__stat__text">
									{group.numMembers} members ·{" "}
									{group.private ? "Private" : "Public"} group
								</p>
							</div>
							<div className="group-page__stat">
								<i className="fa-solid fa-user group-page__stat__icon"></i>
								<p className="group-page__stat__text">
									Organized by <strong>{group.Organizer.firstName}</strong>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<GroupNavbar
				currTab={currTab}
				setCurrTab={setCurrTab}
				status={status}
				setStatus={setStatus}
			/>
			<div className="group-page-content">
				<div className="group-page-content__inner">
					{currTab === "About" ? (
						<GroupAbout group={group} />
					) : (
						<h1>nothing</h1>
					)}
				</div>
			</div>
		</div>
	) : (
		<div className="main-container">
			<div className="group-page-container">
				<h1>Loading group...</h1>
			</div>
		</div>
	);
}
