export default function compareDates(dateObject, dateString) {
	const year = dateObject.getFullYear();
	const month = dateObject.getMonth();
	const day = dateObject.getDate();

	const dateFromDateString = new Date(dateString);
	const yearFromDateString = dateFromDateString.getFullYear();
	const monthFromDateString = dateFromDateString.getMonth();
	const dayFromDateString = dateFromDateString.getDate();

	return (
		year === yearFromDateString &&
		month === monthFromDateString &&
		day === dayFromDateString
	);
}
