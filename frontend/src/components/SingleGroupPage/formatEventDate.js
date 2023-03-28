export function formatEventDate(dateString) {
	const date = new Date(dateString);

	const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
	const dayOfWeek = daysOfWeek[date.getUTCDay()];

	const months = [
		"JAN",
		"FEB",
		"MAR",
		"APR",
		"MAY",
		"JUN",
		"JUL",
		"AUG",
		"SEP",
		"OCT",
		"NOV",
		"DEC"
	];
	const monthAbbrev = months[date.getUTCMonth()];

	const dayOfMonth = date.getUTCDate();

	const year = date.getUTCFullYear();

	const hour = date.getUTCHours();

	const minute = date.getUTCMinutes().toString().padStart(2, "0");

	const timezoneOffset = new Date().getTimezoneOffset();
	const timezoneAbbrev = timezoneOffset <= 240 ? "EDT" : "EST";

	const formattedString = `${dayOfWeek}, ${monthAbbrev} ${dayOfMonth}, ${year}, ${
		hour % 12 === 0 ? 12 : hour % 12
	}:${minute} ${hour < 12 ? "AM" : "PM"} ${timezoneAbbrev}`;

	return formattedString;
}
