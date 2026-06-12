'use strict'

const { BadRequestError } = require("../core/error.response")
const { inventory } = require("../models/iventory.model")
const { getProductById } = require("../models/repositories/product.repo")

class InventoryService {
    static async addStockToIventory ({
        productId,
        shopId,
        stock,
        location = '123 Luy Ban Bich, HCM City, VN'
    }) {
        const product = await getProductById(productId)
        if(!product){
            throw new BadRequestError('Product does not exist')
        }

        const query = { inven_productId: productId, inven_shopId: shopId},
        updateSet={
            $inc:{
                iven_stock: quantity
            },
            $set:{
                iven_location: location
            }
        },
        options={upsert: true, new:true}

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService