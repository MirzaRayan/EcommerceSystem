import { Category } from "../models/Category.models.js";



const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if(!name) {
            return res.status(400).json({
                message: 'category Name is required'
            })
        }

        const existedCategory = await Category.findOne({
            name
        });

        if(existedCategory) {
            return res.status(400).json({
                message: 'Category already exists'
            })
        }

        const createdCategory = await Category.create({
            name,
            description,
        })

        if(!createdCategory) {
            return res.status(500).json({
                message: 'Something went wrong while creating category',
            })
        }

        return res.status(201).json({
            message: 'Category created Successfully',
            data: createdCategory
        })
     } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while creating category'
        })
    }
}


export {
    createCategory,
}