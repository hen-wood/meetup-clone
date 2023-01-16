export default function dayMonthDate(inputDate) {
	const date = new Date(inputDate);
	const dayStr = date.toString().slice(0, 3);
	const monthStr = date.toString().slice(4, 7);
	const dayNum = date.getDate();
	let hour = date.getHours();
	const amPm = hour >= 12 ? "PM" : "AM";
	if (hour > 12) {
		hour -= 12;
	}
	let minutes = date.getMinutes();
	if (minutes === 0) {
		minutes = "00";
	}
	return `${dayStr}, ${monthStr} ${dayNum} · ${hour}:${minutes} ${amPm}`;
}

// Thu, Jan 19 · 7:00 PM PST
