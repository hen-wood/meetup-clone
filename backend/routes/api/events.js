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
	checkIfMembershipDoesNotExist,
	checkIfEventDoesNotExist,
	requireOrganizerOrCoHostForEvent
} = require("../../utils/auth");
const {
	validateCreateGroup,
	validateEditGroup,
	validateCreateGroupVenue,
	validateCreateGroupEvent
} = require("../../utils/validation-chains");
const { notFound } = require("../../utils/not-found");
const {
	checkForValidStatus,
	checkIfUserDoesNotExist
} = require("../../utils/validation");

const router = express.Router();

// Get event by eventId
router.get("/:eventId", checkIfEventDoesNotExist, async (req, res, next) => {
	const { eventId } = req.params;
	let event = await Event.findByPk(eventId, {
		include: [
			{
				model: Group,
				attributes: ["id", "name", "private", "city", "state"]
			},
			{
				model: Venue,
				attributes: ["id", "city", "state", "lat", "lng"]
			},
			{
				model: EventImage,
				attributes: ["id", "url", "preview"]
			}
		]
	});

	event = event.toJSON();

	event.numAttending = await Attendance.count({
		where: {
			eventId: event.id
		}
	});

	return res.json(event);
});
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

router.put(
	"/:eventId",
	requireAuthentication,
	checkIfEventDoesNotExist,
	requireOrganizerOrCoHostForEvent,
	validateCreateGroupEvent,
	async (req, res, next) => {
		const { eventId } = req.params;
		const {
			venueId,
			name,
			type,
			capacity,
			price,
			description,
			startDate,
			endDate
		} = req.body;

		const eventToEdit = await Event.findByPk(eventId);
		if (venueId) eventToEdit.venueId = venueId;
		if (name) eventToEdit.name = name;
		if (type) eventToEdit.type = type;
		if (capacity) eventToEdit.capacity = capacity;
		if (price) eventToEdit.price = price;
		if (description) eventToEdit.description = description;
		if (startDate) eventToEdit.startDate = startDate;
		if (endDate) eventToEdit.endDate = endDate;
		const resBody = eventToEdit.toJSON();
		await eventToEdit.save();

		return res.json(resBody);
	}
);

router.delete(
	"/:eventId",
	requireAuthentication,
	checkIfEventDoesNotExist,
	requireOrganizerOrCoHostForEvent,
	async (req, res, next) => {
		const { eventId } = req.params;
		const eventToDelete = await Event.findByPk(eventId);
		eventToDelete.destroy();
		return res.json({
			message: "Successfully deleted"
		});
	}
);

module.exports = router;
