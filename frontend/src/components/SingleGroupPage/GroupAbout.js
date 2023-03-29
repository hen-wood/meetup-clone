import UpcomingEvents from "./UpcomingEvents";
import PastEvents from "./PastEvents";
import AboutMembers from "./AboutMembers";

export default function GroupAbout({ group, events, members, organizer }) {
	const eventsArr = Object.values(events);
	const pastEvents = eventsArr.filter(event => {
		return new Date(event.startDate) < new Date(Date.now());
	});
	const futureEvents = eventsArr.filter(event => {
		return new Date(event.startDate) > new Date(Date.now());
	});
	return (
		<div className="group-about">
			<div className="group-about__left">
				<div className="group-about__description">
					<h2 className="group-about__title">What we're about</h2>
					<p className="group-about__text">{group.about}</p>
				</div>
				<h2 className="gr-about__event-card__title">
					Upcoming Events ({futureEvents.length})
				</h2>
				<UpcomingEvents events={futureEvents} />
				<h2 className="gr-about__event-card__title">
					Past Events ({pastEvents.length})
				</h2>
				<PastEvents events={pastEvents} />
			</div>
			<div className="group-about__right">
				{
					<AboutMembers
						members={members}
						organizer={organizer}
						isPrivate={group.private}
						group={group}
					/>
				}
			</div>
		</div>
	);
}
