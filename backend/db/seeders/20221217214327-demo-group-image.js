"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "GroupImages";
		return queryInterface.bulkInsert(
			options,
			[
				{
					groupId: 1,
					url: "https://i.imgur.com/qwyV0AL.jpeg",
					preview: true
				},
				{
					groupId: 1,
					url: "https://i.imgur.com/rbGCRHz.jpeg",
					preview: false
				},
				{
					groupId: 2,
					url: "https://i.imgur.com/QWgltRG.jpeg",
					preview: true
				},
				{
					groupId: 2,
					url: "https://i.imgur.com/nqJtuaR.jpeg",
					preview: false
				},
				{
					groupId: 3,
					url: "https://i.imgur.com/Gyu4tzS.jpeg",
					preview: true
				},
				{
					groupId: 3,
					url: "https://i.imgur.com/cC3grqx.jpeg",
					preview: false
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "GroupImages";
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
