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
const { check } = require("express-validator");
const { Op } = require("sequelize");
const {
	requireAuthentication,
	requireAuthorization,
	restoreUser
} = require("../../utils/auth");
const {
	validateCreateGroup,
	validateEditGroup,
	validateCreateGroupVenue
} = require("../../utils/validation-chains");
const { notFound } = require("../../utils/not-found");

const router = express.Router();

// Get all venues for a Group specified by its id
router.get(
	"/:groupId/venues",
	requireAuthentication,
	async (req, res, next) => {
		const { groupId } = req.params;
		const group = await Group.findByPk(groupId);
		if (!group) {
			return next(notFound("Group couldn't be found"));
		}
		const userMembership = await Membership.findOne({
			where: {
				[Op.and]: [{ userId: req.user.id }, { groupId }]
			}
		});
		if (
			(userMembership && userMembership.status === "co-host") ||
			group.organizerId === req.user.id
		) {
			const Venues = await Venue.findAll({
				where: {
					groupId
				}
			});
			res.json({ Venues });
		}
		return next(requireAuthorization());
	}
);

// Get all groups created by or joined by current user
router.get("/current", requireAuthentication, async (req, res, next) => {
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
		console.log("hello");
		if (previewImage) {
			group.previewImage = previewImage.url;
		} else {
			group.previewImage = null;
		}
		if (group.private === 0) group.private = false;
		if (group.private === 1) group.private = true;
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
		if (groupDetails.private === 0) groupDetails.private = false;
		if (groupDetails.private === 1) groupDetails.private = true;
		res.json(groupDetails);
	} else {
		next(notFound("Group couldn't be found"));
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
		if (!group.numMembers) group.numMembers = 0;
		const previewImage = await GroupImage.findOne({
			where: {
				[Op.and]: [{ preview: true }, { groupId: group.id }]
			},
			attributes: ["url"]
		});
		if (group && previewImage) {
			group.previewImage = previewImage.url;
		} else {
			group.previewImage = null;
		}
		if (group.private === 0) group.private = false;
		if (group.private === 1) group.private = true;
	}
	res.json({ Groups });
});

// Create an image for a group
router.post(
	"/:groupId/images",
	requireAuthentication,
	async (req, res, next) => {
		const { groupId } = req.params;
		const groupToAddImageTo = await Group.findByPk(groupId);
		if (!groupToAddImageTo) {
			return next(notFound("Group couldn't be found"));
		} else if (req.user.id !== groupToAddImageTo.organizerId) {
			return next(requireAuthorization());
		}
		const { url, preview } = req.body;
		const newGroupImage = await GroupImage.create({
			groupId,
			url,
			preview
		});
		const { id } = newGroupImage;

		res.json({ id, url, preview });
	}
);

// Create a new group
router.post(
	"/",
	requireAuthentication,
	validateCreateGroup,
	async (req, res, next) => {
		const { name, about, type, private, city, state } = req.body;
		const newGroup = await Group.create({
			organizerId: req.user.id,
			name,
			about,
			type,
			private,
			city,
			state
		});
		res.json(newGroup);
	}
);

// Create a new venue for a group
router.post(
	"/:groupId/venues",
	requireAuthentication,
	validateCreateGroupVenue,
	async (req, res, next) => {
		const { groupId } = req.params;
		const group = await Group.findByPk(groupId);
		if (!group) {
			return next(notFound("Group couldn't be found"));
		}
		const userMembership = await Membership.findOne({
			where: {
				[Op.and]: [{ userId: req.user.id }, { groupId }]
			}
		});
		if (
			(userMembership && userMembership.status === "co-host") ||
			group.organizerId === req.user.id
		) {
			const { address, city, state, lat, lng } = req.body;
			const newVenue = await Venue.create({
				groupId,
				address,
				city,
				state,
				lat,
				lng
			});
			const { id } = newVenue;
			return res.json({ id, groupId, address, city, state, lat, lng });
		}
		return next(requireAuthorization());
	}
);

// Edit a group
router.put(
	"/:groupId",
	requireAuthentication,
	validateEditGroup,
	async (req, res, next) => {
		const { groupId } = req.params;
		const { name, about, type, private, city, state } = req.body;

		const groupToEdit = await Group.findByPk(groupId);
		if (!groupToEdit) {
			return next(notFound("Group couldn't be found"));
		} else if (req.user.id !== groupToEdit.organizerId) {
			return next(requireAuthorization());
		}

		if (name) groupToEdit.name = name;
		if (about) groupToEdit.about = about;
		if (type) groupToEdit.type = type;
		if (private) groupToEdit.private = private;
		if (city) groupToEdit.city = city;
		if (state) groupToEdit.state = state;
		await groupToEdit.save();
		res.json(groupToEdit);
	}
);

// Delete a group
router.delete("/:groupId", requireAuthentication, async (req, res, next) => {
	const { groupId } = req.params;
	const groupToDelete = await Group.findByPk(groupId);
	if (!groupToDelete) {
		return next(notFound("Group couldn't be found"));
	}
	if (groupToDelete.organizerId !== req.user.id) {
		return next(requireAuthorization());
	}
	await groupToDelete.destroy();
	res.json({
		message: "Successfully deleted",
		statusCode: 200
	});
});

module.exports = router;
