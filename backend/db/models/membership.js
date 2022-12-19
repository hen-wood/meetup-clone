"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Membership extends Model {
		static associate(models) {
			Membership.belongsTo(models.User);
			Membership.belongsTo(models.Group);
		}
	}
	Membership.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users"
				},
				allowNull: false
			},
			groupId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Groups"
				},
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
