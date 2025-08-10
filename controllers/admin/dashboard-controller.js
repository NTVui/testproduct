// GET /admin/dashboard

const ProductCategory = require("../../models/product-category-model");

module.exports.dashboard = async (req, res) => {
    const static = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };

    // 👇 Truy vấn MongoDB
    static.categoryProduct.total = await ProductCategory.countDocuments({
        deleted: false,
    });

    static.categoryProduct.active = await ProductCategory.countDocuments({
        status: "active",
        deleted: false,
    });

    static.categoryProduct.inactive = await ProductCategory.countDocuments({
        status: "inactive",
        deleted: false,
    });


    // 📤 Render view
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        static: static,
    });
};
