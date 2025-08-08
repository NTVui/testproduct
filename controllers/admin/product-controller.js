const Product = require('../../models/product-model')
const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const paginationHelper = require('../../helpers/pagination')
const systemConfig = require('../../config/system')
const ProductCategory = require("../../models/product-category-model")
const createTreeHelper = require("../../helpers/createTree")
const Account = require("../../models/account-model")

// [GET] /admin/products
module.exports.index = async (req, res) => {
  //console.log(req.query.status);

  //Đoạn bộ lọc
  const filterStatus = filterStatusHelper(req.query)

  //console.log(req.query.status);
  let find = {
    deleted: false,
  }

  if (req.query.status) {
    find.status = req.query.status
  }

  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }

  // let keyword = "";
  // if(req.query.keyword){
  //     keyword = req.query.keyword;
  //     //ng dùng tìm từ khóa mang máng và "i" là ko phân biệt hoa vs thường
  //     //học thêm regex
  //     const regex = new RegExp(keyword, "i");
  //     find.title = regex;
  // }

  //Pagination
  const countProducts = await Product.countDocuments(find)
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts,
  )

  //Truy vấn trong database dùng await
  //Vì ko bt database có bao nhiêu

  //Sort
  let sort = {}
  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue
  }else{
    sort.position = "desc"
  }
  

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
  //console.log(products);

  for (const product of products) {
    //Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id
    })
    if(user){
      product.accountFullName = user.fullname
    }
    
    //Lấy ra thông tin người gần nhất
    //Hiện tại console.log(product.updatedBy.length) thấy 0 0 0
    //ở dưới tức là các sản phẩm còn lại là dữ liệu cũ chưa có updatedBy
    //không thể product.updatedBy[-1] vì chưa bt dc
    //có thể cân nhắc slice(-1)[0]
    const updateBy = product.updatedBy[product.updatedBy.length-1]
    if(updateBy){
      const lastUser = await Account.findOne({
        _id: updateBy.account_id
      })
      //tức là trong model, updatedBy thêm 1 key nữa là accountFullName
      updateBy.accountFullName = lastUser.fullname
    }
    //console.log(product)
  }


  res.render('admin/pages/products/index', {
    pageTitle: 'Trang sản phẩm',
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  })
}

// [PATCH] /admin/products/change-status/:status/:id'
module.exports.changeStatus = async (req, res) => {
  //trong request có biến là params
  //params là object chứa thông tin
  const status = req.params.status
  const id = req.params.id

  const updatedBy={
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  await Product.updateOne({ _id: id }, {
    status: status,
    $push: {updatedBy: updatedBy}
  })
  //res.send(`${status} - ${id}`);
  req.flash('success', 'Thành công!')
  const redirectUrl = req.get('Referer') || '/admin/products'
  res.redirect(redirectUrl)
}

// [PATCH] /admin/products/change-multi/
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type
  const ids = req.body.ids
    .split(',') // KHÔNG dùng .split(', ') vì sẽ bị dư khoảng trắng
    .map((id) => id.trim()) // Xóa trắng thừa từng ID
    .filter((id) => id.length > 0) // Tránh ID rỗng

  const updatedBy={
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  switch (type) {
    case 'active':
      await Product.updateMany({ _id: { $in: ids } }, {
        status: 'active',
        $push: {updatedBy: updatedBy} })
      req.flash('success', `Đã cập nhật ${ids.length} sản phẩm Active`)
      break
    case 'inactive':
      await Product.updateMany({ _id: { $in: ids } }, {
        status: 'inactive',
        $push: {updatedBy: updatedBy}})
      req.flash('success', `Đã cập nhật ${ids.length} sản phẩm Inactive`)
      break
    case 'delete-all':
      //update: xóa mềm
      //deleteAll: xóa cứng
      await Product.updateMany(
        { _id: { $in: ids } },
        { 
          deleted: true, 
          //deleteAt: new Date()
          deletedBy:{
          account_id: res.locals.user.id,
          deletedAt: new Date()
        }
        })
      break
    case 'change-position':
      for (const item of ids) {
        let [id, position] = item.split('-')
        position = parseInt(position)
        console.log(id)
        console.log(position)
        await Product.updateOne({ _id: id }, {
          position: position,
          $push: {updatedBy: updatedBy}})
      }
      break
    default:
      break
  }
  const redirectUrl = req.get('Referer') || '/admin/products'
  res.redirect(redirectUrl)
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id.trim()

  //await Product.deleteOne({ _id: id }) Xóa hẳn
  //Xóa mềm: xóa trên nhưng trên database vẫn hiện nhưng thay đổi
  //deleted: true
  await Product.updateOne(
    { _id: id }, 
    { 
      deleted: true,
      //deleteAt: new Date(),
      deletedBy:{
        account_id: res.locals.user.id,
        deletedAt: new Date()
      } 
    })

  const redirectUrl = req.get('Referer') || '/admin/products'
  res.redirect(redirectUrl)
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  
  let find = {
    deleted: false,
    }
    

    const category = await ProductCategory.find(find)
    const newCategory = createTreeHelper.create(category)
  res.render('admin/pages/products/create', {
    pageTitle: 'Thêm mới sản phẩm',
    category: newCategory
  })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)

  if (req.body.position == '') {
    const countProducts = await Product.countDocuments()
    req.body.position = countProducts + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }
  req.body.createdBy = {
    account_id: res.locals.user.id
  }

  // if(req.file){
  //   req.body.thumbnail= `/uploads/${req.file.filename}`
  // }

  const product = new Product(req.body)
  await product.save()
  
  res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    }
    //find là sẽ xét hết và trả về mảng trong đó là sản phẩm mình tìm
    /*Tức là
  [
    {
      sản phẩm đang tìm
    }
  ]
  */
    //findOne là trả về Object tìm dc đấy thôi
    const product = await Product.findOne(find)

    const category = await ProductCategory.find({deleted: false})
    const newCategory = createTreeHelper.create(category)
    //console.log(product)
    res.render('admin/pages/products/edit', {
      pageTitle: 'Chỉnh sửa sản phẩm',
      product: product,
      category: newCategory
    })
  } catch (error) {
    //req.flash("error", `Lỗi id`)
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)

  req.body.position = parseInt(req.body.position)

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }

  try {
    const updatedBy ={
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    if (req.body.updatedBy) delete req.body.updatedBy;
    await Product.updateOne({ _id: id }, {
      ...req.body,
      $push: {updatedBy: updatedBy}
    })
    req.flash('success', 'Cập nhật thành công')
  } catch (error) {
    req.flash('error', 'Cập nhật thất bại')
  }
  //res.redirect("back") ở đây là quay về admin/products luôn và đã sửa lại sản phẩm r
  //còn dưới này là vẫn giữ nguyên ở trang edit/:id
  const redirectUrl = req.get('Referer')
  res.redirect(redirectUrl)
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    }
    const product = await Product.findOne(find)
    console.log(product)
    res.render('admin/pages/products/detail', {
      pageTitle: product.title,
      product: product,
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}
