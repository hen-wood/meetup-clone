"use strict";
const { Model } = require("sequelize");
const Membership = require("./membership");
module.exports = (sequelize, DataTypes) => {
	class Group extends Model {
		static associate(models) {
			Group.belongsTo(models.User, {
				foreignKey: "organizerId",
				as: "Organizer",
				onDelete: "CASCADE"
			});
			Group.belongsToMany(models.User, {
				through: models.Membership,
				foreignKey: "groupId",
				otherKey: "userId",
				as: "Members",
				onDelete: "CASCADE"
			});
			Group.hasMany(models.Membership, {
				onDelete: "CASCADE",
				foreignKey: "groupId",
				as: "Memberships"
			});
			Group.hasMany(models.GroupImage, {
				foreignKey: "groupId",
				onDelete: "CASCADE"
			});

			Group.hasMany(models.Venue, {
				foreignKey: "groupId",
				onDelete: "CASCADE"
			});
			Group.hasMany(models.Event, {
				foreignKey: "groupId",
				onDelete: "CASCADE"
			});
		}
	}
	Group.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			organizerId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users"
				},
				allowNull: false,
				onDelete: "CASCADE"
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isLessThanSixtyCharacters(value) {
						if (value.length > 60) {
							throw new Error("Name must be 60 characters or less");
						}
					}
				}
			},
			about: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isGreaterThanFiftyCharacters(value) {
						if (value.length < 50) {
							throw new Error("About must be 50 characters or more");
						}
					}
				}
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isIn: {
						args: [["Online", "In person"]],
						msg: "Type must be 'Online' or 'In person'"
					}
				}
			},
			private: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			},
			city: {
				type: DataTypes.STRING,
				allowNull: false
			},
			state: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Group",
			scopes: {
				allGroups() {
					const { Membership, GroupImage } = require("../models");
					const { Op } = require("sequelize");
					return {
						attributes: {
							include: [
								[
									sequelize.fn("COUNT", sequelize.col("Memberships.id")),
									"numMembers"
								],
								[sequelize.col("GroupImages.url"), "previewImage"]
							]
						},
						include: [
							{
								model: Membership,
								attributes: [],
								as: "Memberships",
								where: { status: { [Op.in]: ["member", "co-host"] } }
							},
							{
								model: GroupImage,
								attributes: [],
								where: {
									preview: true
								},
								required: false
							}
						],
						group: ["Group.id", "GroupImages.url", "Memberships.id"]
					};
				},
				currentUserGroups(userId) {
					const { Membership, GroupImage, User } = require("../models");
					const { Op } = require("sequelize");
					return {
						attributes: {
							include: [
								[
									sequelize.fn("COUNT", sequelize.col("Memberships.id")),
									"numMembers"
								],
								[sequelize.col("GroupImages.url"), "previewImage"]
							]
						},
						include: [
							{
								model: Membership,
								attributes: [],
								as: "Memberships",
								where: { status: { [Op.in]: ["member", "co-host"] } }
							},
							{
								model: User,
								as: "Members",
								through: {
									where: {
										[Op.and]: [
											{ userId: userId },
											{ status: { [Op.in]: ["member", "co-host"] } }
										]
									}
								},
								required: true,
								attributes: []
							},
							{
								model: GroupImage,
								attributes: [],
								where: {
									preview: true
								},
								required: false
							}
						],
						group: [
							"Group.id",
							"GroupImages.url",
							"Members.Membership.id",
							"Memberships.id"
						]
					};
				},
				singleGroup() {
					const { Membership, GroupImage, User, Venue } = require("../models");
					const { Op } = require("sequelize");
					return {
						attributes: {
							include: [
								[
									sequelize.fn("COUNT", sequelize.col("Memberships.id")),
									"numMembers"
								]
							]
						},
						include: [
							{
								model: Membership,
								attributes: [],
								as: "Memberships",
								where: { status: { [Op.in]: ["member", "co-host"] } }
							},
							{
								model: GroupImage,
								attributes: ["id", "url", "preview"],
								required: false
							},
							{
								model: User,
								as: "Organizer",
								attributes: ["id", "firstName", "lastName"]
							},
							{
								model: Venue,
								attributes: {
									exclude: ["createdAt", "updatedAt"]
								}
							}
						],
						group: [
							"Group.id",
							"Venues.id",
							"GroupImages.url",
							"Memberships.id"
						]
					};
				},
				singleGroupWithMemberships(currentUserId) {
					const { Membership } = require("../models");
					const { Op } = require("sequelize");
					return {
						include: {
							model: Membership,
							as: "Memberships",
							where: {
								[Op.and]: [{ userId: currentUserId }, { status: "co-host" }]
							},
							required: false
						}
					};
				}
			}
		}
	);
	return Group;
};
// memberships and all events and all events
