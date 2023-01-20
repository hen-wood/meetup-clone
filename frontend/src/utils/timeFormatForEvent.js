export const timeFormatForEvent = date => {
	console.log(date);
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
	let time = date.slice(11, 16);
	console.log(time);
	let hours = time.slice(0, 2);
	console.log(hours);
	let amPm = "AM";
	if (hours === "12") {
		amPm = "PM";
	} else if (+hours > 12) {
		time = `${hours - 12}:${time.slice(3)}`;
		amPm = "PM";
	} else if (hours === "00") {
		time = `12:${time.slice(3)}`;
	} else if (hours[0] === "0") {
		time = `${hours[1]}:${time.slice(3)}`;
	}
	return `${day}, ${new Date(date).toString().slice(4, 7)} ${new Date(date)
		.toString()
		.slice(8, 10)}, ${new Date(date)
		.toString()
		.slice(11, 15)} at ${time} ${amPm}`;
};
