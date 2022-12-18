// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
// const { Group } = require("../../db/models");
// GET /api/set-token-cookie
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

// router.get("/groups", async (req, res, next) => {
// 	const allGroups = await Group.findAll({});
// 	res.json(allGroups);
// });

router.post("/test", (req, res) => {
	res.json({ requestBody: req.body });
});

module.exports = router;
