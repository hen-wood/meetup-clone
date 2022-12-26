// backend/utils/authentication.js
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
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
const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
	// Create the token.
	const token = jwt.sign(
		{ data: user.toSafeObject() },
		secret,
		{ expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
	);

	const isProduction = process.env.NODE_ENV === "production";

	// Set the token cookie
	res.cookie("token", token, {
		maxAge: expiresIn * 1000, // maxAge in milliseconds
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction && "Lax"
	});

	return token;
};

const restoreUser = (req, res, next) => {
	// token parsed from cookies
	const { token } = req.cookies;
	req.user = null;

	return jwt.verify(token, secret, null, async (err, jwtPayload) => {
		if (err) {
			return next();
		}

		try {
			const { id } = jwtPayload.data;
			req.user = await User.scope("currentUser").findByPk(id);
		} catch (e) {
			res.clearCookie("token");
			return next();
		}

		if (!req.user) res.clearCookie("token");

		return next();
	});
};

const requireAuthentication = async (req, _res, next) => {
	if (req.user) return next();

	const err = new Error("Authentication required");
	err.status = 401;
	return next(err);
};

const requireAuthorization = () => {
	const err = new Error("Forbidden");
	err.status = 403;
	return err;
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

const checkIfVenueDoesNotExist = async (req, res, next) => {
	const venueExists = await Venue.findByPk(req.params.venueId);
	if (!venueExists) {
		const err = new Error("Venue couldn't be found");
		err.status = 404;
		return next(err);
	} else {
		return next();
	}
};

const checkIfEventImageDoesNotExist = async (req, res, next) => {
	const { imageId } = req.params;
	const imageToDelete = await EventImage.findByPk(imageId);
	if (!imageToDelete) {
		const err = new Error("Event Image couldn't be found");
		err.status = 404;
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

const checkIfMembershipExists = async (req, res, next) => {
	const { groupId } = req.params;
	const userId = req.user.id;
	const existingMembership = await Membership.findOne({
		where: {
			[Op.and]: [{ groupId }, { userId }]
		}
	});

	if (existingMembership) {
		const err = new Error();
		err.status = 400;
		if (existingMembership.status === "pending") {
			err.message = "Membership has already been requested";
		} else {
			err.message = "User is already a member of the group";
		}
		return next(err);
	} else {
		return next();
	}
};

const checkIfMembershipDoesNotExist = async (req, res, next) => {
	const { groupId } = req.params;
	const { memberId } = req.body;
	const existingMembership = await Membership.findOne({
		where: { [Op.and]: [{ userId: memberId }, { groupId }] }
	});

	if (!existingMembership) {
		const err = new Error();
		err.status = 404;
		err.message = "Membership does not exist for this user";
		return next(err);
	}
	return next();
};

const checkIfAttendanceDoesNotExist = async (req, res, next) => {
	const { eventId } = req.params;
	const { userId } = req.body;
	const event = await Event.findByPk(eventId, {
		include: {
			model: User,
			as: "Attendees",
			through: {
				where: {
					userId
				}
			}
		}
	});
	if (!event.Attendees.length) {
		const err = new Error();
		err.status = 404;
		err.message = "Attendance between the user and the event does not exist";
		return next(err);
	}
	return next();
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

const checkIfGroupDoesNotExist = async (req, res, next) => {
	const { groupId } = req.params;
	const groupExists = await Group.findByPk(groupId);
	if (!groupExists) {
		const err = new Error("Group couldn't be found");
		err.status = 404;
		return next(err);
	}
	return next();
};
const checkIfEventDoesNotExist = async (req, res, next) => {
	const { eventId } = req.params;
	const eventExists = await Event.findByPk(eventId);
	if (!eventExists) {
		const err = new Error("Event couldn't be found");
		err.status = 404;
		return next(err);
	}
	return next();
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

const checkIfAttendanceRequestAlreadyExists = async (req, res, next) => {
	const { eventId } = req.params;
	const userId = req.user.id;
	const attendanceRequest = await Attendance.findOne({
		where: {
			eventId,
			userId
		}
	});

	if (attendanceRequest) {
		const err = new Error();
		err.status = 400;
		if (attendanceRequest.status === "pending") {
			err.message = "Attendance has already been requested";
		} else {
			err.message = "User is already an attendee of the event";
		}
		return next(err);
	}
	return next();
};

module.exports = {
	setTokenCookie,
	restoreUser,
	requireAuthentication,
	requireAuthorization,
	checkIfUserAlreadyExists,
	checkIfMembershipExists,
	checkIfGroupDoesNotExist,
	requireOrganizerOrCoHost,
	requireOrganizerOrCoHostToEditVenue,
	requireOrganizerOrCoHostOrIsUser,
	requireOrganizerOrCoHostForEvent,
	requireOrganizerOrCoHostOrAttendeeForEvent,
	checkIfMembershipDoesNotExist,
	checkIfEventDoesNotExist,
	checkIfUserIsNotMemberOfEventGroup,
	checkIfAttendanceRequestAlreadyExists,
	checkIfAttendanceDoesNotExist,
	requireOrganizerOrCohostOrIsUserToDeleteAttendance,
	requireOrganizerOrCoHostForEventImage,
	checkIfEventImageDoesNotExist,
	checkIfVenueDoesNotExist
};
