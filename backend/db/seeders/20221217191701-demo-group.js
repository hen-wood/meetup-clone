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
					name: "Washington Skydivers",
					about:
						"Washington State Skydiving Club is all inclusive to all levels of jumpers! The primary goal is to educate members.",
					type: "In person",
					private: false,
					city: "Tacoma",
					state: "WA"
				},
				{
					organizerId: 2,
					name: "New York Chess Club",
					about:
						"The NYC Chess Club is a community of chess enthusiasts that meets regularly to play, learn, and improve their skills.",
					type: "Online",
					private: false,
					city: "New York",
					state: "NY"
				},
				{
					organizerId: 3,
					name: "LA Book Club",
					about:
						"The Los Angeles Book Club is a group of passionate readers who come together to discuss and explore different genres of literature.",
					type: "Online",
					private: false,
					city: "Los Angeles",
					state: "CA"
				},
				{
					organizerId: 1,
					name: "A Rag Tag Group of Misfits and Bandits",
					about:
						"We are a motley crew of outcasts and ne'er-do-wells, united by our disdain for authority and our love of adventure.",
					type: "In person",
					private: true,
					city: "New Orleans",
					state: "LA"
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
