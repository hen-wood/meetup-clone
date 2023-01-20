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
				// Skydiving 1
				{
					venueId: 1,
					groupId: 1,
					name: "Skydiving with our dogs",
					type: "In person",
					capacity: 10,
					price: 150,
					description: "We will be teaching our dogs how to skydive.",
					startDate: "2023-02-12 18:45:00",
					endDate: "2023-02-12 19:45:00"
				},
				// Skydiving 2
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
				// Chess 3
				{
					venueId: 2,
					groupId: 4,
					name: "NYC Chess Inaugural Tournament",
					type: "Online",
					capacity: 100,
					price: 10,
					description: "Our first tournament",
					startDate: "2023-11-19 20:00:00",
					endDate: "2023-11-19 22:00:00"
				},
				// Book club 4
				{
					groupId: 5,
					name: "Book Club First Meet and Greet",
					type: "Online",
					capacity: 10,
					price: 0.0,
					description:
						"The first meet and greet for our group! Come talk about books!",
					startDate: "2023-11-19 20:00:00",
					endDate: "2023-11-19 22:00:00"
				},
				// Surf 5
				{
					groupId: 8,
					name: "Meet and Surf",
					type: "Online",
					capacity: 10,
					price: 0.0,
					description: "First meet and greet plus some surfing!",
					startDate: "2023-11-19 20:00:00",
					endDate: "2023-11-19 22:00:00"
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
