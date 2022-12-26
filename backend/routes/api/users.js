// backend/routes/api/users.js
const express = require("express");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
	setTokenCookie,
	requireAuthentication,
	checkIfUserAlreadyExists
} = require("../../utils/auth");
const { validateSignup } = require("../../utils/validation-chains");
const { User } = require("../../db/models");
const { token } = require("morgan");

const router = express.Router();

// Sign up
router.post(
	"/",
	checkIfUserAlreadyExists,
	validateSignup,
	async (req, res, next) => {
		const { firstName, lastName, email, password, username } = req.body;
		const user = await User.signup({
			firstName,
			lastName,
			email,
			username,
			password
		});

		await setTokenCookie(res, user);
		const resBody = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			token: req.cookies.token
		};
		return res.json(resBody);
	}
);

module.exports = router;
