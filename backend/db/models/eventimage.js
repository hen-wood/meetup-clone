"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class EventImage extends Model {
		static associate(models) {
			EventImage.belongsTo(models.Event, {
				foreignKey: "eventId",
				onDelete: "CASCADE"
			});
		}
	}
	EventImage.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			eventId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Events"
				},
				onDelete: "CASCADE",
				allowNull: false
			},
			url: {
				type: DataTypes.STRING,
				allowNull: false
			},
			preview: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "EventImage"
		}
	);
	return EventImage;
};
