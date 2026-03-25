const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const productRoutes = require("./routes/productRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/inventories", inventoryRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Kết nối MongoDB thành công");
    app.listen(process.env.PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error.message);
  });