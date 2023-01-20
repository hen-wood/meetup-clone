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
				// Skydiving 1 ---------------------------------

				// Preview image
				{
					groupId: 1,
					url: "https://i.imgur.com/JmsIlvp.jpeg",
					preview: true
				},
				// Other images
				{
					groupId: 1,
					url: "https://i.imgur.com/QbpwyHE.jpeg",
					preview: false
				},
				{
					groupId: 1,
					url: "https://i.imgur.com/d4fJOxz.jpeg",
					preview: false
				},
				{
					groupId: 1,
					url: "https://i.imgur.com/fw8zr7C.jpeg",
					preview: false
				},
				{
					groupId: 1,
					url: "https://i.imgur.com/1e92z.jpeg",
					preview: false
				},

				// Misfits 2 ---------------------------------

				// Preview image
				{
					groupId: 2,
					url: "https://i.imgur.com/zY2S0pi.jpeg",
					preview: true
				},
				// Other images
				{
					groupId: 2,
					url: "https://i.imgur.com/Kcz2Bnv.jpeg",
					preview: false
				},
				{
					groupId: 2,
					url: "https://i.imgur.com/eoc1Zf0.jpeg",
					preview: false
				},
				{
					groupId: 2,
					url: "https://i.imgur.com/0s0xUH3.jpeg",
					preview: false
				},

				// Cooking 3 ---------------------------------

				// Preview image
				{
					groupId: 3,
					url: "https://i.imgur.com/n6bF2Vx.jpeg",
					preview: true
				},
				// Other images
				{
					groupId: 3,
					url: "https://i.imgur.com/N00yart.jpeg",
					preview: false
				},
				{
					groupId: 3,
					url: "https://i.imgur.com/BbS9G3A.jpeg",
					preview: false
				},
				{
					groupId: 3,
					url: "https://i.imgur.com/mHpUON4.jpeg",
					preview: false
				},
				{
					groupId: 3,
					url: "https://i.imgur.com/6dsjGEV.jpeg",
					preview: false
				},

				// Chess 4 ---------------------------------

				// Preview image
				{
					groupId: 4,
					url: "https://i.imgur.com/w5t2vqx.png",
					preview: true
				},
				// Other images
				{
					groupId: 4,
					url: "https://i.imgur.com/gW3i8.jpeg",
					preview: false
				},
				{
					groupId: 4,
					url: "https://i.imgur.com/2GpxiwO.jpeg",
					preview: false
				},
				{
					groupId: 4,
					url: "https://i.imgur.com/nqJtuaR.jpeg",
					preview: false
				},

				// Book Club 5 ---------------------------------

				// Preview image
				{
					groupId: 5,
					url: "https://i.imgur.com/VnY8CPB.jpeg",
					preview: true
				},
				// Other images
				{
					groupId: 5,
					url: "https://i.imgur.com/EUICifS.jpeg",
					preview: false
				},
				{
					groupId: 5,
					url: "https://i.imgur.com/GtMDECO.jpeg",
					preview: false
				},
				{
					groupId: 5,
					url: "https://i.imgur.com/hZ6Q9Oe.jpeg",
					preview: false
				},

				// Photography 6 ---------------------------------

				// Preview image
				{
					groupId: 6,
					url: "https://i.imgur.com/rngkqgs.jpeg",
					preview: true
				},
				// Other images
				{
					groupId: 6,
					url: "https://i.imgur.com/JByHXPH.jpeg",
					preview: false
				},
				{
					groupId: 6,
					url: "https://i.imgur.com/MO9S5LD.jpeg",
					preview: false
				},
				{
					groupId: 6,
					url: "https://i.imgur.com/Up0rfkq.jpeg",
					preview: false
				},

				// Puzzles 7 ---------------------------------

				// Preview image
				{
					groupId: 7,
					url: "https://i.imgur.com/QQcQsdU.jpeg",
					preview: true
				},
				// Other images
				{
					groupId: 7,
					url: "https://i.imgur.com/bQzPyhU.jpeg",
					preview: false
				},
				{
					groupId: 7,
					url: "https://i.imgur.com/w5skoV0.jpeg",
					preview: false
				},

				// Surfing ---------------------------------

				// Preview image
				{
					groupId: 8,
					url: "https://i.imgur.com/nf1Xevz.jpeg",
					preview: true
				},
				// Other images
				{
					groupId: 8,
					url: "https://i.imgur.com/IGarg6L.jpeg",
					preview: false
				},
				{
					groupId: 8,
					url: "https://i.imgur.com/yI7wXK5.jpeg",
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
