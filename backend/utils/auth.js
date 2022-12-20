// backend/utils/auth.js
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User, Group, Membership } = require("../db/models");
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

const checkIfUserExists = async (req, res, next) => {
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

const checkIfGroupExists = async (req, res, next) => {
	const { groupId } = req.params;
	const groupExists = await Group.findByPk(groupId);
	if (!groupExists) {
		const err = new Error("Group couldn't be found");
		err.status = 404;
		return next(err);
	}
	next();
};

module.exports = {
	setTokenCookie,
	restoreUser,
	requireAuthentication,
	requireAuthorization,
	checkIfUserExists,
	checkIfMembershipExists,
	checkIfGroupExists,
	requireOrganizerOrCoHost
};
