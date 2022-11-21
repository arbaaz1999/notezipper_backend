const express = require('express')
const { registerUser, loginAuth } = require('../controllers/userControllers')


const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(loginAuth);

module.exports = router