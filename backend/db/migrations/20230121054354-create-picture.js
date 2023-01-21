"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Pictures", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			key: {
				type: Sequelize.STRING
			},
			userId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Users"
				},
				onDelete: "CASCADE"
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Pictures");
	}
};
