// backend/routes/api/users.js
const express = require("express");

const { setTokenCookie } = require("../../utils/authentication");
const { checkIfUserAlreadyExists } = require("../../utils/authorization");
const { validateSignup } = require("../../utils/validation-chains");
const { User } = require("../../db/models");
const { singleMulterUpload, uploadImageToS3 } = require("../../awsS3");

const router = express.Router();

// Sign up
router.post(
	"/",
	singleMulterUpload("image"),
	checkIfUserAlreadyExists,
	validateSignup,
	async (req, res, next) => {
		const { firstName, lastName, email, password, username } = req.body;
		let profileImageUrl;
		if (req.file) {
			profileImageUrl = await uploadImageToS3(req.file);
		} else {
			profileImageUrl = "https://i.imgur.com/sEyrna2.png";
		}
		const user = await User.signup({
			firstName,
			lastName,
			email,
			profileImageUrl,
			username,
			password
		});

		await setTokenCookie(res, user);
		const resBody = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			profileImageUrl: user.profileImageUrl,
			email: user.email,
			token: req.cookies.token
		};
		return res.json(resBody);
	}
);

module.exports = router;
