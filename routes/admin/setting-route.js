const express = require('express')
const multer = require('multer')


const upload = multer() //({storage: storageMulter})
const router = express.Router()
const controller = require('../../controllers/admin/setting-controller')
const uploadCloud = require('../../middlewares/admin/uploadCloud-middlewares')


router.get('/general', controller.general)
router.patch('/general',upload.single('logo'), uploadCloud.upload, controller.generalPatch)

module.exports = router
