const express = require('express')
const multer = require('multer')

//const storageMulter= require("../../helpers/storageMulter")
const upload = multer() //({storage: storageMulter})
const router = express.Router()
const controller = require('../../controllers/admin/account-controller')
const validate = require('../../validate/admin/account-validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud-middlewares')


router.get('/', controller.index)
router.get('/create', controller.create)

router.post(
  '/create',
  upload.single('avatar'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost,
)
router.get('/edit/:id', controller.edit)
router.patch(
  '/edit/:id',
  upload.single('avatar'),
  uploadCloud.upload,
 
  controller.editPatch,
)
module.exports = router
