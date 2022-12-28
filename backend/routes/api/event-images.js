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
	requireOrganizerOrCoHostForEvent,
	checkIfUserIsNotMemberOfEventGroup,
	checkIfAttendanceRequestAlreadyExists,
	checkIfAttendanceDoesNotExist,
	requireOrganizerOrCohostOrIsUserToDeleteAttendance,
	requireOrganizerOrCoHostOrAttendeeForEvent,
	requireOrganizerOrCoHostForEventImage,
	checkIfEventImageDoesNotExist
} = require("../../utils/authentication");
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

router.delete(
	"/:imageId",
	requireAuthentication,
	checkIfEventImageDoesNotExist,
	requireOrganizerOrCoHostForEventImage,
	async (req, res, next) => {
		const { imageId } = req.params;
		const imageToDelete = await EventImage.findByPk(imageId);
		await imageToDelete.destroy();
		return res.json({
			message: "Successfully deleted",
			statusCode: 200
		});
	}
);

module.exports = router;
