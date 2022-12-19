// backend/routes/api/users.js
const express = require("express");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
	setTokenCookie,
	requireAuthentication,
	checkIfUserExists
} = require("../../utils/auth");
const { validateSignup } = require("../../utils/validation-chains");
const { User } = require("../../db/models");

const router = express.Router();

// Sign up
router.post("/", checkIfUserExists, validateSignup, async (req, res, next) => {
	const { firstName, lastName, email, password, username } = req.body;
	const user = await User.signup({
		firstName,
		lastName,
		email,
		username,
		password
	});

	await setTokenCookie(res, user);

	return res.json({
		user: user
	});
});

module.exports = router;
