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

export default function MemberOptions({ status, setStatus }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const { groupId } = useParams();

	const [showMenu, setShowMenu] = useState(false);
	const user = useSelector(state => state.session.user);
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
			dispatch(thunkRequestMembership(groupId))
				.then(() => setShowMenu(false))
				.catch(async res => {
					const err = await res.json();
					console.log(err);
				});
		} else {
			dispatch(thunkAddMembership(user, groupId)).then(() =>
				setShowMenu(false)
			);
		}
	};

	const handleDeletePendingMembership = async () => {
		dispatch(thunkDeletePendingMembership(groupId, user.id)).then(() => {
			setStatus("");
			setShowMenu(false);
		});
	};

	const handleDeleteMembership = async () => {
		dispatch(thunkDeleteMember(groupId, user.id))
			.then(() => {
				setStatus("");
				setShowMenu(false);
			})
			.catch(async e => {
				const err = await e.json();
				console.log(err);
			});
	};

	const organizerOptions = (
		<div className="member-options__menu__inner">
			<button className="member-options__menu__button" onClick={handleDelete}>
				Delete group
			</button>
			<button className="member-options__menu__button" onClick={handleEdit}>
				Edit group
			</button>
			<button
				className="member-options__menu__button"
				onClick={handleCreateEvent}
			>
				Add event
			</button>
		</div>
	);

	const cohostOptions = (
		<div className="member-options__menu__inner">
			<button
				className="member-options__menu__button"
				onClick={handleCreateEvent}
			>
				Add event
			</button>
			<button
				className="member-options__menu__button"
				onClick={handleDeleteMembership}
			>
				Leave group
			</button>
		</div>
	);

	const pendingOptions = (
		<div className="member-options__menu__inner">
			<button
				className="member-options__menu__button"
				onClick={handleDeletePendingMembership}
			>
				Delete membership request
			</button>
		</div>
	);

	const memberOptions = (
		<div className="member-options__menu__inner">
			<button
				className="member-options__menu__button"
				onClick={handleDeleteMembership}
			>
				Leave group
			</button>
		</div>
	);

	return status === "" && user ? (
		<button className="join-group-button" onClick={handleRequestMembership}>
			Join this group
		</button>
	) : (
		user && (
			<button
				className="member-options__button"
				onClick={() => setShowMenu(true)}
			>
				{status === "organizer" ? (
					<p>You're the organizer</p>
				) : status === "co-host" ? (
					<p>You're a co-host</p>
				) : status === "pending" ? (
					<p>Membership pending</p>
				) : (
					<p>You're a member</p>
				)}
				<i className="fa-solid fa-chevron-down member-options__chev"></i>
				{showMenu && (
					<div className="member-options__dropdown" ref={menuRef}>
						{status === "organizer"
							? organizerOptions
							: status === "co-host"
							? cohostOptions
							: status === "pending"
							? pendingOptions
							: memberOptions}
					</div>
				)}
			</button>
		)
	);
}
