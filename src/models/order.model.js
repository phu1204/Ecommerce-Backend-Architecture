'use strict'

const { model, Schema, mongoose } = require("mongoose");

const orderSchema = new Schema(
    {
        order_userId: { type: Schema.Types.ObjectId, ref: 'User'},
        order_checkout : { type: Object, default: {}},
        /*
            order_checkout: {
                totalPrice,
                totalApplyDiscount,
                fee
            }
            */
        order_shippingAddress: { type: Object, defaut: {}, required: true},
        order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending'},
        order_products: { type: Array, default: []},
        order_paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending'},
        order_paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod'},
        order_trackingNumber: { type: Number, default: 'xxx0932121731'}
    },
    {
        colection: 'Orders',
        timestamps: true    
    }
)

module.exports = model('Order', orderSchema)