const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/product-controller");

router.get('/', controller.index);
//slugCategory là tự đặt tên
router.get('/:slugCategory', controller.category);
router.get('/detail/:slugProduct', controller.detail);

module.exports = router;