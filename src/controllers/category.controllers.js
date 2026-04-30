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

const updateCategory = async (req, res) => {
    try {

        const category = await Category.findById(req.params.id);


        if(!category) {
            return res.status(404).json({
                message: 'Category doesNot exists'
            })
        }
        

        const key = Object.keys(req.body);

        const allowedFields = ['name','description'];

        const isValid = key.every((fields) => allowedFields.includes(fields))

        if(!isValid) {
            return res.status(400).json({
                message: 'You cannot update this field'
            })
        }


        if(req.body.name) {
            const existedCategory = await Category.findOne({
                name: req.body.name
            });

            if(existedCategory) {
                return res.status(400).json({
                    message: 'Category with this name already exists'
                })
            }
        }


        const updatedCategory = await Category.findByIdAndUpdate(
            category._id,
            req.body,
            { new: true }
        )

        return res.status(200).json({
            message: 'Category updated successfully',
            data: updatedCategory
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error while updating category'
        })
    }
}


export {
    createCategory,
    updateCategory,
}