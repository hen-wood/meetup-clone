export default function HomePage({ user }) {
	return (
		<div className="home-page-outer-container">
			<div className="home-page-inner-container">
				<h2>Welcome, {user.firstName + "👋"}</h2>
			</div>
		</div>
	);
}
