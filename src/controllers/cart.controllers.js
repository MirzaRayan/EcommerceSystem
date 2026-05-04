import { Cart } from "../models/Cart.models.js";
import { Product } from "../models/Product.models.js";

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        if( !productId || !quantity ) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const product = await Product.findById(productId)

        if(!product) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        if(product.stock === 0) {
            return res.status(400).json({
                message: 'Product is out of stock'
            })
        }

        if(quantity > product.stock) {
            return res.status(400).json({
                message: 'Quantity exceeds stock'
            })
        }

        const existedProduct = await Cart.findOne({
            userId: req.user._id,
            productId
        })

        if(existedProduct) {
            const updatedCartItem = await Cart.findByIdAndUpdate(
                existedProduct._id,
                { quantity: existedProduct.quantity + (quantity || 1) },
                { new: true }
            ).populate('productId', 'name price image')

            return res.status(200).json({
                message: 'Cart quantity updated successfully',
                data: updatedCartItem
            })
        }

        const cartItem = await Cart.create({
            userId: req.user._id,
            productId,
            quantity: quantity || 1
        })

        const newCartItem = await Cart.findById(cartItem._id)
            .populate('productId', 'name price image')

        return res.status(201).json({
            message: 'Product added to cart successfully',
            data: newCartItem
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while adding product to cart'
        })
    }
}



export { 
    addToCart 
};
