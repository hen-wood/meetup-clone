// backend/routes/api/events.js
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
	checkIfMembershipExists,
	checkIfGroupDoesNotExist,
	requireOrganizerOrCoHost,
	requireOrganizerOrCoHostOrIsUser,
	checkIfMembershipDoesNotExist
} = require("../../utils/auth");
const {
	validateCreateGroup,
	validateEditGroup,
	validateCreateGroupVenue
} = require("../../utils/validation-chains");
const { notFound } = require("../../utils/not-found");
const {
	checkForValidStatus,
	checkIfUserDoesNotExist
} = require("../../utils/validation");

const router = express.Router();

// Get all events
router.get("/", async (req, res, next) => {
	const allEvents = await Event.findAll({
		include: [
			{
				model: Group,
				attributes: ["id", "name", "city", "state"]
			},
			{
				model: Venue,
				attributes: ["id", "city", "state"]
			}
		]
	});

	const Events = JSON.parse(JSON.stringify(allEvents));
	for (let event of Events) {
		let previewImage = await EventImage.findOne({
			where: {
				[Op.and]: [{ eventId: event.id }, { preview: true }]
			},
			attributes: ["url"]
		});
		if (previewImage) {
			previewImage = previewImage.url;
			event.previewImage = previewImage;
		} else {
			event.previewImage = null;
		}

		event.numAttending = await Attendance.count({
			where: {
				eventId: event.id
			}
		});
	}

	return res.json({ Events });
});

module.exports = router;
