const express = require('express');

const router = express.Router();
router.use('/math', require('./math'));
router.use('/ml', require('./ml'));

module.exports = router;