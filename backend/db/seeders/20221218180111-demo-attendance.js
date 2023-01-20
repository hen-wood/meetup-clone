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
				// Skydiving Event#1 1

				// Creator
				{
					userId: 1,
					eventId: 1,
					status: "attending"
				},
				// Other Attendees
				{
					userId: 9,
					eventId: 1,
					status: "attending"
				},
				{
					userId: 10,
					eventId: 1,
					status: "attending"
				},
				{
					userId: 11,
					eventId: 1,
					status: "attending"
				},

				// Skydiving Event#2 2

				// Creator
				{
					userId: 1,
					eventId: 2,
					status: "attending"
				},
				// Other Attendees
				{
					userId: 9,
					eventId: 2,
					status: "attending"
				},
				{
					userId: 10,
					eventId: 2,
					status: "attending"
				},
				{
					userId: 11,
					eventId: 2,
					status: "attending"
				},

				// Chess Event 3

				// Creator
				{
					userId: 2,
					eventId: 3,
					status: "attending"
				},
				// Other Attendees
				{
					userId: 6,
					eventId: 3,
					status: "attending"
				},
				{
					userId: 7,
					eventId: 3,
					status: "attending"
				},
				{
					userId: 8,
					eventId: 3,
					status: "attending"
				},

				// Book Club Event 4

				// Creator
				{
					userId: 3,
					eventId: 4,
					status: "attending"
				},
				// Other Attendees
				{
					userId: 1,
					eventId: 4,
					status: "attending"
				},
				{
					userId: 2,
					eventId: 4,
					status: "attending"
				},
				{
					userId: 4,
					eventId: 4,
					status: "attending"
				},
				{
					userId: 5,
					eventId: 4,
					status: "attending"
				},
				{
					userId: 6,
					eventId: 4,
					status: "attending"
				},

				// Surf Event 5

				// Creator
				{
					userId: 4,
					eventId: 5,
					status: "attending"
				},
				// Other Attendees
				{
					userId: 1,
					eventId: 5,
					status: "attending"
				},
				{
					userId: 3,
					eventId: 5,
					status: "attending"
				},
				{
					userId: 9,
					eventId: 5,
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
