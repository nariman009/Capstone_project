// dataRoutes.js
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/buildings', dataController.fetchData);

module.exports = router;
