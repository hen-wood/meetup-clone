"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Picture extends Model {
		static associate(models) {
			Picture.belongsTo(models.User, {
				foreignKey: "userId",
				onDelete: "CASCADE"
			});
		}
	}
	Picture.init(
		{
			key: {
				type: DataTypes.STRING
			},
			userId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Users"
				},
				onDelete: "CASCADE",
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Picture"
		}
	);
	return Picture;
};
