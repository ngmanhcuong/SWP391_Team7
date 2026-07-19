const express = require('express');
const { getHomeData } = require('../controllers/publicController');

const router = express.Router();

router.get('/home', getHomeData);

module.exports = router;
