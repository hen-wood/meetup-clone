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
const { Op, where } = require("sequelize");
const {
	requireAuthentication,
	requireAuthorization,
	checkIfMembershipExists,
	checkIfGroupDoesNotExist,
	requireOrganizerOrCoHost,
	requireOrganizerOrCoHostOrIsUser,
	checkIfMembershipDoesNotExist,
	checkIfEventDoesNotExist,
	requireOrganizerOrCoHostForEvent,
	checkIfUserIsNotMemberOfEventGroup,
	checkIfAttendanceRequestAlreadyExists,
	checkIfAttendanceDoesNotExist,
	requireOrganizerOrCohostOrIsUserToDeleteAttendance,
	requireOrganizerOrCoHostOrAttendeeForEvent
} = require("../../utils/auth");
const {
	validateCreateGroup,
	validateEditGroup,
	validateCreateGroupVenue,
	validateCreateGroupEvent,
	validateAllEventsQueryParams
} = require("../../utils/validation-chains");
const { notFound } = require("../../utils/not-found");
const {
	checkForValidStatus,
	checkIfUserDoesNotExist
} = require("../../utils/validation");

const router = express.Router();

// Get all attendees of an event by event id
router.get(
	"/:eventId/attendees",
	checkIfEventDoesNotExist,
	async (req, res, next) => {
		const userId = req.user.id;
		const { eventId } = req.params;
		const isGroupOrganizer = await Event.findByPk(eventId, {
			include: {
				model: Group,
				where: {
					organizerId: userId
				}
			}
		});

		const isCoHost = await Event.findByPk(eventId, {
			attributes: [],
			include: {
				model: Group,

				include: {
					model: User,
					as: "Members",
					through: {
						where: {
							[Op.and]: [{ status: "co-host" }, { userId }]
						}
					}
				}
			}
		});
		if (isCoHost.Group.Members.length || isGroupOrganizer) {
			const eventAttendees = await Event.findByPk(eventId, {
				attributes: [],
				include: {
					model: User,
					as: "Attendees",
					attributes: ["id", "firstName", "lastName"],
					through: {
						attributes: ["status"]
					}
				}
			});
			return res.json(eventAttendees);
		} else {
			const eventAttendees = await Event.findByPk(eventId, {
				attributes: [],
				include: {
					model: User,
					as: "Attendees",
					attributes: ["id", "firstName", "lastName"],
					through: {
						attributes: ["status"],
						where: {
							[Op.not]: {
								status: "pending"
							}
						}
					}
				}
			});
			return res.json(eventAttendees);
		}
	}
);

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
				attributes: ["id", "address", "city", "state", "lat", "lng"]
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
router.get("/", validateAllEventsQueryParams, async (req, res, next) => {
	let { page, size, name, type, startDate } = req.query;

	page = +page;
	size = +size;

	if (Number.isNaN(page) || page < 1) page = 1;
	if (Number.isNaN(size) || size > 20) size = 20;

	if (page > 10) page = 10;
	if (size < 1) size = 1;

	let where = {};

	if (name) where.name = name;
	if (type) where.type = type;
	if (startDate) {
		where.startDate = startDate;
	}

	const allEvents = await Event.findAll({
		attributes: { exclude: ["description", "capacity", "price"] },
		include: [
			{
				model: Group,
				attributes: ["id", "name", "city", "state"]
			},
			{
				model: Venue,
				attributes: ["id", "city", "state"]
			}
		],
		where,
		limit: size,
		offset: size * (page - 1)
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

// Request to attend event
router.post(
	"/:eventId/attendance",
	requireAuthentication,
	checkIfEventDoesNotExist,
	checkIfUserIsNotMemberOfEventGroup,
	checkIfAttendanceRequestAlreadyExists,
	async (req, res, next) => {
		const { eventId } = req.params;
		const userId = req.user.id;
		const newAttendance = await Attendance.create({
			eventId,
			userId,
			status: "pending"
		});
		res.json({
			userId: newAttendance.userId,
			status: newAttendance.status
		});
	}
);

// Add an image to an event by event id
router.post(
	"/:eventId/images",
	requireAuthentication,
	checkIfEventDoesNotExist,
	requireOrganizerOrCoHostOrAttendeeForEvent,
	async (req, res, next) => {
		const { eventId } = req.params;
		const { url, preview } = req.body;
		const newEventImage = await EventImage.create({
			eventId,
			url,
			preview
		});
		return res.json({ id: newEventImage.id, url, preview });
	}
);

// Change status of an attendance by event id
router.put(
	"/:eventId/attendance",
	requireAuthentication,
	checkIfEventDoesNotExist,
	checkIfAttendanceDoesNotExist,
	requireOrganizerOrCoHostForEvent,
	async (req, res, next) => {
		const { eventId } = req.params;
		const { userId, status } = req.body;
		if (status === "pending") {
			const err = new Error("Cannot change an attendance status to pending");
			err.status = 400;
			return next(err);
		}
		let attendanceToUpdate = await Attendance.findOne({
			where: {
				eventId,
				userId
			}
		});
		attendanceToUpdate.status = status;
		await attendanceToUpdate.save();
		const { id } = attendanceToUpdate;
		return res.json({ id, userId, eventId, status });
	}
);

// Edit event by event id
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

// Delete attendance by event id (userId in req.body)
router.delete(
	"/:eventId/attendance",
	requireAuthentication,
	checkIfEventDoesNotExist,
	checkIfAttendanceDoesNotExist,
	requireOrganizerOrCohostOrIsUserToDeleteAttendance,
	async (req, res, next) => {
		const { eventId } = req.params;
		const { userId } = req.body;
		const attendanceToDelete = await Attendance.findOne({
			where: { userId, eventId }
		});
		attendanceToDelete.destroy();
		res.json({
			message: "Successfully deleted attendance from event"
		});
	}
);

// Delete event by event id
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
