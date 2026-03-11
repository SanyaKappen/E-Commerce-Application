const express = require("express");
const {
  getCartProducts,
  addProductInCart,
  deleteProductInCart,
} = require("../controllers/cartController");
const { requireAuth } = require("../middleware/middleware");

const router = express.Router();

router.get("/", requireAuth, getCartProducts);
router.post("/", requireAuth, addProductInCart);
router.delete("/:id", requireAuth, deleteProductInCart);

module.exports = router;
