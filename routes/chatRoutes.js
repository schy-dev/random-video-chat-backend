
const express = require('express');
const { getUsersByGender } = require('../controllers/chatController');

const router = express.Router();

router.get('/users', getUsersByGender);

module.exports = router;
