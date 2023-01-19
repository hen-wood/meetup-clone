import SplashIntro from "./SplashIntro";
import HowMeetDownWorks from "./HowMeetDownWorks";
import "./SplashPage.css";
import YellowBlob from "../SVGComponents/YellowBlob";
import RedBlob from "../SVGComponents/RedBlob";
import GreenBlob from "../SVGComponents/GreenBlob";
import Footer from "./Footer";
export default function SplashPage() {
	const navBar = document.querySelector(".navigation");
	navBar.className = "navigation";
	return (
		<div className="splash-outer-container">
			<RedBlob />
			<YellowBlob />
			<GreenBlob />
			<div className="splash-content-container">
				<SplashIntro />
				<HowMeetDownWorks />
			</div>
		</div>
	);
}
