const Cart = require("../models/Cart");

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      return res.json({
        success: true,
        cart: {
          items: [],
        },
      });
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1, size = "One Size", color = "Default" } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            qty,
            size,
            color,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingItem) {
        existingItem.qty += Number(qty);
      } else {
        cart.items.push({
          product: productId,
          qty,
          size,
          color,
        });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

// UPDATE CART
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty, size = "One Size", color = "Default" } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (Number(qty) < 1) {
      cart.items = cart.items.filter(
        (item) =>
          !(
            item.product.toString() === productId &&
            item.size === size &&
            item.color === color
          )
      );
    } else {
      item.qty = Number(qty);
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size = "One Size", color = "Default" } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
        )
    );

    await cart.save();
    await cart.populate("items.product");

    res.json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};