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

module.exports = {
    createInventory
}