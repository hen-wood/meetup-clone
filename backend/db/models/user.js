"use strict";
const bcrypt = require("bcryptjs");
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		toSafeObject() {
			const { firstName, lastName, id, username, email, profileImageUrl } =
				this;
			return { firstName, lastName, id, username, email, profileImageUrl };
		}
		validatePassword(password) {
			return bcrypt.compareSync(password, this.hashedPassword.toString());
		}

		static async getCurrentUserById(id) {
			return await User.scope("currentUser").findByPk(id);
		}

		static async login({ credential, password }) {
			const { Op } = require("sequelize");
			const user = await User.scope("loginUser").findOne({
				where: {
					[Op.or]: {
						username: credential,
						email: credential
					}
				}
			});
			if (user && user.validatePassword(password)) {
				return await User.scope("currentUser").findByPk(user.id);
			}
		}

		static async signup({
			firstName,
			lastName,
			username,
			email,
			password,
			profileImageUrl
		}) {
			const hashedPassword = bcrypt.hashSync(password);
			const user = await User.create({
				firstName,
				lastName,
				username,
				email,
				profileImageUrl,
				hashedPassword
			});
			return await User.scope("currentUser").findByPk(user.id);
		}

		static associate(models) {
			User.belongsToMany(models.Group, {
				through: models.Membership,
				foreignKey: "userId",
				otherKey: "groupId",
				as: "Members",
				onDelete: "CASCADE"
			});
			User.belongsToMany(models.Event, {
				through: models.Attendance,
				foreignKey: "userId",
				otherKey: "eventId",
				as: "Attendees",
				onDelete: "CASCADE"
			});
			User.hasMany(models.Membership, {
				foreignKey: "userId",
				onDelete: "CASCADE"
			});
			User.hasMany(models.Group, {
				foreignKey: "organizerId",
				as: "Organizer"
			});
		}
	}

	User.init(
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [4, 30],
					isNotEmail(value) {
						if (Validator.isEmail(value)) {
							throw new Error("Cannot be an email.");
						}
					}
				}
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [3, 256],
					isEmail: true
				}
			},
			profileImageUrl: {
				type: DataTypes.STRING
			},
			hashedPassword: {
				type: DataTypes.STRING.BINARY,
				allowNull: false,
				validate: {
					len: [60, 60]
				}
			}
		},
		{
			sequelize,
			modelName: "User",
			defaultScope: {
				attributes: {
					exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
				}
			},
			scopes: {
				currentUser: {
					attributes: { exclude: ["hashedPassword"] }
				},
				loginUser: {
					attributes: {}
				}
			}
		}
	);
	return User;
};
