import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { formatJoinDate } from "./formatJoinDate";
import { thunkUpgradeToCohost } from "../../store/groupsReducer";
import { useParams } from "react-router-dom";

export default function GroupMembers({
	isPrivate,
	members,
	organizer,
	status
}) {
	const dispatch = useDispatch();
	const { groupId } = useParams();

	const allMembers = Object.values(members);
	const leadershipTeam = allMembers.filter(
		member => member.Membership.status === "co-host"
	);
	const currentMembers = allMembers.filter(
		member => member.Membership.status !== "pending"
	);
	const pendingMembers = allMembers.filter(
		member => member.Membership.status === "pending"
	);
	const [memberType, setMemberType] = useState("All members");
	const [searchTerm, setSearchTerm] = useState("");
	const [memberList, setMemberList] = useState(allMembers);

	useEffect(() => {
		setMemberList(
			allMembers.filter(member => {
				return (
					member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
				);
			})
		);
	}, [searchTerm]);

	useEffect(() => {
		if (memberType === "All members") {
			setMemberList(currentMembers);
		} else if (memberType === "Leadership team") {
			setMemberList(leadershipTeam);
		} else {
			setMemberList(pendingMembers);
		}
	}, [memberType]);

	const upgradeToCohost = member => {
		dispatch(thunkUpgradeToCohost(member, groupId)).then(() => {
			setMemberList();
		});
	};
	const upgradeToMember = member => {};

	return (
		<div className="group-events__container">
			<div className="switch-box">
				<button
					className={
						memberType === "All members"
							? "switch-box__tab switch-box__tab--selected"
							: "switch-box__tab"
					}
					onClick={() => setMemberType("All members")}
				>
					<p className="switch-box__text">All members</p>
					<p className="switch-box__text">{currentMembers.length}</p>
				</button>
				<button
					className={
						memberType === "Leadership team"
							? "switch-box__tab switch-box__tab--selected"
							: "switch-box__tab"
					}
					onClick={() => setMemberType("Leadership team")}
				>
					<p className="switch-box__text">Leadership team</p>
					<p className="switch-box__text">{leadershipTeam.length}</p>
				</button>
				{(status === "organizer" || status === "co-host") && (
					<button
						className={
							memberType === "Pending members"
								? "switch-box__tab switch-box__tab--selected"
								: "switch-box__tab"
						}
						onClick={() => setMemberType("Pending members")}
					>
						<p className="switch-box__text">Pending members</p>
						<p className="switch-box__text">{pendingMembers.length}</p>
					</button>
				)}
			</div>
			{isPrivate && (status === "" || status === "pending") ? (
				<div className="about-members__list--private">
					<i className="fa-solid fa-lock private-icon"></i>
					<h2 className="ab-members-private__warning">
						This content is available only to members
					</h2>
				</div>
			) : (
				<div className="gr-members__right">
					<div className="gr-members__right__top">
						<h3 className="gr-members__title">{memberType}</h3>
					</div>
					{memberType === "All members" && (
						<div className="gr-members__search">
							<i className="fa-solid fa-magnifying-glass member-search-icon"></i>
							<input
								className="gr-members__search__input"
								type="text"
								placeholder="Seach members"
								onChange={e => {
									setSearchTerm(e.target.value);
								}}
							/>
						</div>
					)}
					<div className="gr-members__list">
						{memberList.map((member, i) => (
							<div key={i} className="member-card">
								<div className="member-card__left">
									<img
										className="profile-image--med"
										src={member.profileImageUrl}
										alt={member.firstName + " " + member.lastName}
									/>
									<div className="member-card__text-container">
										<p className="member-card__name">
											{member.firstName} {member.lastName}
										</p>
										{member.id === organizer.id ? (
											<p className="member-card__leader-text">Organizer</p>
										) : member.Membership.status === "co-host" ? (
											<p className="member-card__leader-text">Co-organizer</p>
										) : (
											<></>
										)}
										<p className="member-card__join-date">
											Joined {formatJoinDate(member.Membership.createdAt)}
										</p>
									</div>
								</div>
								{member.id !== organizer.id &&
									(status === "organizer" || status === "co-host") && (
										<div className="member-card-leader-options">
											<button>Remove member</button>
											{status === "organizer" &&
												member.Membership.status === "member" && (
													<button onClick={() => upgradeToCohost(member)}>
														Make {member.firstName} a co-organizer
													</button>
												)}
											{(status === "co-host" || status === "organizer") &&
												member.Membership.status === "pending" && (
													<button>
														Approve {member.firstName}'s membership request
													</button>
												)}
										</div>
									)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
