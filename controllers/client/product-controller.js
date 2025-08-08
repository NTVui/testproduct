const Product = require("../../models/product-model");
const productHelper = require("../../helpers/product")
const productCategoryHelper = require("../../helpers/product-category")
const ProductCategory = require("../../models/product-category-model")
// GET /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"})
    
    const newProducts = productHelper.priceNewProduct(products)

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        product: newProducts
    });
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
    try {
    const find = {
    deleted: false,
    slug:req.params.slugProduct,
    status: "active"
    }
    const product = await Product.findOne(find)
    //console.log(product)
    if(product.product_category_id){
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false
      })
      product.category = category
    }
    product.priceNew = productHelper.price_new_product(product)
    res.render('client/pages/products/detail', {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
  }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  //console.log(req.params.slugCategory)
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false
  })
  console.log(category)

  const listGetSubCategory = await productCategoryHelper.getSubCategory(category.id)
  
  const listGetSubCategoryId = listGetSubCategory.map(item=>item.id)
  //console.log(listGetSubCategoryId)

  const product = await Product.find({
    product_category_id: { $in: [category.id, ...listGetSubCategoryId]},
    deleted: false
  }).sort({position: "desc"})
  //console.log(product)
  const newProducts = productHelper.priceNewProduct(product)
  res.render("client/pages/products/index", {
        pageTitle: category.title,
        product: newProducts
    });
}