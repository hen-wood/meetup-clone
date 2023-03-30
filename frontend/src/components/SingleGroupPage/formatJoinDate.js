export function formatJoinDate(joinDate) {
	const dateStr = joinDate;
	const date = new Date(dateStr);
	const options = { year: "numeric", month: "short", day: "numeric" };
	const formattedDate = date.toLocaleDateString("en-US", options);

	return formattedDate;
}
