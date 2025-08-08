const Cart = require("../../models/cart-model")

module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart()
        await cart.save()
        const expiresTime = 1000 * 60 * 60 * 24 * 365 // 1 năm

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime),
            httpOnly: true,
            secure: false // dùng true nếu HTTPS
        })
    } else {
        // Nếu có giỏ hàng tồn tại
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })
        cart.totalQuantity = cart.products.reduce((sum,item)=>sum+item.quantity,0)
        res.locals.miniCart = cart
        //console.log(cart)
    }
    next()
}
