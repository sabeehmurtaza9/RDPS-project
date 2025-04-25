const router = require("express").Router();
const controller = require("../controllers/SettingsController");
router.get('/', controller.index);
router.post('/', controller.store);
router.get('/select-watched-folder', controller.selectWatchedFolder);
router.get('/protection/enable', controller.enableProtection);
router.get('/protection/disable', controller.disableProtection);
module.exports = router;