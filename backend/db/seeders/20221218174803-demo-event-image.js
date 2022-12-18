"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "EventImages";
		return queryInterface.bulkInsert(
			options,
			[
				{
					eventId: 1,
					url: "imagesite.com/images/7",
					preview: true
				},
				{
					eventId: 1,
					url: "imagesite.com/images/8",
					preview: false
				},
				{
					eventId: 2,
					url: "imagesite.com/images/9",
					preview: true
				},
				{
					eventId: 2,
					url: "imagesite.com/images/10",
					preview: false
				},
				{
					eventId: 3,
					url: "imagesite.com/images/11",
					preview: true
				},
				{
					eventId: 3,
					url: "imagesite.com/images/12",
					preview: false
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "EventImages";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				eventId: { [Op.in]: [1, 2, 3] }
			},
			{}
		);
	}
};
