import "./HomePage.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useEffect } from "react";
import { getGroupMemberships, getUserGroups } from "../../store/groupsReducer";
export default function HomePage({ user }) {
	const history = useHistory();
	const redirectSingleGroup = groupId => history.push(`/groups/${groupId}`);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getUserGroups()).then(async res => await res);
	}, [dispatch]);

	const handleGroupClick = groupId => {
		redirectSingleGroup(groupId);
	};

	const userGroups = useSelector(state => state.groups.userGroups);
	const userGroupKeys = Object.keys(userGroups);
	const groupContent = userGroupKeys.length ? (
		userGroupKeys.map(key => {
			const group = userGroups[key];

			return (
				<div
					key={group.id}
					className="individual-user-group-container"
					onClick={() => handleGroupClick(group.id)}
				>
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
							{group.organizerId === user.id ? (
								<p className="user-status-tag">Organizer</p>
							) : (
								<p className="user-status-tag">Member</p>
							)}
						</div>
					</div>
				</div>
			);
		})
	) : (
		<h3>Loading user groups...</h3>
	);
	return user ? (
		<div className="home-page-outer-container">
			<div className="home-page-inner-container">
				<div id="user-nav">
					<div id="user-nav-top">
						<div id="user-nav-welcome">
							<h2>Welcome, {user.firstName + "👋"}</h2>
						</div>
						<div id="user-links">
							<Link className="user-link" to="create-group">
								Start a new group
							</Link>
							<Link className="user-link" to="/all-groups">
								See all groups
							</Link>
							<Link className="user-link" to="/all-events">
								See all events
							</Link>
						</div>
					</div>
					<h3>Your groups</h3>
				</div>
				<div className="user-content">
					<div className="user-groups">{groupContent}</div>
				</div>
			</div>
		</div>
	) : (
		<h1>Loading home..</h1>
	);
}
