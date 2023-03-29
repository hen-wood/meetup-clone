import MemberOptions from "./MemberOptions";

export default function GroupNavbar({
	currTab,
	setCurrTab,
	status,
	setStatus
}) {
	const tabs = ["About", "Events", "Members", "Photos"];
	return (
		<div className="group-navbar">
			<div className="group-navbar__inner">
				<div className="group-navbar__button-container">
					{tabs.map((tab, i) => (
						<button
							className={`group-navbar__button ${
								currTab === tab ? "group-navbar__button--active" : ""
							}`}
							key={i}
							onClick={() => setCurrTab(tab)}
						>
							{tab}
						</button>
					))}
				</div>
				<div className="group-navbar__options-container">
					<MemberOptions status={status} setStatus={setStatus} />
				</div>
			</div>
		</div>
	);
}
