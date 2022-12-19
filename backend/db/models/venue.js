"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Venue extends Model {
		static associate(models) {
			Venue.belongsTo(models.Group, {
				foreignKey: "groupId"
			});
			Venue.belongsToMany(models.Group, {
				through: models.Event,
				foreignKey: "venueId",
				otherKey: "groupId"
			});
		}
	}
	Venue.init(
		{
			groupId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Groups"
				},
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
			modelName: "Venue"
		}
	);
	return Venue;
};
