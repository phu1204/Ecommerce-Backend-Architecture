'use strict'

const {model, Schema, Types} = require("mongoose");

const inventorySchema = new Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: 'Product'},
    inven_location: { type: String, default: 'unKnow'},
    inven_stock: { type: Number, require: true},
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop'},
    inven_reservations: { type: Array, default: []} //ensure in pre-order
  },
  {
    collection: "Inventories",
    timestamps: true
  }
);

module.exports = {
  inventory: model("Inventory", inventorySchema)
}
