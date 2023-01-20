export default function dayMonthDate(inputDate) {
	console.log({ inputDate });
	const date = new Date(inputDate);
	console.log({
		date
	});

	const dayStr = date.toString().slice(0, 3);
	const monthStr = date.toString().slice(4, 7);
	const dayNum = date.getDate();

	let time = inputDate.slice(11, 16);
	let hour = time.slice(0, 2);
	let amPm = "AM";
	if (+hour > 12) {
		time = +hour - 12 + time.slice(2);
		amPm = "PM";
	}
	if (hour === "00") {
		time = "12" + time.slice(2);
	}
	if (hour[0] === "0") {
		time = hour[1] + time.slice(2);
	}

	return `${dayStr}, ${monthStr} ${dayNum} · ${time} ${amPm}`;
}

// Thu, Jan 19 · 7:00 PM PST
