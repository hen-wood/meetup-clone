const {
	User,
	Group,
	Membership,
	Event,
	Attendance,
	EventImage,
	Venue
} = require("../db/models");
const { Op } = require("sequelize");

const notFound = msg => {
	const err = new Error(msg);
	err.status = 404;
	return err;
};

const checkIfMembershipDoesNotExist = async (req, res, next) => {
	const { groupId } = req.params;
	const { memberId } = req.body;
	const existingMembership = await Membership.findOne({
		where: { [Op.and]: [{ userId: memberId }, { groupId }] }
	});

	if (!existingMembership) {
		const err = new Error();
		err.status = 404;
		err.message = "Membership does not exist for this user";
		return next(err);
	}
	return next();
};

const checkIfAttendanceDoesNotExist = async (req, res, next) => {
	const { eventId } = req.params;
	const { userId } = req.body;
	const event = await Event.findByPk(eventId, {
		include: {
			model: User,
			as: "Attendees",
			through: {
				where: {
					userId
				}
			}
		}
	});
	if (!event.Attendees.length) {
		const err = new Error();
		err.status = 404;
		err.message = "Attendance between the user and the event does not exist";
		return next(err);
	}
	return next();
};

const checkIfEventDoesNotExist = async (req, res, next) => {
	const { eventId } = req.params;
	const eventExists = await Event.findByPk(eventId);
	if (!eventExists) {
		const err = new Error("Event couldn't be found");
		err.status = 404;
		return next(err);
	}
	return next();
};

const checkIfGroupDoesNotExist = async (req, res, next) => {
	const { groupId } = req.params;
	const groupExists = await Group.findByPk(groupId);
	if (!groupExists) {
		const err = new Error("Group couldn't be found");
		err.status = 404;
		return next(err);
	}
	return next();
};
const checkIfVenueDoesNotExist = async (req, res, next) => {
	const venueExists = await Venue.findByPk(req.params.venueId);
	if (!venueExists) {
		const err = new Error("Venue couldn't be found");
		err.status = 404;
		return next(err);
	} else {
		return next();
	}
};
const checkIfEventImageDoesNotExist = async (req, res, next) => {
	const { imageId } = req.params;
	const imageToDelete = await EventImage.findByPk(imageId);
	if (!imageToDelete) {
		const err = new Error("Event Image couldn't be found");
		err.status = 404;
		return next(err);
	}
	return next();
};
module.exports = {
	notFound,
	checkIfMembershipDoesNotExist,
	checkIfEventDoesNotExist,
	checkIfGroupDoesNotExist,
	checkIfAttendanceDoesNotExist,
	checkIfVenueDoesNotExist,
	checkIfEventImageDoesNotExist
};
