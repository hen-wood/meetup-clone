"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "Events";
		return queryInterface.bulkInsert(
			options,
			[
				{
					venueId: 1,
					groupId: 1,
					name: "Skydiving with our dogs",
					type: "In person",
					capacity: 10,
					price: 18.5,
					description: "We will be teaching our dogs how to skydive.",
					startDate: "2023-02-12 18:45:00",
					endDate: "2023-02-12 19:45:00"
				},
				{
					venueId: 1,
					groupId: 1,
					name: "Skydiving",
					type: "In person",
					capacity: 10,
					price: 18.5,
					description: "Just plain skydiving without dogs.",
					startDate: "2023-06-19 08:00:00",
					endDate: "2023-06-19 14:00:00"
				},
				{
					venueId: 2,
					groupId: 2,
					name: "NYC Chess Inaugural Tournament",
					type: "Online",
					capacity: 10,
					price: 18.5,
					description:
						"The first meet and greet for our group! Come say goodbye!",
					startDate: "2021-11-19 20:00:00",
					endDate: "2021-11-19 22:00:00"
				},
				{
					venueId: 3,
					groupId: 3,
					name: "Book Club First Meet and Greet",
					type: "Online",
					capacity: 10,
					price: 18.5,
					description:
						"The first meet and greet for our group! Come say nothing at all!",
					startDate: "2021-11-19 20:00:00",
					endDate: "2021-11-19 22:00:00"
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "Events";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				groupId: { [Op.in]: [1, 2, 3] }
			},
			{}
		);
	}
};
