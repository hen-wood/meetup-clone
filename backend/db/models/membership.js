"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Membership extends Model {
		static associate(models) {
			Membership.belongsTo(models.User, {
				onDelete: "CASCADE"
			});
			Membership.belongsTo(models.Group, {
				onDelete: "CASCADE"
			});
		}
	}
	Membership.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users"
				},
				onDelete: "CASCADE",
				allowNull: false
			},
			groupId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Groups"
				},
				onDelete: "CASCADE",
				allowNull: false
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Membership"
		}
	);
	return Membership;
};
