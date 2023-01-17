import "./HomePage.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getUserGroups } from "../../store/groupsReducer";
export default function HomePage({ user }) {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getUserGroups());
	}, [dispatch]);
	const userGroups = useSelector(state => state.groups.userGroups);
	const userGroupKeys = Object.keys(userGroups);
	const groupContent = userGroupKeys.length ? (
		userGroupKeys.map(key => {
			const group = userGroups[key];
			return <h3 key={group.id}>{group.name}</h3>;
		})
	) : (
		<h3>Loading user groups...</h3>
	);
	return (
		<div className="home-page-outer-container">
			<div className="home-page-inner-container">
				<h2>Welcome, {user.firstName + "👋"}</h2>
				<Link to="create-group">Start a new group</Link>
				<div className="user-events-groups">
					<div className="user-groups">
						<h3>Your groups</h3>
						{groupContent}
					</div>
				</div>
			</div>
		</div>
	);
}
