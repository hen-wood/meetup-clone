const express = require("express");
const { Venue } = require("../../db/models");
const { requireAuthentication } = require("../../utils/authentication.js");
const { checkIfVenueDoesNotExist } = require("../../utils/not-found");
const {
	requireOrganizerOrCoHostToEditVenue
} = require("../../utils/authorization.js");
const { validateEditGroupVenue } = require("../../utils/validation-chains");

const router = express.Router();

// Edit a venue by its id
router.put(
	"/:venueId",
	requireAuthentication,
	checkIfVenueDoesNotExist,
	requireOrganizerOrCoHostToEditVenue,
	validateEditGroupVenue,
	async (req, res, next) => {
		const { venueId } = req.params;
		const { address, city, state, lat, lng } = req.body;

		const venueToEdit = await Venue.findByPk(venueId);

		if (address) venueToEdit.address = address;
		if (city) venueToEdit.city = city;
		if (state) venueToEdit.state = state;
		if (lat) venueToEdit.lat = lat;
		if (lng) venueToEdit.lng = lng;
		venueToEdit.save();

		return res.json(venueToEdit);
	}
);

module.exports = router;
