// backend/routes/api/groups.js
const express = require("express");
const {
	Group,
	Membership,
	GroupImage,
	Event,
	Attendance,
	EventImage,
	User,
	Venue
} = require("../../db/models");

const router = express.Router();

router.get("/", async (req, res, next) => {
	const Groups = await Group.findAll({});
	res.json({ Groups });
});

module.exports = router;
