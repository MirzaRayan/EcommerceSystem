import { Product } from "../models/Product.models.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";
import { Category } from "../models/Category.models.js";
import getPagination from "../services/pagination.js";


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

const getAllProducts = async (req, res) => {
    try {

        const { page, limit, skip } = getPagination(req.query)

        const allProducts = await Product.find()
            .populate('categoryId', 'name')
            .skip(skip)  
            .limit(limit) 

        if(allProducts.length === 0) {
            return res.status(404).json({
                message: 'No product found'
            })
        }

        const totalProducts = await Product.countDocuments()

        return res.status(200).json({
            message: 'All products fetched successfully',
            data: allProducts,
            pagination: {
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                limit
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while getting all products'
        })
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId','name')

        if(!product) {
            return res.status(404).json({
                message: 'Product Not found'
            })
        }

        return res.status(200).json({
            message: 'single product fetched successfully',
            data: product
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error while getting single product'
        })
    }
}

const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id).populate(
            'categoryId',
            'name'
          );
      
          if (!product) {
            return res.status(404).json({
              message: "Product not found",
            });
          }
      
          await product.deleteOne();

        return res.status(200).json({
            message: 'Product deleted successfully',
            data: product
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while deleting product'
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const key = Object.keys(req.body)

        const allowedFields = ['name','description','price','stock']

        const isValid = key.every((fields) => allowedFields.includes(fields))

        if(!isValid) {
            return res.status(400).json({
                message: 'You cannot change this field'
            })
        }

        if(req.body.price && req.body.price < 0) {
            return res.status(400).json({
                message: 'Price cannot be negative'
            })
        }
        
        if(req.body.stock && req.body.stock < 0) {
            return res.status(400).json({
                message: 'Stock cannot be negative'
            })
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        ).populate('categoryId','name')

        if(!updatedProduct) {
            return res.status(404).json({
                message: 'product not found'
            })
        }

        return res.status(200).json({
            message: 'Product updated successfully',
            data: updatedProduct
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error while updating product'
        })
    }
}

const updateProductImage = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({
                message: 'Image is required'
            })
        }

        const imageLocalPath = req.file.path

        if(!imageLocalPath) {
            return res.status(400).json({
                message: 'image path is required'
            })
        }


        const image = await uploadOnCloudinary(imageLocalPath)

        const updatedImage = await Product.findByIdAndUpdate(
            req.params.id,
            { image: image.url },
            { new: true }
        )

        if(!updatedImage) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        return res.status(200).json({
            message: 'Image updated successfully',
            data: updatedImage 
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while updating procduct image'
        })
    }
}


export {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct,
    updateProductImage
}