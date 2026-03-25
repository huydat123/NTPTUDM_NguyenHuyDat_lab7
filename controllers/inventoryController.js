const Inventory = require("../models/Inventory");

// kiểm tra quantity hợp lệ
const validateQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0;
};

// GET ALL inventories (join product)
const getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().populate("product");

    return res.status(200).json({
      message: "Lấy danh sách inventory thành công",
      data: inventories
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy danh sách inventory",
      error: error.message
    });
  }
};

// GET inventory by ID (join product)
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findById(id).populate("product");

    if (!inventory) {
      return res.status(404).json({
        message: "Không tìm thấy inventory"
      });
    }

    return res.status(200).json({
      message: "Lấy inventory thành công",
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy inventory theo ID",
      error: error.message
    });
  }
};

// POST add-stock: tăng stock
const addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !validateQuantity(quantity)) {
      return res.status(400).json({
        message: "product hoặc quantity không hợp lệ"
      });
    }

    const inventory = await Inventory.findOneAndUpdate(
      { product },
      { $inc: { stock: quantity } },
      { new: true }
    ).populate("product");

    if (!inventory) {
      return res.status(404).json({
        message: "Không tìm thấy inventory của product này"
      });
    }

    return res.status(200).json({
      message: "Tăng stock thành công",
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tăng stock",
      error: error.message
    });
  }
};

// POST remove-stock: giảm stock
const removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !validateQuantity(quantity)) {
      return res.status(400).json({
        message: "product hoặc quantity không hợp lệ"
      });
    }

    const inventory = await Inventory.findOneAndUpdate(
      {
        product,
        stock: { $gte: quantity }
      },
      {
        $inc: { stock: -quantity }
      },
      { new: true }
    ).populate("product");

    if (!inventory) {
      return res.status(400).json({
        message: "Không tìm thấy inventory hoặc stock không đủ để giảm"
      });
    }

    return res.status(200).json({
      message: "Giảm stock thành công",
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi giảm stock",
      error: error.message
    });
  }
};

// POST reservation: giảm stock, tăng reserved
const reservation = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !validateQuantity(quantity)) {
      return res.status(400).json({
        message: "product hoặc quantity không hợp lệ"
      });
    }

    const inventory = await Inventory.findOneAndUpdate(
      {
        product,
        stock: { $gte: quantity }
      },
      {
        $inc: {
          stock: -quantity,
          reserved: quantity
        }
      },
      { new: true }
    ).populate("product");

    if (!inventory) {
      return res.status(400).json({
        message: "Không tìm thấy inventory hoặc stock không đủ để reservation"
      });
    }

    return res.status(200).json({
      message: "Reservation thành công",
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi reservation",
      error: error.message
    });
  }
};

// POST sold: giảm reserved, tăng soldCount
const sold = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !validateQuantity(quantity)) {
      return res.status(400).json({
        message: "product hoặc quantity không hợp lệ"
      });
    }

    const inventory = await Inventory.findOneAndUpdate(
      {
        product,
        reserved: { $gte: quantity }
      },
      {
        $inc: {
          reserved: -quantity,
          soldCount: quantity
        }
      },
      { new: true }
    ).populate("product");

    if (!inventory) {
      return res.status(400).json({
        message: "Không tìm thấy inventory hoặc reserved không đủ để sold"
      });
    }

    return res.status(200).json({
      message: "Sold thành công",
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi sold",
      error: error.message
    });
  }
};

module.exports = {
  getAllInventories,
  getInventoryById,
  addStock,
  removeStock,
  reservation,
  sold
};