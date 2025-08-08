const ProductCategory = require("../../models/product-category-model")
const systemConfig = require('../../config/system')
const createTreeHelper = require("../../helpers/createTree")
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
    deleted: false,
    }
    

    const records = await ProductCategory.find(find)
    const newRecords = createTreeHelper.create(records)
    res.render('admin/pages/product-category/index', {
        pageTitle: 'Danh mục sản phẩm',
        records: newRecords
  })
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find={
      deleted:false
    }
    
    const records = await ProductCategory.find(find)
    
    const newRecords = createTreeHelper.create(records)
    //console.log(newRecords)

     
    res.render('admin/pages/product-category/create', {
        pageTitle: 'Tạo danh mục sản phẩm',
        records: newRecords
    
  })

}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  
  //Code này để nếu có người biết miền (qua Postman) thì kể cả truy cập vào dc
  //Nhưng bấm button Tạo mới thì vẫn ko có quyền tạo
  // const permission = res.locals.role.permissions
  // if(permission.includes("products-category_create")){
  //   //cắt đoạn dưới lên
  // }else{
  //   res.send("É è không có quyền truy cập làm gì đây?")
  //   return
  // }
  
  //console.log(req.body)
  if (req.body.position == '') {
    const countProducts = await ProductCategory.countDocuments()
    req.body.position = countProducts + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  const record = new ProductCategory(req.body)
  await record.save()
  
  res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false
    })

    const records = await ProductCategory.find({
      deleted:false
    })
    const newRecords = createTreeHelper.create(records)
    
    res.render('admin/pages/product-category/edit', {
        pageTitle: 'Chỉnh sửa danh mục sản phẩm',
        data: data,
        records: newRecords
    
  })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }

}

//[PATCH] /admin/products-category/edit/:id
//C1: Vì không xử lý được uploadImagePreview
// module.exports.editPatch = async (req, res) => {
//     const id = req.params.id
//     req.body.position = parseInt(req.body.position)
    

//     try {
//       await ProductCategory.updateOne({_id:id}, req.body)
//       req.flash('success', 'Chỉnh sửa thành công!')
//     } catch (error) {
//       //console.error(error);
//       req.flash('error', 'Cập nhật thất bại!');
//     }
    
//     res.redirect(`${systemConfig.prefixAdmin}/products-category/edit/${id}`);
//   }
// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id
  req.body.position = parseInt(req.body.position)

  try {
    const record = await ProductCategory.findOne({_id: id, deleted: false})

    if (!record) {
      req.flash('error', 'Không tìm thấy bản ghi!')
      return res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }

    // Cập nhật các field
    record.title = req.body.title
    record.parent_id = req.body.parent_id || null
    record.description = req.body.description
    record.position = req.body.position
    record.status = req.body.status

    // Xử lý ảnh
    if (req.file && req.body.thumbnail) {
      record.thumbnail = req.body.thumbnail
    } else if (req.body.removeImage === 'true') {
      record.thumbnail = null
    }

    await record.save()

    req.flash('success', 'Chỉnh sửa thành công!')
  } catch (error) {
    console.error('Error updating:', error)
    req.flash('error', 'Cập nhật thất bại!')
  }

  res.redirect(`${systemConfig.prefixAdmin}/products-category/edit/${id}`)
}

