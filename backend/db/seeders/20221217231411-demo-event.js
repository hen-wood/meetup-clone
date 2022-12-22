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
					name: "Tennis Group First Meet and Greet",
					type: "In person",
					capacity: 10,
					price: 18.5,
					description:
						"The first meet and greet for our group! Come say hello!",
					startDate: "2021-11-19 20:00:00",
					endDate: "2021-11-19 22:00:00"
				},
				{
					venueId: 1,
					groupId: 1,
					name: "Tennis Group meet 2: Electric Boogaloo",
					type: "In person",
					capacity: 10,
					price: 18.5,
					description: "The second meet and greet for our group!!",
					startDate: "2021-12-19 20:00:00",
					endDate: "2021-12-19 22:00:00"
				},
				{
					venueId: 2,
					groupId: 2,
					name: "soccer Group First Meet and Greet",
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
					name: "Hang-gliding Group First Meet and Greet",
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
