// backend/routes/api/users.js
const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
	setTokenCookie,
	requireAuthentication,
	checkIfUserExists
} = require("../../utils/auth");
const {
	singleMulterUpload,
	singlePublicFileUpload,
	multipleMulterUpload,
	multiplePublicFileUpload
} = require("../../awsS3");

const { validateSignup } = require("../../utils/validation-chains");
const { User, Picture } = require("../../db/models");
const { token } = require("morgan");

const router = express.Router();

router.post(
	"/pictures",
	singleMulterUpload("image"),
	async (req, res, next) => {
		const userId = req.user.id;

		const newPictureObj = await singlePublicFileUpload(req.file);

		const key = newPictureObj;
		const resBody = await Picture.create({
			key,
			userId
		});

		return res.json(resBody);
	}
);

// Sign up
router.post(
	"/",
	singleMulterUpload("image"),
	checkIfUserExists,
	validateSignup,
	async (req, res, next) => {
		const { firstName, lastName, email, password, username } = req.body;

		const profileImageUrl = await singlePublicFileUpload(req.file);
		const user = await User.signup({
			firstName,
			lastName,
			email,
			username,
			password,
			profileImageUrl
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
