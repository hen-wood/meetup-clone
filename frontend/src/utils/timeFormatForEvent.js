export const timeFormatForEvent = date => {
	console.log(Date(date).toString());
	let day = new Date(date).toString().slice(0, 3).toLowerCase();
	if (day === "tue") {
		day = "Tuesday";
	} else if (day === "wed") {
		day = "Wednesday";
	} else if (day === "thu") {
		day = "Thursday";
	} else if (day === "sat") {
		day = "Saturday";
	} else if (day === "sun") {
		day = "Sunday";
	} else if (day === "mon") {
		day = "Monday";
	} else if (day === "fri") {
		day = "Friday";
	}
	console.log({ day });
	let time = new Date(date).toString().slice(16, 21);
	let hours = time.slice(0, 2);
	let amPm = "AM";
	if (+hours > 12) {
		time = `${hours - 12}:${time.slice(4)}`;
		amPm = "PM";
	}
	return `${day}, ${new Date(date).toString().slice(4, 7)} ${new Date(date)
		.toString()
		.slice(8, 10)}, ${new Date(date)
		.toString()
		.slice(11, 15)} at ${time} ${amPm}`;
};
