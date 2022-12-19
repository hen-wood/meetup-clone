"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "Groups";
		return queryInterface.bulkInsert(
			options,
			[
				{
					organizerId: 1,
					name: "Demo Group 1",
					about:
						"Demo description 1 01234567890123456789012345678901234567890123456789",
					type: "Online",
					private: false,
					city: "Seattle",
					state: "WA"
				},
				{
					organizerId: 2,
					name: "Demo Group 2",
					about:
						"Demo description 2. 01234567890123456789012345678901234567890123456789",
					type: "Online",
					private: false,
					city: "New York",
					state: "NY"
				},
				{
					organizerId: 3,
					name: "Demo Group 3",
					about:
						"Demo description 3 01234567890123456789012345678901234567890123456789",
					type: "Online",
					private: false,
					city: "Los Angeles",
					state: "CA"
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "Groups";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				organizerId: { [Op.in]: [1, 2, 3] }
			},
			{}
		);
	}
};
