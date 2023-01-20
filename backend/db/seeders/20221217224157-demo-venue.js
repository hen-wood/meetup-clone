"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "Venues";
		return queryInterface.bulkInsert(
			options,
			[
				// Skydiving
				{
					groupId: 1,
					address: "1234 Fakestreet",
					city: "Tacoma",
					state: "WA",
					lat: 47.621449,
					lng: -122.348455
				},
				// Chess
				{
					groupId: 4,
					address: "4321 Fakestreet",
					city: "New York",
					state: "NY",
					lat: 40.748954,
					lng: -73.985741
				},
				// Surfers
				{
					groupId: 3,
					address: "1243 Fakestreet",
					city: "Haleiwa",
					state: "HI",
					lat: 21.593884,
					lng: -158.108306
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "Venues";
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
