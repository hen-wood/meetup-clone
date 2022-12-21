const { check } = require("express-validator");
const {
	handleValidationErrors,
	checkForValidEventBody
} = require("./validation");

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

const validateCreateGroupEvent = [
	check("name")
		.isString()
		.isLength({ min: 5 })
		.withMessage("Name must be at least 5 characters"),
	check("type")
		.isIn(["Online", "In person"])
		.withMessage("Type must be Online or In person"),
	check("price")
		.isDecimal({ decimal_digits: "1,2" })
		.matches(/^\d+(\.\d{1,2})?$/)
		.withMessage("Price is invalid"),
	check("description")
		.exists({ checkFalsy: true })
		.isString()
		.withMessage("Description is required"),
	checkForValidEventBody
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
	// Weird to require city and state??
	check("city").exists().isString().withMessage("City is required"),
	check("state").exists().isString().withMessage("State is required"),
	handleValidationErrors
];

module.exports = {
	validateSignup,
	validateLogin,
	validateCreateGroup,
	validateCreateGroupVenue,
	validateEditGroupVenue,
	validateEditGroup,
	validateCreateGroupEvent
};
