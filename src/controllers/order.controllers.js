import { Order } from "../models/Order.models.js";
import { OrderItems } from "../models/OrderItems.models.js";
import { Cart } from "../models/Cart.models.js";
import { Product } from "../models/Product.models.js";
import getPagination from "../services/pagination.js";


const placeOrder = async (req, res) => {
    try {


        const cartItems = await Cart.find({ 
            userId: req.user._id 
        }).populate('productId', 'name price stock')


        if(cartItems.length === 0) {
            return res.status(400).json({
                message: 'Cart is empty'
            })
        }


        let totalPrice = 0

        for(const item of cartItems) {
            totalPrice += item.productId.price * item.quantity
        }


        const order = await Order.create({
            userId: req.user._id,
            totalPrice,
            status: 'pending'
        })

        for(const item of cartItems) {
            await OrderItems.create({
                orderId: order._id,
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            })

            await Product.findByIdAndUpdate(
                item.productId._id,
                { stock: item.productId.stock - item.quantity },
                { new: true }
            )
        }


        await Cart.deleteMany({ userId: req.user._id })


        return res.status(201).json({
            message: 'Order placed successfully',
            data: order
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while placing order'
        })
    }
}

const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({ 
            userId: req.user._id 
        })

        if(orders.length === 0) {
            return res.status(404).json({
                message: 'No orders found'
            })
        }

        return res.status(200).json({
            message: 'Orders fetched successfully',
            data: orders
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while getting orders'
        })
    }
}

const getSingleOrder = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id)

        if(!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        if(order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You are not allowed to view this order'
            })
        }

        const orderItems = await OrderItems.find({ 
            orderId: order._id 
        }).populate('productId', 'name price image')

        return res.status(200).json({
            message: 'Order fetched successfully',
            data: {
                order,
                orderItems
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while getting order'
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body

        const allowedStatus = [
            'pending', 
            'processing', 
            'delivered', 
            'cancelled'
        ]

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status value'
            })
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        if(!updatedOrder) {
            return res.status(404).json({
                message: 'Order not found'
            })
        }

        return res.status(200).json({
            message: 'Order status updated successfully',
            data: updatedOrder
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while updating order status'
        })
    }
}

const getAllOrders = async (req, res) => {
    try {

        // Pagination
        const { page, limit, skip } = getPagination(req.query)

        const orders = await Order.find()
            .populate('userId', 'name email')
            .skip(skip)
            .limit(limit)

        if(orders.length === 0) {
            return res.status(404).json({
                message: 'No orders found'
            })
        }

        const totalOrders = await Order.countDocuments()

        return res.status(200).json({
            message: 'All orders fetched successfully',
            data: orders,
            pagination: {
                totalOrders,
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                limit
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error while getting all orders'
        })
    }
}



export {
    placeOrder,
    getMyOrders,
    getSingleOrder,
    updateOrderStatus,
    getAllOrders
}