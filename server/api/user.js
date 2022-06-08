/* IMPORTS */
const { Router } = require('express')
const express = require('express')
const router = express.Router()
const { usuarios } = require('../controllers/users.controller')


/* APIS */
router.get('/users',usuarios)

module.exports = router