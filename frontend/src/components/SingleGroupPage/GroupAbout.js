import { UpcomingEvents } from "./UpcomingEvents";

export function GroupAbout({ group }) {
	return (
		<div className="group-about">
			<div className="group-about__left">
				<div className="group-about__description">
					<h2 className="group-about__title">What we're about</h2>
					<p className="group-about__text">{group.about}</p>
				</div>
				<UpcomingEvents groupId={group.id} />
			</div>
			<div className="group-about__right"></div>
		</div>
	);
}
