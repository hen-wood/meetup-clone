import SplashIntroImage from "../SVGComponents/SplashIntroImage";
import "./SplashIntro.css";
export default function SplashIntro() {
	return (
		<div className="splash-intro-container">
			<div className="splash-intro-top-container">
				<div className="splash-intro-text-container">
					<h1>The people platform—Where interests become friendships</h1>
					<p>
						Whatever your interest, from hiking and reading to networking and
						skill sharing, there are thousands of people who share it on
						Meetdown. Events are happening every day—log in to join the fun.
					</p>
				</div>
				<div className="splash-intro-image-container">
					<SplashIntroImage />
				</div>
			</div>
		</div>
	);
}
