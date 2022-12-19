"use strict";
const { Model } = require("sequelize");
const Membership = require("./membership");
module.exports = (sequelize, DataTypes) => {
	class Group extends Model {
		static associate(models) {
			Group.belongsTo(models.User, {
				foreignKey: "organizerId",
				as: "Organizer"
			});
			Group.belongsToMany(models.User, {
				through: models.Membership,
				foreignKey: "groupId",
				otherKey: "userId"
			});
			Group.hasMany(models.Membership);
			Group.hasMany(models.GroupImage, {
				foreignKey: "groupId"
			});
			Group.belongsToMany(models.Venue, {
				through: models.Event,
				foreignKey: "groupId",
				otherKey: "venueId"
			});
			Group.hasMany(models.Venue, {
				foreignKey: "groupId"
			});
		}
	}
	Group.init(
		{
			organizerId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users"
				},
				allowNull: false
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
			modelName: "Group"
		}
	);
	return Group;
};
