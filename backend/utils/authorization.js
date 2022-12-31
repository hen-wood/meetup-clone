// backend/utils/authenticationorization.js
const {
	User,
	Group,
	Membership,
	Event,
	Attendance,
	EventImage,
	Venue
} = require("../db/models");
const { Op } = require("sequelize");

const requireAuthorization = () => {
	const err = new Error("Forbidden");
	err.status = 403;
	return err;
};

const requireOrganizerForGroup = async (req, res, next) => {
	const { groupId } = req.params;
	const group = await Group.findByPk(groupId, { attributes: ["organizerId"] });
	const isOrganizer = group.organizerId == req.user.id;
	if (isOrganizer) {
		return next();
	} else {
		const err = new Error("Forbidden, must be group organizer");
		err.status = 403;
		return next(err);
	}
};

const requireOrganizerOrCoHost = async (req, res, next) => {
	const { groupId } = req.params;
	const { status } = req.body;
	const userId = req.user.id;
	const group = await Group.findByPk(groupId);

	const userMembership = await Membership.findOne({
		where: {
			[Op.and]: [{ groupId }, { userId }]
		}
	});

	if (
		group.organizerId === userId ||
		(userMembership &&
			userMembership.status === "co-host" &&
			status === "member")
	) {
		return next();
	}
	const err = new Error("Forbidden");
	err.status = 403;
	return next(err);
};

const requireOrganizerOrCoHostForGroup = async (req, res, next) => {
	const { groupId } = req.params;
	const currentUserId = req.user.id;

	const group = await Group.scope({
		method: ["singleGroupWithMemberships", currentUserId]
	}).findByPk(groupId);

	const authorized =
		group.organizerId == currentUserId || group.Memberships.length > 0;
	if (authorized) {
		return next();
	} else {
		const err = new Error(
			"Forbidden, must be group organizer or member with a status of 'co-host'"
		);
		err.status = 403;
		return next(err);
	}
};

const requireCorrectUserPermissionsToEditMembership = async (
	req,
	res,
	next
) => {
	const { groupId } = req.params;
	const currentUserId = req.user.id;
	const { status } = req.body;

	const group = await Group.findByPk(groupId, {
		include: {
			model: Membership,
			as: "Memberships",
			where: { [Op.and]: [{ userId: currentUserId }, { status: "co-host" }] },
			required: false
		}
	});

	if (group.organizerId == currentUserId) return next();

	const err = new Error();
	err.status = 403;

	if (group.Memberships.length > 0) {
		if (status == "member") {
			return next();
		} else {
			err.message = "Must be group organizer to change status to 'co-host'";
			return next(err);
		}
	}
	err.message = "Must be group organizer or co-host to change member status";
	return next(err);
};

const requireOrganizerOrCoHostOrIsUserToDeleteMember = async (
	req,
	res,
	next
) => {
	const { groupId } = req.params;
	const { memberId } = req.body;
	const currentUserId = req.user.id;

	const group = await Group.findByPk(groupId, {
		include: {
			model: Membership,
			as: "Memberships",
			where: { [Op.and]: [{ userId: currentUserId }, { status: "co-host" }] },
			required: false
		}
	});

	const isOrganizer = group.organizerId == currentUserId;
	const isCohost = group.Memberships.length > 0;
	const isUser = currentUserId === memberId;

	if (isCohost || isOrganizer || isUser) {
		return next();
	}

	const err = new Error(
		"Forbidden, must be group organizer, co-host, or user being deleted"
	);
	err.status = 403;
	return next(err);
};

const requireOrganizerOrCoHostForEvent = async (req, res, next) => {
	const { eventId } = req.params;
	const userId = req.user.id;
	const userOrganizer = await Group.findOne({
		where: { organizerId: userId },
		include: { model: Event, where: { id: eventId }, attributes: [] },
		attributes: ["id"]
	});

	const group = await Group.findOne({
		include: {
			model: Event,
			where: { id: eventId }
		}
	});

	const userCohost = await Membership.findOne({
		where: {
			[Op.and]: [{ userId }, { status: "co-host" }, { groupId: group.id }]
		}
	});

	if (!(userOrganizer && userCohost)) {
		const err = new Error("Forbidden");
		err.status = 403;
		return next(err);
	}
	return next();
};
const requireOrganizerOrCoHostForEventImage = async (req, res, next) => {
	const { imageId } = req.params;
	const userId = req.user.id;
	const event = await EventImage.findOne({
		where: {
			id: imageId
		},
		include: {
			model: Event,
			include: {
				model: Group,
				include: { model: Membership, where: { userId, status: "co-host" } }
			}
		}
	});
	const isOrganizer =
		event.Event.Group && event.Event.Group.organizerId === userId;
	const isCoHost =
		event.Event.Group && event.Event.Group.Memberships.length === 1;

	if (!(isOrganizer || isCoHost)) {
		const err = new Error("Forbidden");
		err.status = 403;
		return next(err);
	}
	return next();
};

const requireOrganizerOrCoHostOrAttendeeForEvent = async (req, res, next) => {
	const { eventId } = req.params;
	const userId = req.user.id;
	const userOrganizer = await Group.findOne({
		where: { organizerId: userId },
		include: { model: Event, where: { id: eventId }, attributes: [] },
		attributes: ["id"]
	});

	const group = await Group.findOne({
		include: {
			model: Event,
			where: { id: eventId }
		}
	});

	const userCohost = await Membership.findOne({
		where: {
			[Op.and]: [{ userId }, { status: "co-host" }, { groupId: group.id }]
		}
	});

	const isAttendee = await Attendance.findOne({
		where: { eventId, userId, [Op.not]: { status: "pending" } }
	});
	console.log(!!isAttendee);

	if (!(userOrganizer && userCohost && isAttendee)) {
		const err = new Error("Forbidden");
		err.status = 403;
		return next(err);
	}
	return next();
};

const requireOrganizerOrCohostOrIsUserToDeleteAttendance = async (
	req,
	res,
	next
) => {
	const { eventId } = req.params;
	const userId = req.user.id;
	const { userToDeleteId } = req.body;
	const userOrganizer = await Group.findOne({
		where: { organizerId: userId },
		include: { model: Event, where: { id: eventId }, attributes: [] },
		attributes: ["id"]
	});

	const group = await Group.findOne({
		include: {
			model: Event,
			where: { id: eventId }
		}
	});

	const userCohost = await Membership.findOne({
		where: {
			userId,
			status: "co-host",
			groupId: group.id
		}
	});

	const isUser = userId === userToDeleteId;

	if (!(userOrganizer || userCohost || isUser)) {
		const err = new Error(
			"Only the User or organizer/co-host may delete an Attendance"
		);
		err.status = 403;
		return next(err);
	}
	return next();
};

const requireOrganizerOrCoHostToEditVenue = async (req, res, next) => {
	const userId = req.user.id;
	const { venueId } = req.params;
	const venue = await Venue.findOne({
		where: { id: venueId },
		include: {
			model: Group,
			include: {
				model: User,
				as: "Members",
				where: { id: userId },
				through: {
					where: {
						status: "co-host"
					}
				}
			}
		}
	});

	const isAuthorized =
		venue.Group.organizerId == userId || venue.Group.Members.length > 0;

	if (isAuthorized) {
		return next();
	} else {
		const err = new Error("Forbidden");
		err.status = 403;
		return next(err);
	}
};

const requireOrganizerOrCoHostOrIsUser = async (req, res, next) => {
	const { groupId } = req.params;
	const { memberId } = req.body;
	const currentUserId = req.user.id;

	const isCohost = await Membership.findOne({
		where: {
			[Op.and]: [{ groupId }, { userId: currentUserId }, { status: "co-host" }]
		}
	});

	const isOrganizer = await Group.findOne({
		where: { [Op.and]: [{ organizerId: currentUserId }, { id: groupId }] }
	});

	const isUser = currentUserId === memberId;

	if (isCohost || isOrganizer || isUser) {
		return next();
	}

	const err = new Error("Forbidden");
	err.status = 403;
	return next(err);
};

const checkIfUserAlreadyExists = async (req, res, next) => {
	const { email } = req.body;
	let existingUser;
	if (email) {
		existingUser = await User.findOne({
			where: {
				email
			}
		});
	}
	if (existingUser) {
		const err = new Error("User with that email already exists");
		err.status = 403;
		return next(err);
	}
	next();
};

const checkIfUserIsNotMemberOfEventGroup = async (req, res, next) => {
	const userId = req.user.id;
	const { eventId } = req.params;
	const isMember = await Event.findByPk(eventId, {
		include: {
			model: Group,
			include: {
				model: User,
				as: "Members",
				through: {
					where: {
						[Op.and]: [
							{
								status: {
									[Op.in]: ["member", "co-host"]
								}
							},
							{ userId }
						]
					}
				}
			}
		}
	});
	if (isMember.Group.Members.length) {
		return next();
	}
	const err = new Error("Forbidden");
	err.status = 403;
	return next(err);
};

module.exports = {
	requireAuthorization,
	checkIfUserAlreadyExists,
	checkIfUserIsNotMemberOfEventGroup,
	requireOrganizerForGroup,
	requireOrganizerOrCoHost,
	requireOrganizerOrCoHostForGroup,
	requireOrganizerOrCoHostToEditVenue,
	requireCorrectUserPermissionsToEditMembership,
	requireOrganizerOrCoHostOrIsUserToDeleteMember,
	requireOrganizerOrCoHostOrIsUser,
	requireOrganizerOrCoHostForEvent,
	requireOrganizerOrCoHostOrAttendeeForEvent,
	requireOrganizerOrCohostOrIsUserToDeleteAttendance,
	requireOrganizerOrCoHostForEventImage
};
