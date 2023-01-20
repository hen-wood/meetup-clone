"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "Memberships";
		return queryInterface.bulkInsert(
			options,
			[
				// Group Organizers

				// Skydiving
				{
					userId: 1,
					groupId: 1,
					status: "co-host"
				},
				// Misfits
				{
					userId: 1,
					groupId: 2,
					status: "co-host"
				},
				// Cooking
				{
					userId: 1,
					groupId: 3,
					status: "co-host"
				},
				// NYC chess
				{
					userId: 2,
					groupId: 4,
					status: "co-host"
				},
				// Book club
				{
					userId: 3,
					groupId: 5,
					status: "co-host"
				},
				// Photography
				{
					userId: 5,
					groupId: 6,
					status: "co-host"
				},
				// Puzzles
				{
					userId: 5,
					groupId: 7,
					status: "co-host"
				},
				// Surfers
				{
					userId: 4,
					groupId: 8,
					status: "co-host"
				},
				// Cooking club members (online), groupId 3 - Organized by userId 1
				{
					userId: 2,
					groupId: 3,
					status: "member"
				},
				{
					userId: 3,
					groupId: 3,
					status: "member"
				},
				{
					userId: 4,
					groupId: 3,
					status: "member"
				},
				{
					userId: 5,
					groupId: 3,
					status: "member"
				},
				{
					userId: 6,
					groupId: 3,
					status: "member"
				},
				{
					userId: 7,
					groupId: 3,
					status: "member"
				},
				{
					userId: 8,
					groupId: 3,
					status: "member"
				},
				{
					userId: 9,
					groupId: 3,
					status: "member"
				},
				{
					userId: 10,
					groupId: 3,
					status: "member"
				},
				{
					userId: 11,
					groupId: 3,
					status: "member"
				},
				// Book club members (online), groupId 5 - Organized by userId 3
				{
					userId: 1,
					groupId: 5,
					status: "member"
				},
				{
					userId: 2,
					groupId: 5,
					status: "member"
				},
				{
					userId: 4,
					groupId: 5,
					status: "member"
				},
				{
					userId: 5,
					groupId: 5,
					status: "member"
				},
				{
					userId: 6,
					groupId: 5,
					status: "member"
				},
				{
					userId: 7,
					groupId: 5,
					status: "member"
				},
				{
					userId: 8,
					groupId: 5,
					status: "member"
				},
				{
					userId: 9,
					groupId: 5,
					status: "member"
				},
				{
					userId: 10,
					groupId: 5,
					status: "member"
				},
				{
					userId: 11,
					groupId: 5,
					status: "member"
				},
				// Photography group members (Online), groupId 6 - Organized by userId 5
				{
					userId: 1,
					groupId: 6,
					status: "member"
				},
				{
					userId: 2,
					groupId: 6,
					status: "member"
				},
				{
					userId: 3,
					groupId: 6,
					status: "member"
				},
				{
					userId: 4,
					groupId: 6,
					status: "member"
				},
				{
					userId: 6,
					groupId: 6,
					status: "member"
				},
				{
					userId: 7,
					groupId: 6,
					status: "member"
				},
				{
					userId: 8,
					groupId: 6,
					status: "member"
				},
				{
					userId: 9,
					groupId: 6,
					status: "member"
				},
				{
					userId: 10,
					groupId: 6,
					status: "member"
				},
				{
					userId: 11,
					groupId: 6,
					status: "member"
				},
				// Puzzle group members (Online), groupId 7 - Organized by userId 5
				{
					userId: 1,
					groupId: 7,
					status: "co-host"
				},
				{
					userId: 2,
					groupId: 7,
					status: "member"
				},
				{
					userId: 3,
					groupId: 7,
					status: "member"
				},
				{
					userId: 4,
					groupId: 7,
					status: "member"
				},
				{
					userId: 6,
					groupId: 7,
					status: "member"
				},
				{
					userId: 7,
					groupId: 7,
					status: "member"
				},
				{
					userId: 8,
					groupId: 7,
					status: "member"
				},
				{
					userId: 9,
					groupId: 7,
					status: "member"
				},
				{
					userId: 10,
					groupId: 7,
					status: "member"
				},
				{
					userId: 11,
					groupId: 7,
					status: "member"
				},
				// Skydiving (Tacoma), groupId 1 - Organized by userId 1
				{
					userId: 9,
					groupId: 1,
					status: "member"
				},
				{
					userId: 10,
					groupId: 1,
					status: "member"
				},
				{
					userId: 11,
					groupId: 1,
					status: "member"
				},
				// Misfits and bandits (Tacoma), groupId 2 - Organized by userId 1
				{
					userId: 9,
					groupId: 2,
					status: "member"
				},
				{
					userId: 10,
					groupId: 2,
					status: "member"
				},
				{
					userId: 11,
					groupId: 2,
					status: "member"
				},
				// Chess club (New York), groupId 4 - Organized by userId 2
				{
					userId: 6,
					groupId: 4,
					status: "member"
				},
				{
					userId: 7,
					groupId: 4,
					status: "member"
				},
				{
					userId: 8,
					groupId: 4,
					status: "member"
				},
				// Surfing group members (Hawaii), groupId 8 - Organized by userId 4
				{
					userId: 1,
					groupId: 8,
					status: "co-host"
				},
				{
					userId: 2,
					groupId: 8,
					status: "member"
				},
				{
					userId: 3,
					groupId: 8,
					status: "member"
				},
				{
					userId: 5,
					groupId: 8,
					status: "member"
				},
				{
					userId: 8,
					groupId: 8,
					status: "member"
				},
				{
					userId: 9,
					groupId: 8,
					status: "member"
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "Memberships";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				status: { [Op.in]: ["member", "co-host", "pending"] }
			},
			{}
		);
	}
};
