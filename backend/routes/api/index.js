// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const groupsRouter = require("./groups.js");
const venuesRouter = require("./venues.js");
const groupImagesRouter = require("./group-images.js");
const eventsRouter = require("./events.js");
// GET /api/set-token-cookie
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/groups", groupsRouter);

router.use("/venues", venuesRouter);

router.use("/group-images", groupImagesRouter);

router.use("/events", eventsRouter);

router.post("/test", (req, res) => {
	res.json({ requestBody: req.body });
});

module.exports = router;
