'use strict'
const Cart = require("../models/cart.model");

/*
    Cart Services
    - Add product to cart [User]
    - Reduce product quantity in cart [User]
    - Increase product quantity in cart [User]
    - Get list cart items [User]
    - Delete cart  [User]
    - Delete cart item [User]
*/   

class CartService {
    static async createCart(userId, products) {
        const query = { cart_userId: userId, cart_state: 'active' },
        updateOrInsert = {
            $addToSet: { cart_products: products },
        },
        options = { upsert: true, new: true };
        
        return await Cart.findOneAndUpdate(query, updateOrInsert, options).lean()
    }

    static async updateCart(userId, products) {
        const { productId, quantity } = products
        const query = { cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active' },
        updateSet = {
            $inc: { 'cart_products.$.quantity': quantity },
        },
        options = { upsert: true, new: true };
        
        return await Cart.findOneAndUpdate(query, updateOrInsert, options).lean()
    }

    static async addToCart({ userId, products={}}) {
        //check cart exists
        const foundCart = await Cart.findOne({ cart_userId: userId }).lean()
        if(!foundCart) {
            return await CartService.createCart({userId, products})
        }

        if(!foundCart.cart_products || !foundCart.cart_products.length) {
            foundCart.cart_products = [products]
            return await foundCart.save()
        }

        //check if product exists in cart increment quantity
        return await CartService.updateCart({userId, products})
    }
}

module.exports = CartService