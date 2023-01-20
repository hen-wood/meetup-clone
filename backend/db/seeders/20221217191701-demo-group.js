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
				// 1
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
				// 2
				{
					organizerId: 1,
					name: "A Rag Tag Group of Misfits and Bandits",
					about:
						"We are a motley crew of outcasts and ne'er-do-wells, united by our disdain for authority and our love of adventure.",
					type: "In person",
					private: true,
					city: "Tacoma",
					state: "WA"
				},
				// 3
				{
					organizerId: 1,
					name: "Cooking Club",
					about:
						"Discover new recipes and share your cooking skills. We welcome members of any skill level!",
					type: "Online",
					private: false,
					city: "Tacoma",
					state: "WA"
				},
				// 4
				{
					organizerId: 2,
					name: "New York Chess Club",
					about:
						"The NYC Chess Club is a community of chess enthusiasts that meets regularly to play, learn, and improve their skills.",
					type: "In person",
					private: false,
					city: "New York",
					state: "NY"
				},
				// 5
				{
					organizerId: 3,
					name: "Online Book Club",
					about:
						"The Online Book Club is a group of passionate readers who come together to discuss and explore different genres of literature.",
					type: "Online",
					private: false,
					city: "Los Angeles",
					state: "CA"
				},
				// 6
				{
					organizerId: 5,
					name: "Photography Group",
					about:
						"Learn and share photography techniques. All skill levels welcome!",
					type: "Online",
					private: false,
					city: "Chicago",
					state: "IL"
				},
				// 7
				{
					organizerId: 5,
					name: "Puzzle Solvers",
					about:
						"We love puzzles of all sorts! Join us and challenge your mind...",
					type: "Online",
					private: false,
					city: "Chicago",
					state: "IL"
				},
				// 8
				{
					organizerId: 4,
					name: "North Shore Surfers",
					about:
						"We love to surf! We welcome anyone who has a decent amount of experience.",
					type: "In person",
					private: true,
					city: "Haleiwa",
					state: "HI"
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
