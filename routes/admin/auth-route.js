const express = require('express')
const multer = require('multer')

//const storageMulter= require("../../helpers/storageMulter")
const upload = multer() //({storage: storageMulter})
const router = express.Router()
const controller = require('../../controllers/admin/auth-controller')
const validate = require('../../validate/admin/auth-validate')

router.get('/login', controller.login)
router.post('/login',validate.loginPost, controller.loginPost)
router.post('/logout', controller.logout)
module.exports = router
