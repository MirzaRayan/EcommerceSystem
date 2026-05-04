import { Cart } from "../models/Cart.models.js";
import { Product } from "../models/Product.models.js";

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock === 0) {
      return res.status(400).json({
        message: "Product is out of stock",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Quantity exceeds stock",
      });
    }

    const existedProduct = await Cart.findOne({
      userId: req.user._id,
      productId,
    });

    if (existedProduct) {
      const updatedCartItem = await Cart.findByIdAndUpdate(
        existedProduct._id,
        { quantity: existedProduct.quantity + (quantity || 1) },
        { new: true }
      ).populate("productId", "name price image");

      return res.status(200).json({
        message: "Cart quantity updated successfully",
        data: updatedCartItem,
      });
    }

    const cartItem = await Cart.create({
      userId: req.user._id,
      productId,
      quantity: quantity || 1,
    });

    const newCartItem = await Cart.findById(cartItem._id).populate(
      "productId",
      "name price image"
    );

    return res.status(201).json({
      message: "Product added to cart successfully",
      data: newCartItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error while adding product to cart",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.user._id }).populate(
      "productId",
      "name price image"
    );

    if (cart.length === 0) {
      return res.status(404).json({
        message: "Cart it empty || No cart found",
      });
    }

    return res.status(200).json({
      message: "Cart fetched sucessfully",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error while getting cart",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const deletedCart = await Cart.deleteMany({
      userId: req.user._id,
    });

    if (deletedCart.deletedCount === 0) {
      return res.status(404).json({
        message: "Cart is already empty",
      });
    }

    return res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error while clearing cart",
    });
  }
};

const removeFromCart = async (req, res) => {
    try {

        const cartItem = await Cart.findById(req.params.id)

        if(!cartItem) {
            return res.status(404).json({
                message: 'Cart item not found'
            })
        }

        // Then check ownership
        if(cartItem.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You are not allowed to delete this item'
            })
        }

        await Cart.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            message: 'Item removed from cart successfully',
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while removing item from cart'
        })
    }
}

export { addToCart, getCart, clearCart, removeFromCart };
