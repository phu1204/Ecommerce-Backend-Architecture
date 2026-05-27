'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const { findAllProducts }  = require("../models/repositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

`* @description: discount services
    - Generate discount codes [Shop | Admin]
    - Get discount amount [User]
    - Get all discount  [Shop | Admin]
    - Verify discount code [User]
    - Delete discount code [Shop | Admin]
    - Cancel discount code [User]
`

class DiscountService {
    static async createDiscountCode(payload) {
        // Logic to generate a discount code based on the provided discountData
        // This may involve creating a new discount entry in the database and generating a unique code
        const {
            code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description, type, value, max_value, max_uses, used_count, max_uses_per_user, shopId,
        } = payload

        if(new Date(start_date) < new Date() || new Date(end_date) < new Date()) {
            throw new BadRequestError("Discount code has expired or is not active yet ")
        }

        if(new Date(start_date) < new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date")
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({ discount_code: code, discount_shopId: convertToObjectIdMongodb(shopId) }).lean()
        if(foundDiscount && foundDiscount.is_active == true) {
            throw new BadRequestError("Discount code already exists")
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_is_active: is_active,
            discount_shopId: convertToObjectIdMongodb(shopId),
            discount_min_order_value: min_order_value || 0,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
            discount_applies_to: applies_to,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_used_count: used_count,
            discount_max_uses_per_user: max_uses_per_user
        })
    }

    static async updateDiscountCode({ code, userId, orderValue, productIds }) {
        // Logic to update the discount code based on the provided code and updateData
        // This may involve checking the validity of the discount code, updating its usage count, and applying it to the relevant products or orders
        return await discount.updateDiscountById(code, userId, orderValue, productIds)
    }

    /* Get all discount codes available with product */
    static async getAllDiscountCodes({ code, shopId, limit = 50, page = 1 }) {
        const foundCode = await discount.findOne({ discount_code: code, discount_shopId: convertToObjectIdMongodb(shopId) }).lean()

        if(!foundCode || foundCode.discount_is_active == false) {
            throw new NotFoundError("Discount code not found")
        }

        const { discount_applies_to, discount_product_ids } = foundCode

        let products;

        if(discount_applies_to == 'all') {
            products = await findAllProducts({
                filter: { isPublished: true, _id: { $in: discount_product_ids } },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            }).lean()
        }

        if(discount_applies_to == 'specific') {
            products = await findAllProducts({
                filter: { isPublished: true, _id: { $in: discount_product_ids } },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            }).lean()
        }
    }
    //get all discount codes of shop
    static async getAllDiscountCodesByShop(limit, page, shopId) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            unSelect: ['__v','createdAt', 'updatedAt','discount_shopId'],
            model: discount,
            filter: { discount_shopId: convertToObjectIdMongodb(shopId), discount_is_active: true },
        })
        return discounts
    }
}



