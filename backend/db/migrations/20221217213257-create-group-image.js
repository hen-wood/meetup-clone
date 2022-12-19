"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"GroupImages",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				groupId: {
					type: Sequelize.INTEGER,
					references: {
						model: "Groups"
					},
					onDelete: "CASCADE",
					allowNull: false
				},
				url: {
					type: Sequelize.STRING,
					allowNull: false
				},
				preview: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
				}
			},
			options
		);
	},
	async down(queryInterface, Sequelize) {
		options.tableName = "GroupImages";
		await queryInterface.dropTable(options);
	}
};
