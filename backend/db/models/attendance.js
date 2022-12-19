"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Attendance extends Model {
		static associate(models) {}
	}
	Attendance.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users"
				},
				allowNull: false,
				onDelete: "CASCADE"
			},
			eventId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Events"
				},
				allowNull: false,
				onDelete: "CASCADE"
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Attendance"
		}
	);
	return Attendance;
};
