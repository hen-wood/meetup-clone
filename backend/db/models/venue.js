"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Venue extends Model {
		static associate(models) {
			Venue.belongsTo(models.Group, {
				foreignKey: "groupId",
				onDelete: "CASCADE"
			});

			Venue.hasMany(models.Event, {
				foreignKey: "venueId",
				onDelete: "SET NULL"
			});
		}
	}
	Venue.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			groupId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Groups"
				},
				onDelete: "CASCADE",
				allowNull: false
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false
			},
			city: {
				type: DataTypes.STRING,
				allowNull: false
			},
			state: {
				type: DataTypes.STRING,
				allowNull: false
			},
			lat: {
				type: DataTypes.DECIMAL,
				allowNull: false
			},
			lng: {
				type: DataTypes.DECIMAL,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Venue",
			defaultScope: {
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				}
			}
		}
	);
	return Venue;
};
