"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "Attendances";
		return queryInterface.bulkInsert(
			options,
			[
				{
					userId: 1,
					eventId: 1,
					status: "attending"
				},
				{
					userId: 2,
					eventId: 1,
					status: "attending"
				},
				{
					userId: 3,
					eventId: 1,
					status: "attending"
				},
				{
					userId: 1,
					eventId: 2,
					status: "attending"
				},
				{
					userId: 2,
					eventId: 2,
					status: "attending"
				},
				{
					userId: 3,
					eventId: 2,
					status: "attending"
				},
				{
					userId: 1,
					eventId: 3,
					status: "attending"
				},
				{
					userId: 2,
					eventId: 3,
					status: "attending"
				},
				{
					userId: 3,
					eventId: 3,
					status: "attending"
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "Attendances";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				userId: { [Op.in]: [1, 2, 3] }
			},
			{}
		);
	}
};
