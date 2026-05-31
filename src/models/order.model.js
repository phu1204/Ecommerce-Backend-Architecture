'use strict'

const { model, Schema, mongoose } = require("mongoose");

const orderSchema = new Schema(
    {
        order_userId: { type: Schema.Types.ObjectId, ref: 'User'},
        order_items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product'},
                quantity: { type: Number, required: true},
                price: {type: Number, required: true},
                shopId: { type: Schema.Types.ObjectId, ref: 'Shop'},
                discount: { type: Number, default: 0},
                totalPrice: { type: Number, required: true},
            }
        ],
        totalPrice: { type: Number, required: true},
        order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending'},
        order_discountCode: { type: String, default: null},
        order_paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod'},
        order_paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending'},
        order_shippingAddress: { type: String, required: true},
        order_shippingFee: { type: Number, default: 0},
        order_deliveryDate: { type: Date, default: null},
    },
    {
        colection: 'Orders',
        timestamps: true    
    }
)

module.exports = model('Order', orderSchema)