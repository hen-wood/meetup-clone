export const timeFormatForEvent = date => {
	let time = new Date(date).toString().slice(16, 21);
	let hours = time.slice(0, 2);
	let amPm = "AM";
	if (+hours > 12) {
		time = `${hours - 12}:${time.slice(4)}`;
		amPm = "PM";
	}
	return `${new Date(date).toString().slice(0, 3)}day, ${new Date(date)
		.toString()
		.slice(4, 7)} ${new Date(date).toString().slice(8, 10)}, ${new Date(date)
		.toString()
		.slice(11, 15)} at ${time} ${amPm}`;
};
