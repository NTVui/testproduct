const ProductCategory = require("../../models/product-category-model")

const createTreeHelper = require("../../helpers/createTree")

module.exports.categoty=async(req,res,next)=>{
    const productCategory = await ProductCategory.find({
        deleted: false
    })
    const newProductCategory = createTreeHelper.create(productCategory)
    res.locals.layoutProductCategory = newProductCategory
    // console.log(newProductCategory)
    next()
}