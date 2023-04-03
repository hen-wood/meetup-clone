import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import WarningModal from "../WarningModal";
import {
	thunkDeleteMember,
	thunkUpgradeToCohost,
	thunkUpgradeToMember
} from "../../store/groupsReducer";
import { useParams } from "react-router-dom";
import { formatJoinDate } from "./formatJoinDate";

export default function GroupMembers({
	isPrivate,
	members,
	organizer,
	status
}) {
	const dispatch = useDispatch();
	const { groupId } = useParams();

	const [memberType, setMemberType] = useState("All members");
	const [searchTerm, setSearchTerm] = useState("");
	const [memberList, setMemberList] = useState(Object.values(members));

	useEffect(() => {
		setMemberList(
			Object.values(members).filter(member => {
				return (
					member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
				);
			})
		);
	}, [searchTerm]);

	useEffect(() => {
		if (memberType === "All members") {
			setMemberList(
				Object.values(members).filter(
					member => member.Membership.status !== "pending"
				)
			);
		} else if (memberType === "Leadership team") {
			setMemberList(
				Object.values(members).filter(
					member => member.Membership.status === "co-host"
				)
			);
		} else {
			setMemberList(
				Object.values(members).filter(
					member => member.Membership.status === "pending"
				)
			);
		}
	}, [memberType]);

	const upgradeToCohost = member => {
		dispatch(thunkUpgradeToCohost(member, groupId)).then(() => {
			setMemberList(prev =>
				prev.map(m => {
					if (m.id === member.id) {
						m.Membership.status = "co-host";
					}
					return m;
				})
			);
		});
	};

	const upgradeToMember = member => {
		dispatch(thunkUpgradeToMember(member, groupId)).then(() => {
			setMemberList(prev =>
				prev.map(m => {
					if (m.id === member.id) {
						m.Membership.status = "member";
					}
					return m;
				})
			);
		});
	};

	const deleteMember = member => {
		dispatch(thunkDeleteMember(groupId, member.id)).then(() => {
			setMemberList(prev => prev.filter(m => m.id !== member.id));
		});
	};

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
					<p className="switch-box__text">
						{
							Object.values(members).filter(
								member => member.Membership.status !== "pending"
							).length
						}
					</p>
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
					<p className="switch-box__text">
						{
							Object.values(members).filter(
								member => member.Membership.status === "co-host"
							).length
						}
					</p>
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
						<p className="switch-box__text">
							{
								Object.values(members).filter(
									member => member.Membership.status === "pending"
								).length
							}
						</p>
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
											{status === "organizer" && (
												<OpenModalMenuItem
													itemText="Remove member"
													className={"leader-option-button"}
													modalComponent={
														<WarningModal
															callBack={deleteMember}
															arg={member}
															message={`Are you sure you want to remove ${member.firstName}?`}
															confirmMessage={"Remove member"}
														/>
													}
												/>
											)}
											{status === "organizer" &&
												member.Membership.status === "member" && (
													<button
														className="leader-option-button"
														onClick={() => upgradeToCohost(member)}
													>
														Make {member.firstName} a co-organizer
													</button>
												)}
											{(status === "co-host" || status === "organizer") &&
												member.Membership.status === "pending" && (
													<button
														className="leader-option-button"
														onClick={() => upgradeToMember(member)}
													>
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
