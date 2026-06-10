'use strict'

const { SuccessReponse } = require("../core/success.reponse")
const CartService = require("../services/cart.services")

class CartControler{
    addItemCart = async (req, res, next) => {
        new SuccessReponse({
            message: 'Added Product Successfull',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateItemCart = async (req, res, next) => {
        new SuccessReponse({
            message: 'Added Product Successfull',
            metadata: await CartService.addToCartV2( req.body )
        }).send(res)
    }

    deleteItemCart = async (req, res, next) => {
        new SuccessReponse({
            message: 'Added Product Successfull',
            metadata: await CartService.deleteItemCart( req.body )
        }).send(res)
    }

    getListItemCart = async (req, res, next) => {
        new SuccessReponse({
            message: 'Added Product Successfull',
            metadata: await CartService.getListCart(req.query)
        }).send(res)
    }
}

module.exports = new CartControler()