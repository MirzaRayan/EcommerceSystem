import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ["pending", "processing", "delivered", "cancelled"],
            default: "pending"
        }
    },
    { timestamps: true }
)

export const Order = mongoose.model("Order", orderSchema)