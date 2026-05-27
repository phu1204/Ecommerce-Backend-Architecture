"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: {type: String, required: true,},
    discount_type: {type: String, default: "fixed mount", }, // percentage or fixed amount
    discount_value: {type: Number, require: true,}, //10,00 , 10
    discount_code: {type: String, require: true,}, //discount code for customer to use
    discount_startDate: {type: Date, required: true,}, // the date when the discount becomes active
    discount_endDate: {type: Date, required: true,}, //   the date when the discount expires
    discount_max_uses: {type: Number, default: 0, required: true,}, // the maximum number of times the discount can be used 
    discount_used_count : {type: Number, required: true,}, // the number of times the discount has been used
    discount_users_used: {type: Array, default: []}, // an array to track which users have used the discount
    discount_max_uses_per_user: {type: Number, default: 1, required: true,}, // the maximum number of times a single user can use the discount
    discount_min_order_value: {type: Number, default: 0, required: true,}, // the minimum order value required to apply the discount
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' }, // the shop that the discount belongs to

    discount_is_active: { type: Boolean, default: true }, // indicates whether the discount is currently active
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] }, // specifies whether the discount applies to all products or specific products
    discount_productIds: [{ type: Array, default: [] }], // an array of product IDs that the discount applies to (if discount_applies_to is 'specific')
  },
  {
    collection: "Discounts",
    timestamps: true,
  },
);

module.exports = { discount: model("Discount", discountSchema) };
