const express = require("express");
const {
	Group,
	Membership,
	GroupImage,
	Event,
	Attendance,
	EventImage,
	User,
	Venue
} = require("../../db/models");
const { Op } = require("sequelize");
const {
	requireAuthentication,
	requireAuthorization,
	requireOrganizerOrCoHostToEditVenue,
	checkIfVenueDoesNotExist
} = require("../../utils/auth");
const { validateEditGroupVenue } = require("../../utils/validation-chains");
const { notFound } = require("../../utils/not-found");

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
