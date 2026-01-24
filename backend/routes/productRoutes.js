const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/// Public Route
router.get("/", productController.getAllProducts);

// Protected Routes (Hanya Admin yang punya Token yang bisa akses)
// // upload.array('images') membolehkan upload banyak file sekaligus
router.post("/", verifyToken, upload.array("images", 10), productController.createProduct);
router.delete("/:id", verifyToken, productController.deleteProduct);

module.exports = router;
