const Product = require("../../models/product-model");
const productHelper = require("../../helpers/product")
const productCategoryHelper = require("../../helpers/product-category")
const ProductCategory = require("../../models/product-category-model")
// GET /products
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword
    let newProducts = []
    
    if(keyword){
        const keywordRegex = new RegExp(keyword, "i")
        const products = await Product.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        })
        //console.log(products)
        newProducts = productHelper.priceNewProduct(products)
    }
    
    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    });
}