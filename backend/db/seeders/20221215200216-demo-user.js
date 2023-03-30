"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		options.tableName = "Users";
		return queryInterface.bulkInsert(
			options,
			[
				// Group Organizers
				{
					firstName: "Demo-user",
					lastName: "Meetdown",
					email: "demo@user.io",
					profileImageUrl: "https://i.imgur.com/sEyrna2.png",
					username: "Demo-lition",
					hashedPassword: bcrypt.hashSync("password")
				},
				{
					firstName: "John",
					lastName: "Fakeman",
					email: "john@user.io",
					profileImageUrl: "https://i.imgur.com/rlxFYXV.jpg",
					username: "JohnFakeman",
					hashedPassword: bcrypt.hashSync("password2")
				},
				{
					firstName: "Don",
					lastName: "Manfake",
					email: "don@user.io",
					profileImageUrl: "https://i.imgur.com/H77vAHo.jpg",
					username: "DonManfake",
					hashedPassword: bcrypt.hashSync("password3")
				},
				{
					firstName: "Jane",
					lastName: "Doe",
					email: "jane@user.io",
					profileImageUrl: "https://i.imgur.com/5iHAPnI.jpg",
					username: "JaneDoe",
					hashedPassword: bcrypt.hashSync("password4")
				},
				{
					firstName: "Bob",
					lastName: "Smith",
					email: "bob@user.io",
					profileImageUrl: "https://i.imgur.com/9Nq270L.jpg",
					username: "BobSmith",
					hashedPassword: bcrypt.hashSync("password5")
				},
				// Extra members
				// New Yorkers
				{
					firstName: "Emily",
					lastName: "Williams",
					email: "emily@user.io",
					profileImageUrl: "https://i.imgur.com/pNSAtko.jpg",
					username: "EmilyWilliams",
					hashedPassword: bcrypt.hashSync("password6")
				},
				{
					firstName: "Mike",
					lastName: "Jones",
					email: "whomikejones@user.io",
					profileImageUrl: "https://i.imgur.com/y0rhzjy.jpg",
					username: "whoMikeJones",
					hashedPassword: bcrypt.hashSync("password7")
				},
				{
					firstName: "Ashley",
					lastName: "Brown",
					email: "ashley@user.io",
					profileImageUrl: "https://i.imgur.com/EeSQ7ze.jpg",
					username: "AshleyBrown",
					hashedPassword: bcrypt.hashSync("password8")
				},
				// Seattle-ites
				{
					firstName: "Joshua",
					lastName: "Garcia",
					email: "josh@user.io",
					profileImageUrl: "https://i.imgur.com/EfWexdE.jpg",
					username: "JoshuaGarcia",
					hashedPassword: bcrypt.hashSync("password9")
				},
				{
					firstName: "Matthew",
					lastName: "Davis",
					email: "matthew@user.io",
					profileImageUrl: "https://i.imgur.com/DU9QuM2.jpg",
					username: "MatthewDavis",
					hashedPassword: bcrypt.hashSync("password10")
				},
				{
					firstName: "Lauren",
					lastName: "Conner",
					email: "lauren@user.io",
					profileImageUrl: "https://i.imgur.com/PpynDC8.jpg",
					username: "LaurenConner",
					hashedPassword: bcrypt.hashSync("password11")
				}
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		options.tableName = "Users";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] }
			},
			{}
		);
	}
};
