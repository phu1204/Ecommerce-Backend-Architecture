'use strict'

const { model, Schema, mongoose } = require("mongoose");

const cartSchema = new Schema(
    {
        cart_userId: { type: Schema.Types.ObjectId, ref: 'User'},
        cart_state: { type: String, enum: ['active', 'inactive'], default: 'active'},
        cart_product_count: { type: Number, default: 0},
        cart_products: { type: Array, require: true, default: []},
        /*
            [
                { 
                    productId
                    shopId
                    quantity
                    name
                    price
                }
            ]
        */ 
    },
    {
        collection: 'Carts',
        timestamps: true    
    }
)

module.exports = model('Cart', cartSchema)