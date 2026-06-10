'use strict'
const cart = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const { BadRequestError, ForbiddenError, NotFoundError } = require('../core/error.response');
const { product } = require("../models/product.model");
const { convertToObjectIdMongodb } = require("../utils");

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
    static async createCart({userId, products}) {
        const query = { cart_userId: userId, cart_state: 'active' },
        updateOrInsert = {
            $addToSet: { cart_products: products },
        },
        options = { upsert: true, new: true };
        
        return await cart.findOneAndUpdate(query, updateOrInsert, options).lean()
    }

    static async updateCart({userId, products}) {
        const { productId, quantity } = products
        const query = { cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active' },
        updateSet = {
            $inc: { 'cart_products.$.quantity': quantity },
        },
        options = { upsert: true, new: true };
        
        return await cart.findOneAndUpdate(query, updateSet, options).lean()
    }

    static async addToCart({ userId, products={}}) {
        //check cart exists
        const foundCart = await cart.findOne({ cart_userId: userId })
        console.log(foundCart)
        if(!foundCart) {
            return await CartService.createCart({userId, products})
        }

        if(!foundCart.cart_products || !foundCart.cart_products.length) {
            foundCart.cart_products = [products]
            return await foundCart.save()
        }

        const foundProduct = await getProductById(products.productId)

        //check if product exists in cart increment quantity
        return await CartService.updateCart({userId, products:{
            product_name: foundProduct.product_name,
            product_price: foundProduct.product_price,
        }})
    }
    
    //updateCart 
    /*
        shop_order_ids: [
            {
                shopId:
                item_products:[
                    quantity:
                    productId:
                    shopId:
                    old_quantity:
                    price:
                ]
                    version:
            }
        ]
    */

    static async addToCartV2({userId, shop_order_ids}) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        //check cart exists
        const foundProduct = await getProductById(productId)
        if(!foundProduct) throw new NotFoundError('Not Found This Product')

        //check shop
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) throw new NotFoundError('Not belongs to the shop')

        if(quantity === 0) {
            //deleted
        }
        
        //check if product exists in cart increment quantity
        return await CartService.updateCart({
            userId,
            products: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteItemCart({userId, productId}){
        const query = { cart_userId: userId, cart_state: 'active'},
        updateSet= {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }
        
        return await cart.updateOne(query, updateSet)
    }

    static async getListCart({userId}){
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }

}

module.exports = CartService