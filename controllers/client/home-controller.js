const Product = require('../../models/product-model')
const productHelper = require("../../helpers/product")

// [GET] /
module.exports.index = async(req, res) => {
    //Lấy ra sản phẩm nổi bật
    const productFeatured = await Product.find({
        featured: "1",
        deleted:false,
        status: "active"
    })
    const newProductsFeature = productHelper.priceNewProduct(productFeatured)

    //Hiển thị danh sách sản phẩm mới nhất
    const newProduct = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6)
    const newProducts = productHelper.priceNewProduct(newProduct)
    
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productFeatured: newProducts,
        newProducts: newProducts
    });
    }