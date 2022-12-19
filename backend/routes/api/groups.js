// backend/routes/api/groups.js
const e = require("express");
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
const { Op } = require("sequelize");
const { restoreUser } = require("../../utils/auth");

const router = express.Router();

// Get all groups created by or joined by current user
router.get("/current", restoreUser, async (req, res, next) => {
	const userId = req.user.id;
	const userJoinedGroups = await Group.findAll({
		include: {
			model: Membership,
			where: {
				userId
			},
			attributes: []
		},
		raw: true
	});
	const userOrganizedGroups = await Group.findAll({
		where: {
			organizerId: userId
		},
		raw: true
	});
	const resBody = userJoinedGroups.concat(userOrganizedGroups);

	for (let group of resBody) {
		group.numMembers = await Membership.count({
			where: {
				groupId: group.id
			}
		});
		const previewImage = await GroupImage.findOne({
			where: {
				[Op.and]: [{ preview: true }, { groupId: group.id }]
			},
			attributes: ["url"]
		});
		group.previewImage = previewImage.url;
	}

	res.json(resBody);
});

// Get all groups, include aggregate data for number of members in each group, and the groups preview image url
router.get("/", async (req, res, next) => {
	const groups = await Group.findAll({
		raw: true
	});
	for (let group of groups) {
		group.numMembers = await Membership.count({
			where: {
				groupId: group.id
			}
		});
		const previewImage = await GroupImage.findOne({
			where: {
				[Op.and]: [{ preview: true }, { groupId: group.id }]
			},
			attributes: ["url"]
		});
		group.previewImage = previewImage.url;
	}
	res.json({ groups });
});

module.exports = router;
