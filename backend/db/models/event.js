"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		static associate(models) {
			Event.belongsToMany(models.User, {
				through: models.Attendance,
				foreignKey: "eventId",
				otherKey: "userId",
				as: "Attendees",
				onDelete: "CASCADE"
			});
			Event.belongsTo(models.Group, {
				foreignKey: "groupId",
				onDelete: "CASCADE"
			});
			Event.belongsTo(models.Venue, {
				foreignKey: "venueId",
				onDelete: "SET NULL"
			});
			Event.hasMany(models.EventImage, {
				foreignKey: "eventId"
			});
		}
	}
	Event.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			venueId: {
				type: DataTypes.INTEGER,
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
				type: DataTypes.DECIMAL,
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
			modelName: "Event",
			defaultScope: {
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				}
			}
		}
	);
	return Event;
};
