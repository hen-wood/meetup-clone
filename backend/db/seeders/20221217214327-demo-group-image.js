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
					url: "imagesite.com/images/1",
					preview: true
				},
				{
					groupId: 1,
					url: "imagesite.com/images/2",
					preview: false
				},
				{
					groupId: 2,
					url: "imagesite.com/images/3",
					preview: true
				},
				{
					groupId: 2,
					url: "imagesite.com/images/4",
					preview: false
				},
				{
					groupId: 3,
					url: "imagesite.com/images/5",
					preview: true
				},
				{
					groupId: 3,
					url: "imagesite.com/images/6",
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
