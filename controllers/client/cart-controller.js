const Cart = require("../../models/cart-model")
const Product = require('../../models/product-model')
const productHelper = require("../../helpers/product")

// [GET] /cart
module.exports.index= async (req,res)=>{
    const cartId = req.cookies.cartId
    const cart =  await Cart.findOne({
        _id: cartId
    })
    if(cart.products.length > 0){
        for (const item of cart.products) {
            const productId = item.product_id
            const productInfo = await Product.findOne({
                _id: productId
            })
            productInfo.priceNew = productHelper.price_new_product(productInfo)
            item.productInfo = productInfo
            item.totalPrice = item.quantity*productInfo.priceNew
        }   
    }
    //i là tự tạo, đặt tên gì cũng dc
    cart.totalPrice = cart.products.reduce((sum,i)=>sum+i.totalPrice ,0)
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
}

// [POST] /cart/add/:productId
module.exports.addPost=async(req,res)=>{
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)

    const cart = await Cart.findOne({
        _id: cartId
    })

    //console.log(cart)
    console.log(cart.products)
    const existProductInCart = cart.products.find(item=>item.product_id==productId)
    //console.log(existProductInCart)
    if(existProductInCart){
        console.log("Cập nhật quantity")
        const newQuantity = quantity + existProductInCart.quantity
        console.log(newQuantity)
        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId
            },
            {
                'products.$.quantity': newQuantity
            }
        )
    }else{
        const objectCart ={
        product_id : productId,
        quantity: quantity
    }
    // console.log(cartId)
    console.log(productId)
    // console.log(quantity)
    await Cart.updateOne(
        {
            _id : cartId
        },
        {
            $push: {products: objectCart}
        }
    )
    
    }

    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!")
    const redirectUrl = req.get("Referer") 
    res.redirect(redirectUrl); 
    
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req,res)=>{
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = req.params.quantity
    // console.log(productId)
    try {
        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId
            },
            {
                'products.$.quantity': quantity
            }
        )
        
        req.flash("success", "Đã cập nhật số lượng")
    } catch (error) {
        console.log("Error updating product from cart:", error)
        req.flash("error", "Có lỗi xảy ra khi cập nhật số lượng")
    }
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
}

// [GET] /cart/delete/:productId
module.exports.delete=async(req,res)=>{
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    // console.log(productId)
    try {
        // Xóa sản phẩm khỏi giỏ hàng
        await Cart.updateOne({
            _id: cartId 
        }, {
            "$pull": { products: { "product_id": productId } }
        })
        
        req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng")
    } catch (error) {
        console.log("Error deleting product from cart:", error)
        req.flash("error", "Có lỗi xảy ra khi xóa sản phẩm")
    }
    const redirectUrl = req.get('Referer')
    res.redirect(redirectUrl)
}