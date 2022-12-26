// backend/utils/validation.js
const { validationResult } = require("express-validator");
const { ValidationError } = require("sequelize");
const { User } = require("../db/models");

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		const errors = validationErrors.array();

		const err = new ValidationError("Validation error");
		err.errors = errors;
		err.status = 400;
		next(err);
	}
	next();
};

const checkForValidStatus = (req, res, next) => {
	const { status } = req.body;

	if (!["co-host", "member"].includes(status)) {
		const err = new ValidationError("Validation error");
		err.errors = [
			{
				params: "status",
				msg: "Cannot change a membership status to pending"
			}
		];
		err.status = 400;
		return next(err);
	}
	return next();
};

const checkIfUserDoesNotExist = async (req, res, next) => {
	const { memberId } = req.body;
	const user = await User.findByPk(memberId);
	if (!user) {
		const err = new ValidationError("Validation error");
		err.errors = [
			{
				params: "status",
				msg: "User couldn't be found"
			}
		];
		err.status = 400;
		return next(err);
	}
	return next();
};
const checkIfMembershipExists = async (req, res, next) => {
	const { groupId } = req.params;
	const userId = req.user.id;
	const existingMembership = await Membership.findOne({
		where: {
			[Op.and]: [{ groupId }, { userId }]
		}
	});

	if (existingMembership) {
		const err = new Error();
		err.status = 400;
		if (existingMembership.status === "pending") {
			err.message = "Membership has already been requested";
		} else {
			err.message = "User is already a member of the group";
		}
		return next(err);
	} else {
		return next();
	}
};

const checkIfAttendanceRequestAlreadyExists = async (req, res, next) => {
	const { eventId } = req.params;
	const userId = req.user.id;
	const attendanceRequest = await Attendance.findOne({
		where: {
			eventId,
			userId
		}
	});

	if (attendanceRequest) {
		const err = new Error();
		err.status = 400;
		if (attendanceRequest.status === "pending") {
			err.message = "Attendance has already been requested";
		} else {
			err.message = "User is already an attendee of the event";
		}
		return next(err);
	}
	return next();
};

module.exports = {
	handleValidationErrors,
	checkForValidStatus,
	checkIfUserDoesNotExist
};
