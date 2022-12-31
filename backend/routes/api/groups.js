// backend/routes/api/groups.js
const express = require("express");
const {
	Group,
	Membership,
	GroupImage,
	Event,
	Attendance,
	User,
	Venue
} = require("../../db/models");
const { Op } = require("sequelize");
const {
	requireAuthentication,
	requireAuthorization,
	checkIfMembershipExists,
	checkIfGroupDoesNotExist,
	requireOrganizerOrCoHost,
	requireOrganizerOrCoHostOrIsUser,
	checkIfMembershipDoesNotExist
} = require("../../utils/authentication.js");
const {
	validateCreateGroup,
	validateEditGroup,
	validateCreateGroupVenue,
	validateCreateGroupEvent
} = require("../../utils/validation-chains");
const { notFound } = require("../../utils/not-found");
const {
	checkForValidStatus,
	checkIfUserDoesNotExist
} = require("../../utils/validation");
const {
	requireOrganizerOrCoHostToGetGroupVenues
} = require("../../utils/authorization");

const router = express.Router();

// Get all events of a group by group id
router.get(
	"/:groupId/events",
	checkIfGroupDoesNotExist,
	async (req, res, next) => {
		const { groupId } = req.params;

		const Events = await Event.scope({
			method: ["allEventsByGroup", groupId]
		}).findAll();

		res.json({ Events });
	}
);

// Get all members of a group by group id
router.get("/:groupId/members", async (req, res, next) => {
	const { groupId } = req.params;
	const isOrganizer = await Group.findOne({
		attributes: ["organizerId"],
		where: {
			[Op.and]: [{ organizerId: req.user.id }, { id: groupId }]
		}
	});

	let where = {};
	if (!isOrganizer) {
		where = {
			status: {
				[Op.ne]: "pending"
			}
		};
	}
	const group = await Group.findByPk(groupId, {
		attributes: [],
		include: {
			model: User,
			as: "Members",
			through: {
				attributes: {
					exclude: ["id", "userId", "groupId", "createdAt", "updatedAt"]
				},
				where
			},
			attributes: {
				exclude: [
					"username",
					"email",
					"hashedPassword",
					"createdAt",
					"updatedAt"
				]
			}
		}
	});

	if (!group) {
		return next(notFound("Group couldn't be found"));
	}

	res.json(group);
});

// Get all venues for a Group specified by its id
router.get(
	"/:groupId/venues",
	requireAuthentication,
	checkIfGroupDoesNotExist,
	requireOrganizerOrCoHostToGetGroupVenues,
	async (req, res, next) => {
		const { groupId } = req.params;
		const venues = await Group.findByPk(groupId, {
			attributes: [],
			include: {
				model: Venue,
				attributes: { exclude: ["createdAt", "updatedAt"] }
			}
		});
		return res.json(venues);
	}
);

// Get all groups created by or joined by current user
router.get("/current", requireAuthentication, async (req, res, next) => {
	const currUserId = req.user.id;
	const Groups = await Group.scope({
		method: ["currentUserGroups", currUserId]
	}).findAll();

	res.json({ Groups });
});

// Get details of a group based on its ID
router.get("/:groupId", checkIfGroupDoesNotExist, async (req, res, next) => {
	const { groupId } = req.params;
	const singleGroup = await Group.scope({ method: ["singleGroup"] }).findByPk(
		groupId
	);
	res.json(singleGroup);
});

// Get all groups, include aggregate data for number of members in each group, and the groups preview image url
router.get("/", async (req, res, next) => {
	const Groups = await Group.scope({
		method: ["allGroups"]
	}).findAll();

	res.json({ Groups });
});

// Request membership for a group by group id
router.post(
	"/:groupId/membership",
	requireAuthentication,
	checkIfMembershipExists,
	checkIfGroupDoesNotExist,
	async (req, res, next) => {
		const userId = req.user.id;
		const { groupId } = req.params;

		const newMember = await Membership.create({
			userId,
			groupId,
			status: "pending"
		});

		const resBody = {
			memberId: userId,
			status: newMember.status
		};

		return res.json(resBody);
	}
);

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
		await Membership.create({
			userId: req.user.id,
			groupId: newGroup.id,
			status: "co-host"
		});
		return res.json(newGroup);
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

// Create a new event for a group
router.post(
	"/:groupId/events",
	requireAuthentication,
	checkIfGroupDoesNotExist,
	requireOrganizerOrCoHostOrIsUser,
	validateCreateGroupEvent,
	async (req, res, next) => {
		const { groupId } = req.params;
		let {
			venueId,
			name,
			type,
			capacity,
			price,
			description,
			startDate,
			endDate
		} = req.body;

		if (!venueId) venueId = null;
		const newEvent = await Event.create({
			venueId,
			groupId: +groupId,
			name,
			type,
			capacity,
			price,
			description,
			startDate,
			endDate
		});

		await Attendance.create({
			eventId: newEvent.id,
			userId: req.user.id,
			status: "attending"
		});

		res.json({
			id: newEvent.id,
			venueId: newEvent.venueId,
			groupId: newEvent.groupId,
			name: newEvent.name,
			type: newEvent.type,
			capacity: newEvent.capacity,
			price: newEvent.price,
			description: newEvent.description,
			startDate: newEvent.startDate,
			endDate: newEvent.endDate
		});
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

// Change membership status by group id (memberId located in req.body)
router.put(
	"/:groupId/membership",
	requireAuthentication,
	checkIfGroupDoesNotExist,
	requireOrganizerOrCoHost,
	checkForValidStatus,
	async (req, res, next) => {
		const { groupId } = req.params;
		const { memberId, status } = req.body;

		const membershipToChange = await Membership.findOne({
			where: { [Op.and]: [{ userId: memberId }, { groupId }] }
		});

		membershipToChange.status = status;
		await membershipToChange.save();
		return res.json({
			id: membershipToChange.id,
			groupId: +groupId,
			memberId,
			status
		});
	}
);

// Delete a member
router.delete(
	"/:groupId/membership",
	requireAuthentication,
	checkIfGroupDoesNotExist,
	checkIfUserDoesNotExist,
	checkIfMembershipDoesNotExist,
	requireOrganizerOrCoHostOrIsUser,
	async (req, res, next) => {
		const { memberId } = req.body;
		const { groupId } = req.params;

		const memberToDelete = await Membership.findOne({
			where: { [Op.and]: [{ userId: memberId }, { groupId }] }
		});

		await memberToDelete.destroy();

		return res.json({
			message: "Successfully deleted membership from group"
		});
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
	return res.json({
		message: "Successfully deleted",
		statusCode: 200
	});
});

module.exports = router;
