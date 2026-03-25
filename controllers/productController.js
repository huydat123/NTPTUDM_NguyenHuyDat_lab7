const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

// Tạo product -> tự tạo inventory tương ứng
const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const product = await Product.create({
      name,
      price,
      description
    });

    let inventory;
    try {
      inventory = await Inventory.create({
        product: product._id,
        stock: 0,
        reserved: 0,
        soldCount: 0
      });
    } catch (err) {
      // nếu tạo inventory lỗi thì xóa product vừa tạo
      await Product.findByIdAndDelete(product._id);
      throw err;
    }

    return res.status(201).json({
      message: "Tạo product thành công và đã tạo inventory tương ứng",
      product,
      inventory
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tạo product",
      error: error.message
    });
  }
};

module.exports = {
  createProduct
};