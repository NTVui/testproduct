const express = require('express')
const multer = require('multer')

//const storageMulter= require("../../helpers/storageMulter")
const upload = multer() //({storage: storageMulter})
const router = express.Router()
const controller = require('../../controllers/admin/role-controller')



router.get('/', controller.index)
router.get('/create', controller.create)
router.post('/create', controller.createPost)
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id', controller.editPatch)

router.get('/permissions', controller.permissions)
router.patch('/permissions', controller.editPermissions)

module.exports = router
