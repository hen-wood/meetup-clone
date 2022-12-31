// backend/routes/api/group-images.js
const express = require("express");
const { GroupImage } = require("../../db/models");
const { requireAuthentication } = require("../../utils/authentication");
const {
	requireOrganizerOrCoHostForGroupImage
} = require("../../utils/authorization");

const { checkIfGroupImageDoesNotExist } = require("../../utils/not-found");

const router = express.Router();

router.delete(
	"/:imageId",
	requireAuthentication,
	checkIfGroupImageDoesNotExist,
	requireOrganizerOrCoHostForGroupImage,
	async (req, res, next) => {
		const { imageId } = req.params;
		const imageToDelete = await GroupImage.findByPk(imageId);

		await imageToDelete.destroy();
		return res.json({
			message: "Successfully deleted",
			statusCode: 200
		});
	}
);

module.exports = router;
