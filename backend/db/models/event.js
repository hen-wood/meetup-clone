"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		static associate(models) {}
	}
	Event.init(
		{
			venueId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Venues"
				}
			},
			groupId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Groups"
				}
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false
			},
			capacity: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			startDate: {
				type: DataTypes.DATE,
				allowNull: false
			},
			endDate: {
				type: DataTypes.DATE,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Event"
		}
	);
	return Event;
};
