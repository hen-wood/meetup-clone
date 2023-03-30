import MemberOptions from "./MemberOptions";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";

export default function GroupNavbar({
	currTab,
	setCurrTab,
	status,
	setStatus,
	user
}) {
	const tabs = ["About", "Events", "Members", "Photos"];

	return (
		<div className="group-navbar">
			<div className="group-navbar__inner">
				<div className="group-navbar__button-container">
					{tabs.map((tab, i) =>
						user || tab === "About" || tab === "Events" ? (
							<button
								className={`group-navbar__button ${
									currTab === tab ? "group-navbar__button--active" : ""
								}`}
								key={i}
								onClick={() => {
									setCurrTab(tab);
								}}
							>
								{tab}
							</button>
						) : (
							<OpenModalMenuItem
								key={i}
								itemText={tab}
								modalComponent={<LoginFormModal />}
								className={"group-navbar__button"}
							/>
						)
					)}
				</div>
				<div className="group-navbar__options-container">
					<MemberOptions status={status} setStatus={setStatus} />
				</div>
			</div>
		</div>
	);
}
