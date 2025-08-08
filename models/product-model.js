const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema({
    title: String,
    product_category_id: {
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured: String,
    position: Number,
    createdBy:{
        account_id: String,
        // để ý vì sao dùng default
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    slug: { 
        type: String, 
        slug: "title",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    //quy mô lớn thì dùng [], ít tài khoản thì ko cần
    updatedBy:[
    {
        account_id: String,
        updatedAt: Date
    }  
    ]
}, {
    timestamps: true
});
const Product = mongoose.model("Product",schema, "product");

module.exports = Product;