// backend/routes/api/events.js
const express = require("express");
const { EventImage } = require("../../db/models");
const { requireAuthentication } = require("../../utils/authentication");
const { checkIfEventImageDoesNotExist } = require("../../utils/not-found");
const {
	requireOrganizerOrCoHostForEventImage
} = require("../../utils/authorization");

const router = express.Router();

router.delete(
	"/:imageId",
	requireAuthentication,
	checkIfEventImageDoesNotExist,
	requireOrganizerOrCoHostForEventImage,
	async (req, res, next) => {
		const { imageId } = req.params;
		const imageToDelete = await EventImage.findByPk(imageId);
		await imageToDelete.destroy();
		return res.json({
			message: "Successfully deleted",
			statusCode: 200
		});
	}
);

module.exports = router;
