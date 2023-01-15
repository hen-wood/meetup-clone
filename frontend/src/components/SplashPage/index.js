import SplashIntro from "./SplashIntro";
import HowMeetDownWorks from "./HowMeetDownWorks";
import PopularGroups from "./PopularGroups";
import "./SplashPage.css";
import YellowBlob from "../SVGComponents/YellowBlob";
import RedBlob from "../SVGComponents/RedBlob";
import GreenBlob from "../SVGComponents/GreenBlob";
export default function SplashPage() {
	return (
		<div className="splash-outer-container">
			{/* <div id="blob-container"> */}
			<RedBlob />
			<YellowBlob />
			<GreenBlob />
			{/* </div> */}
			<div className="splash-content-container">
				<SplashIntro />
				<HowMeetDownWorks />
				<PopularGroups />
			</div>
		</div>
	);
}
