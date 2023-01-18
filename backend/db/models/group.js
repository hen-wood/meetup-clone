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
				foreignKey: "groupId"
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
				type: DataTypes.TEXT,
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
			modelName: "Group"
		}
	);
	return Group;
};
// memberships and all events and all events
