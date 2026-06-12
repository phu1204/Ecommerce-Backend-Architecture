const { convertToObjectIdMongodb } = require('../../utils')
const { inventory } = require('../iventory.model')
const { product } = require('../product.model')
const createInventory = async ({ productId, shopId, stock, location}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location,
    })
}

const reservationIventory = async({ productId, cartId, quanity}) => {
    const query = {
        inven_productId: convertToObjectIdMongodb(productId)
    },
    updateSet= {
        $inc: {
            inven_stock: -quanity
        },
        $push: {
            inven_reservations:{
                cartId,
                productId,
                quanity
            }
        }
    },
    options={upsert: true, new: true}

    return await inventory.updateOne({query, updateSet, options})
}

module.exports = {
    createInventory,
    reservationIventory
}