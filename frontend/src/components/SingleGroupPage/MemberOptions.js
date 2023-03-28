import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import {
	thunkAddMembership,
	thunkDeleteGroup,
	thunkGetUserGroups,
	thunkDeleteMember
} from "../../store/groupsReducer";
import {
	thunkDeletePendingMembership,
	thunkRequestMembership
} from "../../store/membershipsReducer";

export function MemberOptions({ status, setStatus }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const { groupId } = useParams();

	const [showMenu, setShowMenu] = useState(false);
	const user = useSelector(state => state.session.user);
	const usersPendingMemberships = useSelector(
		state => state.memberships.pending
	);
	const group = useSelector(state => state.groups.singleGroup);

	const menuRef = useRef(null);
	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = e => {
			if (!menuRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener("click", closeMenu);

		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);

	const deleteRedirect = () => history.push("/home");
	const editRedirect = () => history.push(`/edit-group/${groupId}`);
	const createEventRedirect = () =>
		history.push(`/groups/${groupId}/create-event`);

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

	const handleRequestMembership = async () => {
		if (group.private) {
			dispatch(thunkRequestMembership(groupId));
		} else {
			dispatch(thunkAddMembership(user, groupId));
		}
	};

	const handleDeletePendingMembership = async () => {
		dispatch(thunkDeletePendingMembership(groupId, user.id)).then(() => {
			setStatus("");
		});
	};

	const handleDeleteMembership = async () => {
		dispatch(thunkDeleteMember(groupId, user.id))
			.catch(async e => {
				const err = await e.json();
				console.log(err);
			})
			.then(() => {
				setStatus("");
			});
	};

	const organizerOptions = (
		<div id="organizer-options">
			<p>Organizer options</p>
			<button className="group-event-option-button" onClick={handleDelete}>
				Delete group
			</button>
			<button className="group-event-option-button" onClick={handleEdit}>
				Edit group
			</button>
			<button className="group-event-option-button" onClick={handleCreateEvent}>
				Add event
			</button>
		</div>
	);

	const cohostOptions = (
		<div id="organizer-options">
			<p>Co-host options</p>
			<button className="group-event-option-button" onClick={handleCreateEvent}>
				Add event
			</button>
			<button
				className="group-event-option-button"
				onClick={handleDeleteMembership}
			>
				Leave group
			</button>
		</div>
	);

	const pendingOptions = (
		<div id="organizer-options">
			<p>Your membership is pending</p>
			<button
				className="group-event-option-button"
				onClick={handleDeletePendingMembership}
			>
				Delete membership request
			</button>
		</div>
	);

	const memberOptions = (
		<div id="organizer-options">
			<p>You are a member of this group</p>
			<button
				className="group-event-option-button"
				onClick={handleDeleteMembership}
			>
				Leave group
			</button>
		</div>
	);

	const joinOptions = (
		<div id="organizer-options">
			<p>You are not a member of this group</p>
			<button
				className="group-event-option-button"
				onClick={handleRequestMembership}
			>
				Join this group
			</button>
		</div>
	);

	return (
		<div className="member-option__button" onClick={() => setShowMenu(true)}>
			{status === "organizer" ? (
				<p>You organized this group</p>
			) : status === "co-host" ? (
				<p>You are a co-host of this group</p>
			) : status === "pending" ? (
				<p>Your membership is pending</p>
			) : status === "member" ? (
				<p>Member options</p>
			) : (
				<p>Join this group</p>
			)}
			{showMenu && (
				<div className="member-option__dropdown" ref={menuRef}>
					{status === "organizer"
						? organizerOptions
						: status === "co-host"
						? cohostOptions
						: status === "pending"
						? pendingOptions
						: status === "member"
						? memberOptions
						: joinOptions}
				</div>
			)}
		</div>
	);
}
