import { useSelector } from "react-redux";

export default function AboutMembers({
	members,
	organizer,
	isPrivate,
	group,
	status
}) {
	const membersArr = Object.values(members);
	const user = useSelector(state => state.session.user);
	return (
		<div className="about-members">
			<div className="about-members__organizer">
				<h2 className="about-members__list__title">Organizer</h2>
				<div className="about-members__organizer__info">
					<img
						src={organizer.profileImageUrl}
						alt={organizer.firstName + " " + organizer.lastName}
						className="profile-image--small"
					/>
					<p className="about-members__organizer__name">
						{organizer.firstName} {organizer.lastName}
					</p>
				</div>
			</div>
			{isPrivate && status === "" ? (
				<div className="about-members__list">
					<h2 className="about-members__list__title">
						Members ({group.numMembers})
					</h2>
					<div className="about-members__list--private">
						<i className="fa-solid fa-lock private-icon"></i>
						<h2 className="ab-members-private__warning">
							This content is available only to members
						</h2>
					</div>
				</div>
			) : (
				<div className="about-members__list">
					<h2 className="about-members__list__title">
						Members ({membersArr.length})
					</h2>
					<div className="about-members__grid">
						{membersArr.map((member, i) => (
							<img
								key={i}
								src={member.profileImageUrl}
								className="profile-image--small"
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
