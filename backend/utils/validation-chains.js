const { check } = require("express-validator");
const { handleValidationErrors } = require("./validation");
const { Venue } = require("../db/models");
const { ValidationError } = require("sequelize");

const validateSignup = [
	check("email")
		.exists({ checkFalsy: true })
		.isEmail()
		.withMessage("Please provide a valid email."),
	check("username")
		.exists({ checkFalsy: true })
		.isLength({ min: 4 })
		.withMessage("Please provide a username with at least 4 characters."),
	check("username").not().isEmail().withMessage("Username cannot be an email."),
	check("password")
		.exists({ checkFalsy: true })
		.isLength({ min: 6 })
		.withMessage("Password must be 6 characters or more."),
	check("firstName")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a first name."),
	check("lastName")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a last name."),
	handleValidationErrors
];

const validateLogin = [
	check("credential")
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Please provide a valid email or username."),
	check("password")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a password."),
	handleValidationErrors
];

const validateCreateGroup = [
	check("name")
		.exists({ checkNull: true })
		.isString()
		.isLength({ max: 60 })
		.withMessage("Name must be 60 characters or less"),
	check("about")
		.exists({ checkFalsy: true })
		.isString()
		.isLength({ min: 50 })
		.withMessage("About must be 50 characters or more"),
	check("type")
		.exists({ checkFalsy: true })
		.isString()
		.isIn(["Online", "In person"])
		.withMessage("Type must be 'Online' or 'In person'"),
	check("private")
		.exists({ checkNull: true })
		.isBoolean({ loose: false })
		.withMessage("Private must be a boolean"),
	check("city").exists().isString().withMessage("City is required"),
	check("state").exists().isString().withMessage("State is required"),
	handleValidationErrors
];
const validateCreateGroupEvent = [
	check("venueId")
		.optional()
		.custom(async (value, { req }) => {
			const { venueId } = req.body;
			// if (venueId === undefined || venueId === null) return true;
			const venue = await Venue.findByPk(venueId);
			if (!venue) {
				throw new ValidationError("Venue does not exist");
			}
			return true;
		}),
	check("name")
		.isLength({ min: 5 })
		.withMessage("Name must be at least 5 characters"),
	check("type")
		.isIn(["Online", "In person"])
		.withMessage("Type must be Online or In person"),
	check("capacity").isInt().withMessage("Capacity must be an integer"),
	check("price")
		.isDecimal({ decimal_digits: "1,2" })
		.withMessage("Price is invalid"),
	check("description")
		.exists({ checkFalsy: true })
		.withMessage("Description is required"),
	check("startDate").custom((value, { req }) => {
		const start = new Date(req.body.startDate);
		if (start < Date.now()) {
			throw new ValidationError("Start date must be in the future");
		}
		return true;
	}),
	check("endDate").custom((value, { req }) => {
		const { startDate, endDate } = req.body;
		const start = new Date(startDate);
		const end = new Date(endDate);
		if (end < start) {
			throw new ValidationError("End date is less than start date");
		}
		return true;
	}),
	handleValidationErrors
];

const validateCreateGroupVenue = [
	check("address")
		.exists({ checkFalsy: true })
		.isString()
		.withMessage("Street address is required"),
	check("city")
		.exists({ checkFalsy: true })
		.isString()
		.withMessage("City is required"),
	check("state")
		.exists({ checkFalsy: true })
		.isString()
		.withMessage("State is required"),
	check("lat")
		.isDecimal({ force_decimal: true })
		.withMessage("Latitude is not valid"),
	check("lng")
		.isDecimal({ force_decimal: true })
		.withMessage("Longitude is not valid"),
	handleValidationErrors
];
const validateEditGroupVenue = [
	check("address")
		.optional()
		.isString()
		.withMessage("Street address is required"),
	check("city").optional().isString().withMessage("City is required"),
	check("state").optional().isString().withMessage("State is required"),
	check("lat")
		.optional()
		.isDecimal({ force_decimal: true })
		.withMessage("Latitude is not valid"),
	check("lng")
		.optional()
		.isDecimal({ force_decimal: true })
		.withMessage("Longitude is not valid"),
	handleValidationErrors
];

const validateEditGroup = [
	check("name")
		.optional()
		.isString()
		.isLength({ max: 60 })
		.withMessage("Name must be 60 characters or less"),
	check("about")
		.optional()
		.isString()
		.isLength({ min: 50 })
		.withMessage("About must be 50 characters or more"),
	check("type")
		.optional()
		.isString()
		.isIn(["Online", "In person"])
		.withMessage("Type must be 'Online' or 'In person'"),
	check("private")
		.optional()
		.isBoolean({ loose: false })
		.withMessage("Private must be a boolean"),
	check("city").exists().isString().withMessage("City is required"),
	check("state").exists().isString().withMessage("State is required"),
	handleValidationErrors
];

const validateAllEventsQueryParams = [
	check("page")
		.optional()
		.custom((value, { req }) => {
			const { page } = req.query;
			if (page < 1) {
				throw new ValidationError("Page must be greater than or equal to 1");
			}
			return true;
		}),
	check("size")
		.optional()
		.custom((value, { req }) => {
			const { size } = req.query;
			if (size < 1) {
				throw new ValidationError("Size must be greater than or equal to 1");
			}
			return true;
		}),
	check("name")
		.optional()
		.custom((value, { req }) => {
			const valid =
				req.query.name.toUpperCase() !== req.query.name.toLowerCase();
			if (!valid) {
				throw new ValidationError("Name must be a string");
			}
			return true;
		}),
	check("type")
		.optional()
		.isString()
		.isIn(["Online", "In person"])
		.withMessage("Type must be 'Online' or 'In person'"),
	check("startDate")
		.optional()
		.custom((value, { req }) => {
			const start = new Date(req.query.startDate);
			console.log(start);
			if (start == "Invalid Date") {
				throw new ValidationError("Start date must be a valid datetime");
			}
			return true;
		}),
	handleValidationErrors
];

module.exports = {
	validateSignup,
	validateLogin,
	validateCreateGroup,
	validateCreateGroupVenue,
	validateEditGroupVenue,
	validateEditGroup,
	validateCreateGroupEvent,
	validateAllEventsQueryParams
};
