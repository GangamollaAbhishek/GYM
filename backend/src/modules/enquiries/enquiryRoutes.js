const express = require('express');
const router = express.Router();
const enquiryController = require('./enquiryController');

router.post('/', enquiryController.createEnquiry);
router.get('/', enquiryController.getAllEnquiries);
router.put('/:id', enquiryController.updateEnquiry);
router.delete('/:id', enquiryController.deleteEnquiry);

module.exports = router;
