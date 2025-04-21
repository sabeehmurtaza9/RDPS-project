const router = require("express").Router();
const controller = require("../controllers/SettingsController");
router.get('/', controller.index);
module.exports = router;