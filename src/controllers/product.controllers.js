import { Product } from "../models/Product.models.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";
import { Category } from "../models/Category.models.js";


const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;

        if(!name || !description || !price || !stock || !categoryId) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        if(price < 0 || stock < 0) {
            return res.status(400).json({
                message: 'Price and stock cannot be less than zero'
            })
        }

        const existedProduct = await Product.findOne({ name })

        if(existedProduct) {
            return res.status(400).json({
                message: 'Product with this name already exists'
            })
        }

        const category = await Category.findById(categoryId)

        if(!category) {
            return res.status(404).json({
                message: 'Category not found'
            })
        }

        const imageLocalPath = req.file?.path

        if(!imageLocalPath) {
            return res.status(400).json({
                message: 'Image is required'
            })
        }

        const image = await uploadOnCloudinary(imageLocalPath)

        if(!image) {
            return res.status(500).json({
                message: 'Error while uploading image'
            })
        }

        const createdProduct = await Product.create({
            name,
            description,
            price,
            stock,
            categoryId,
            image: image.url
        })

        return res.status(201).json({
            message: 'Product created successfully',
            data: createdProduct 
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while creating product'
        })
    }
}



export {
    createProduct
}