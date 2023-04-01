export default function formatDateTitle(dateObject) {
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	};

	return dateObject.toLocaleDateString("en-US", options);
}
