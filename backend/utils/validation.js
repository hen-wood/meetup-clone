// backend/utils/validation.js
const { validationResult } = require("express-validator");
const { ValidationError } = require("sequelize");
const { User, Venue } = require("../db/models");

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

const checkForValidEventBody = async (req, res, next) => {
	const validationErrors = validationResult(req);
	const { venueId, startDate, endDate } = req.body;
	if (!validationErrors.isEmpty()) {
		const errors = validationErrors.array();
		if (venueId) {
			const venue = await Venue.findByPk(venueId);
			if (!venue) {
				errors.push({ param: "venueId", msg: "Venue does not exist" });
			}
		}
		if (Date(startDate) < Date.now()) {
			errors.push({
				param: "startDate",
				msg: "Start date must be in the future"
			});
		}
		if (Date(startDate) > Date(endDate)) {
			errors.push({
				param: "endDate",
				msg: "End date is less than start date"
			});
		}

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

module.exports = {
	handleValidationErrors,
	checkForValidStatus,
	checkIfUserDoesNotExist,
	checkForValidEventBody
};
