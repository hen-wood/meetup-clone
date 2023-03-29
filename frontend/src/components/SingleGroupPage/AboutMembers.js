import { useSelector } from "react-redux";

export default function AboutMembers({ members, organizer }) {
	const membersArr = Object.values(members);
	const user = useSelector(state => state.session.user);
	return (
		<div className="about-members">
			<div className="about-members__organizer">
				<h2 className="about-members__organizer__title">Organizer</h2>
				<div className="about-members__organizer__info">
					<div className="about-members__organizer__photo"></div>
					<p className="about-members__organizer__name">
						{organizer.firstName} {organizer.lastName}
					</p>
				</div>
			</div>
			{user && (
				<div className="about-members__list">
					<h2 className="about-members__list__title">
						Members ({membersArr.length})
					</h2>
					<div className="about-members__grid">
						{membersArr.map(member => (
							<div className="about-members__member-photo"></div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
