"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		static associate(models) {
			Event.belongsToMany(models.User, {
				through: models.Attendance,
				foreignKey: "eventId",
				otherKey: "userId",
				as: "Attendees",
				onDelete: "CASCADE"
			});
			Event.hasMany(models.Attendance, {
				onDelete: "CASCADE",
				foreignKey: "eventId",
				as: "Attendances"
			});
			Event.belongsTo(models.Group, {
				foreignKey: "groupId",
				onDelete: "CASCADE"
			});
			Event.belongsTo(models.Venue, {
				foreignKey: "venueId",
				onDelete: "SET NULL"
			});
			Event.hasMany(models.EventImage, {
				foreignKey: "eventId",
				onDelete: "CASCADE"
			});
		}
	}
	Event.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			venueId: {
				type: DataTypes.INTEGER,
				references: {
					model: "Venues"
				},
				onDelete: "SET NULL"
			},
			groupId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Groups"
				},
				onDelete: "CASCADE"
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false
			},
			capacity: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			price: {
				type: DataTypes.DECIMAL,
				allowNull: false
			},
			startDate: {
				type: DataTypes.STRING,
				allowNull: false
			},
			endDate: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Event",
			defaultScope: {
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				}
			},
			scopes: {
				allEvents(queryParams) {
					const { EventImage, Attendance, Group, Venue } = require("../models");
					let { page, size, name, type, startDate } = queryParams;

					page = +page;
					size = +size;

					if (Number.isNaN(page) || page < 1) page = 1;
					if (Number.isNaN(size) || size > 20) size = 20;

					if (page > 10) page = 10;
					if (size < 1) size = 1;

					let where = {};

					if (name) where.name = name;
					if (type) where.type = type;
					if (startDate) {
						where.startDate = startDate;
					}
					return {
						attributes: {
							include: [
								[
									sequelize.fn("COUNT", sequelize.col("Attendances.id")),
									"numAttending"
								],
								[sequelize.col("EventImages.url"), "previewImage"]
							],
							exclude: [
								"description",
								"capacity",
								"price",
								"createdAt",
								"updatedAt"
							]
						},
						include: [
							{
								model: Attendance,
								attributes: [],
								as: "Attendances",
								where: { status: "attending" },
								required: false
							},
							{
								model: EventImage,
								attributes: [],
								where: {
									preview: true
								},
								required: false
							},
							{
								model: Group,
								attributes: {
									exclude: [
										"organizerId",
										"about",
										"type",
										"private",
										"createdAt",
										"updatedAt"
									]
								}
							},
							{
								model: Venue,
								attributes: {
									exclude: [
										"groupId",
										"address",
										"lat",
										"lng",
										"createdAt",
										"updatedAt"
									]
								}
							}
						],
						subQuery: false,
						limit: size,
						offset: size * (page - 1),
						group: ["Event.id"]
					};
				},
				allEventsByGroup(groupId) {
					const { EventImage, Attendance, Group, Venue } = require("../models");

					return {
						attributes: {
							include: [
								[
									sequelize.fn("COUNT", sequelize.col("Attendances.id")),
									"numAttending"
								],
								[sequelize.col("EventImages.url"), "previewImage"]
							],
							exclude: [
								"description",
								"capacity",
								"price",
								"createdAt",
								"updatedAt"
							]
						},
						include: [
							{
								model: Attendance,
								attributes: [],
								as: "Attendances",
								where: { status: "attending" }
							},
							{
								model: EventImage,
								attributes: [],
								where: {
									preview: true
								},
								required: false
							},
							{
								model: Group,
								attributes: {
									exclude: [
										"organizerId",
										"about",
										"type",
										"private",
										"createdAt",
										"updatedAt"
									]
								}
							},
							{
								model: Venue,
								attributes: {
									exclude: [
										"groupId",
										"address",
										"lat",
										"lng",
										"createdAt",
										"updatedAt"
									]
								}
							}
						],
						where: { groupId },
						group: ["Event.id"]
					};
				}
			}
		}
	);
	return Event;
};
