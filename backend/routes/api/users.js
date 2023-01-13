// backend/routes/api/users.js
const express = require("express");

const { setTokenCookie } = require("../../utils/authentication");
const { checkIfUserAlreadyExists } = require("../../utils/authorization");
const { validateSignup } = require("../../utils/validation-chains");
const { User } = require("../../db/models");

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
