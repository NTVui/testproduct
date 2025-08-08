const Cart = require("../../models/cart-model")
const Order = require("../../models/order-model")
const Product = require('../../models/product-model')
const productHelper = require("../../helpers/product")

// [GET] /checkout
module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId
        
        if (!cartId) {
            return res.redirect('/cart')
        }
        
        const cart = await Cart.findOne({
            _id: cartId
        })
        
        // Kiểm tra cart có tồn tại không
        if (!cart) {
            return res.redirect('/cart')
        }
        
        cart.totalPrice = 0
        
        // Kiểm tra cart.products có tồn tại không
        if (cart.products && cart.products.length > 0) {
            for (const item of cart.products) {
                const productId = item.product_id
                const productInfo = await Product.findOne({
                    _id: productId
                })
                
                // Kiểm tra productInfo có tồn tại không
                if (productInfo) {
                    productInfo.priceNew = productHelper.price_new_product(productInfo)
                    item.productInfo = productInfo
                    item.totalPrice = item.quantity * productInfo.priceNew
                    cart.totalPrice += item.totalPrice
                }
            }   
        }

        res.render("client/pages/checkout/index", {
            pageTitle: "Trang đặt hàng",
            cartDetail: cart
        })
    } catch (error) {
        console.error('Error in checkout index:', error)
        res.redirect('/cart')
    }
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    try {
        const cartId = req.cookies.cartId
        const userInfo = req.body
        
        if (!cartId) {
            return res.redirect('/cart')
        }
        
        const cart = await Cart.findOne({
            _id: cartId
        })
        
        // Kiểm tra cart có tồn tại không
        if (!cart || !cart.products || cart.products.length === 0) {
            return res.redirect('/cart')
        }
        
        let products = []
        
        for (const product of cart.products) {
            const objectProduct = {
                product_id: product.product_id,
                price: 0,
                discountPercentage: 0,
                quantity: product.quantity
            }
            
            const productInfo = await Product.findOne({
                _id: product.product_id
            })
            
            // Kiểm tra productInfo có tồn tại không
            if (productInfo) {
                objectProduct.price = productInfo.price
                objectProduct.discountPercentage = productInfo.discountPercentage
                products.push(objectProduct)
            }
        }
        
        console.log('Products for order:', products)
        
        const objectOrder = {
            cart_id: cartId,
            userInfo: userInfo,
            products: products
        }

        const order = new Order(objectOrder)
        await order.save()

        // Xóa sản phẩm trong giỏ hàng
        await Cart.updateOne({
            _id: cartId
        }, {
            products: []
        })
        
        res.redirect(`/checkout/success/${order.id}`)
        
    } catch (error) {
        console.error('Error creating order:', error)
        res.redirect('/cart')
    }
}

// [GET] /checkout/success/:id
module.exports.success = async (req, res) => {
    try {
        // SỬA: Dùng req.params.id thay vì req.params.orderId
        const orderId = req.params.id
        //console.log('Order ID:', orderId)
        
        const order = await Order.findOne({
            _id: orderId
        })
        
        // Kiểm tra order có tồn tại không
        if (!order) {
            //console.error('Order not found:', orderId)
            return res.redirect('/')
        }
        
        // Kiểm tra order.products có tồn tại không
        if (!order.products || order.products.length === 0) {
            //console.error('No products in order:', orderId)
            return res.redirect('/')
        }
        
        // Lấy thông tin chi tiết sản phẩm
        for (const product of order.products) {
            const productInfo = await Product.findOne({
                _id: product.product_id
            }).select("title thumbnail")
            
            if (productInfo) {
                product.productInfo = productInfo
                product.priceNew = productHelper.price_new_product(product)
                product.totalPrice = product.priceNew * product.quantity
            }
        }
        
        // Tính tổng tiền
        order.totalPrice = order.products.reduce((sum, item) => {
            return sum + (item.totalPrice || 0)
        }, 0)
        
        // console.log('Order details:', order)
        // console.log('Products in order:', order.products)
        
        res.render("client/pages/checkout/success", {
            pageTitle: "Đặt hàng thành công",
            order: order
        })
        
    } catch (error) {
        console.error('Error in checkout success:', error)
        res.redirect('/')
    }
}