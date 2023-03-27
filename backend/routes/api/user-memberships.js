// backend/routes
const express = require("express");
const { Membership } = require("../../db/models");
const { requireAuthentication } = require("../../utils/authentication");

const router = express.Router();

router.get("/pending", requireAuthentication, async (req, res, next) => {
	const userId = req.user.id;
	const pendingMemberships = await Membership.findAll({
		where: {
			userId,
			status: "pending"
		}
	});

	return res.json(pendingMemberships);
});

module.exports = router;
