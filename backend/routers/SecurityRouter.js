const router = require("express").Router();
const controller = require("../controllers/SecurityController");
router.get('/', controller.index);
router.get('/:id/allow', controller.allowFile);
router.get('/:id/remove', controller.removeFile);
module.exports = router;