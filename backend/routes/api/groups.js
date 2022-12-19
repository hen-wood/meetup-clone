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
	const Groups = userJoinedGroups.concat(userOrganizedGroups);

	for (let group of Groups) {
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

	res.json({ Groups });
});

// Get details of a group based on its ID
router.get("/:groupId", async (req, res, next) => {
	const { groupId } = req.params;
	let groupDetails = await Group.findByPk(groupId, {
		include: [
			{
				model: GroupImage
			},
			{
				model: User,
				as: "Organizer",
				attributes: ["id", "firstName", "lastName"]
			},
			{
				model: Venue
			}
		]
	});
	if (groupDetails) {
		groupDetails = groupDetails.toJSON();
		const numMembers = await Membership.count({
			where: {
				groupId
			}
		});
		groupDetails.numMembers = numMembers;
		res.json(groupDetails);
	} else {
		const err = new Error("Group couldn't be found");
		err.status = 404;
		next(err);
	}
});

// Get all groups, include aggregate data for number of members in each group, and the groups preview image url
router.get("/", async (req, res, next) => {
	const Groups = await Group.findAll({
		raw: true
	});
	for (let group of Groups) {
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
	res.json({ Groups });
});

// Error handler for when Group cannot be found by id
router.use((err, _req, res, next) => {
	if (err.message === "Group couldn't be found") {
		res.status(err.status);
		res.json({
			message: err.message,
			statusCode: err.status
		});
	} else {
		next(err);
	}
});

module.exports = router;
