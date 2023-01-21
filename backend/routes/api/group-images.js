// backend/routes/api/group-images.js
const express = require("express");
const { Group, Membership, GroupImage } = require("../../db/models");
const {
	requireAuthentication,
	requireAuthorization
} = require("../../utils/auth");
const { notFound } = require("../../utils/not-found");

const router = express.Router();

router.delete("/:imageId", requireAuthentication, async (req, res, next) => {
	const { imageId } = req.params;
	const imageToDelete = await GroupImage.findByPk(imageId, {
		include: {
			model: Group,
			attributes: ["organizerId"],
			include: {
				model: Membership,
				attributes: ["userId", "status"]
			}
		}
	});

	if (!imageToDelete) return next(notFound("Group Image couldn't be found"));
	if (
		imageToDelete.Group.organizerId === req.user.id ||
		imageToDelete.Group.Memberships.some(el => {
			return el.userId === req.user.id && el.status === "co-host";
		})
	) {
		await imageToDelete.destroy();
		return res.json({
			message: "Successfully deleted",
			statusCode: 200
		});
	}
	return next(requireAuthorization());
});

module.exports = router;
