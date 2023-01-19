export default function formatEventPrice(price) {
	let splitPrice = price.toString().split(".");
	if (splitPrice.length > 1 && splitPrice[1].length === 1) {
		splitPrice = "$" + splitPrice[0] + "." + splitPrice[1] + "0";
		return splitPrice;
	} else if (+splitPrice[0] === 0) {
		return "Free event";
	} else {
		splitPrice = "$" + splitPrice[0] + ".00";
		return splitPrice;
	}
}
