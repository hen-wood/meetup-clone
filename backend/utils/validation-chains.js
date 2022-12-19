const { check } = require("express-validator");
const { handleValidationErrors } = require("./validation");

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
	validateEditGroup
};
