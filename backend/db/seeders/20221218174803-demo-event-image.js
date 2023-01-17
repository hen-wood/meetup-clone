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
					url: "https://i.imgur.com/wOBcwfW.jpeg",
					preview: true
				},
				{
					eventId: 1,
					url: "https://i.imgur.com/QPCBoma.png",
					preview: false
				},
				{
					eventId: 2,
					url: "https://i.imgur.com/9dXnQaA.jpeg",
					preview: true
				},
				{
					eventId: 2,
					url: "https://i.imgur.com/Plt6Lvt.jpeg",
					preview: false
				},
				{
					eventId: 3,
					url: "https://i.imgur.com/76qzA9H.jpeg",
					preview: true
				},
				{
					eventId: 3,
					url: "https://i.imgur.com/m1eXkln.jpeg",
					preview: false
				},
				{
					eventId: 4,
					url: "https://i.imgur.com/6mA3rOd.jpeg",
					preview: true
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
