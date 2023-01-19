import HighFiveImage from "../SVGComponents/HighFive";
import TicketImage from "../SVGComponents/TicketImage";
import { Link } from "react-router-dom";
import "./HowMeetDownWorks.css";
export default function HowMeetDownWorks() {
	return (
		<div className="how-meetdown-works-container">
			<div className="how-meetdown-works-text-container">
				<h2>How Meetdown works</h2>
				<p>
					Meet new people who share your interests through online and in-person
					events. It’s free to create an account.
				</p>
			</div>
			<div className="how-meetdown-works-cards-container">
				<div className="how-meetdown-works-individual-card">
					<span className="hmw-card-image-container">
						<HighFiveImage />
					</span>
					<div className="hmw-card-text-container">
						<Link to="/all-groups" className="hmw-links">
							Browse groups
						</Link>
						<p>
							Do what you love, meet others who love it, find your community.
							The rest is history!
						</p>
					</div>
				</div>
				<div className="how-meetdown-works-individual-card">
					<span className="hmw-card-image-container">
						<TicketImage />
					</span>
					<div className="hmw-card-text-container">
						<Link to="/all-events" className="hmw-links">
							Find an event
						</Link>
						<p>
							Events are happening on just about any topic you can think of,
							from online gaming and photography to yoga and hiking.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
