const express = require('express');
const router = express.Router();
const cmsController = require('./cmsController');

router.get('/', cmsController.getCMS);
router.put('/', cmsController.updateCMS);
router.put('/:section', cmsController.updateCMSSection);
router.post('/reset', cmsController.resetCMS);

module.exports = router;
