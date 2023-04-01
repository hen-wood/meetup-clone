import "./SingleGroupPage.css";
import {
	thunkGetSingleGroup,
	thunkGetGroupMemberships,
	actionResetSingleGroup
} from "../../store/groupsReducer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetAllGroupEvents } from "../../store/eventsReducer";
import GroupNavbar from "./GroupNavbar";
import GroupAbout from "./GroupAbout";
import GroupEvents from "./GroupEvents";
import { thunkGetPendingMemberships } from "../../store/membershipsReducer";
import GroupMembers from "./GroupMembers";
import GroupPhotos from "./GroupPhotos";

export default function SingleGroupPage() {
	const navBar = document.querySelector(".navigation");
	navBar.className = "navigation splash-exit";
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const [isLoaded, setIsLoaded] = useState(false);
	const [currTab, setCurrTab] = useState("About");
	const [status, setStatus] = useState("");

	const user = useSelector(state => state.session.user);
	const usersPendingMemberships = useSelector(
		state => state.memberships.pending
	);
	const group = useSelector(state => state.groups.singleGroup);
	const members = useSelector(state => state.groups.groupMembers);
	const events = useSelector(state => state.events.allGroupEvents);

	const preview = group.GroupImages?.find(img => img.preview === true).url;

	useEffect(() => {
		setIsLoaded(false);
		dispatch(thunkGetSingleGroup(groupId)).then(() => {
			dispatch(thunkGetAllGroupEvents(groupId)).then(() => {
				if (user) {
					dispatch(thunkGetGroupMemberships(groupId)).then(() => {
						dispatch(thunkGetPendingMemberships()).then(() => {
							setIsLoaded(true);
						});
					});
				} else {
					setIsLoaded(true);
				}
			});
		});
		return () => {
			dispatch(actionResetSingleGroup());
		};
	}, [dispatch, user]);

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
				user={user}
			/>
			<div className="group-page-content">
				<div className="group-page-content__inner">
					{currTab === "About" ? (
						<GroupAbout
							group={group}
							events={events}
							members={members}
							status={status}
							organizer={group.Organizer}
						/>
					) : currTab === "Events" ? (
						<GroupEvents
							events={events}
							status={status}
							isPrivate={group.private}
						/>
					) : currTab === "Members" ? (
						<GroupMembers
							members={members}
							status={status}
							isPrivate={group.private}
							organizer={group.Organizer}
						/>
					) : (
						<GroupPhotos
							group={group}
							events={Object.values(events)}
							status={status}
							isPrivate={group.private}
						/>
					)}
				</div>
			</div>
		</div>
	) : (
		<div className="main-container">
			<div className="group-page-container">
				<div className="gr-loading__container">
					<h1 className="loading-text">Loading group...</h1>
				</div>
			</div>
		</div>
	);
}
