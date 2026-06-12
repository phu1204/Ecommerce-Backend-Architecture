'use strict'

const { SuccessReponse } = require("../core/success.reponse")
const InventoryService = require("../services/inventory.services")

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessReponse({
            message: 'Added Stock To Inventory Success',
            metadata: await InventoryService.addStockToIventory(req.body),
        }).send(res) 
    }
}

module.exports = new InventoryController()