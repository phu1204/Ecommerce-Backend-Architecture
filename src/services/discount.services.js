'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const { findAllDiscountCodesUnselect, checkExists } = require("../models/repositories/discount.repo");
const { findAllProducts, findProduct }  = require("../models/repositories/product.repo");
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
    static async createDiscountCode(payload, shopId) {

        const {
            code, start_date, end_date, is_active, min_order_value, product_ids, applies_to, name, description, type, value, max_value, max_uses, used_count, max_uses_per_user,
        } = payload


        if(new Date(start_date) < new Date() || new Date(end_date) < new Date()) {
            throw new BadRequestError("Discount code has expired or is not active yet ")
        }

        if(new Date(start_date) > new Date(end_date)) {
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
            discount_startDate: new Date(start_date),
            discount_endDate: new Date(end_date),
            discount_is_active: is_active,
            discount_shopId: convertToObjectIdMongodb(shopId),
            discount_min_order_value: min_order_value || 0,
            discount_productIds: applies_to === 'all' ? [] : product_ids,
            discount_applies_to: applies_to,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_used_count: used_count,
            discount_max_uses_per_user: max_uses_per_user
        })

        return newDiscount
    }

    static async updateDiscountCode({ code, userId, orderValue, productIds }) {
        // Logic to update the discount code based on the provided code and updateData
        // This may involve checking the validity of the discount code, updating its usage count, and applying it to the relevant products or orders
        return await discount.updateDiscountById(code, userId, orderValue, productIds)
    }

    /* Get all discount codes available with product */
    static async getAllDiscountCodesWithProduct({ code, shopId, limit = 50, page = 1 }) {

        console.log(code)
        const foundCode = await discount.findOne({discount_code: code ,discount_shopId: convertToObjectIdMongodb(shopId) }).lean()
        if(!foundCode || foundCode.discount_is_active == false) {
            throw new NotFoundError("Discount code not found")
        }

        const { discount_applies_to, discount_productIds } = foundCode

        let products;   

        if(discount_applies_to == 'all') {
            products = await findAllProducts({
                filter: { isPublished: true, _id: { $in: discount_productIds } },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_applies_to == 'specific') {
            products = await findAllProducts({
                filter: { isPublished: true, _id: { $in: discount_productIds } },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
            console.log('discount_productIds', typeof products)
        }


        return products
    }
    //get all discount codes of shop
    static async getAllDiscountCodes(shopId, limit = 50, page = 1 ) {
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            unSelect: ['__v','createdAt', 'updatedAt','discount_shopId'],
            model: discount,
            filter: { discount_shopId: convertToObjectIdMongodb(shopId), discount_is_active: true },
        })

        return discounts
    }

    /**
     * Apply discount code to an order
     */
    static async getDiscountAmount({code, userId, shopId, products}) {
        const foundDiscount = await checkExists({
            model: discount, 
            filter : { discount_code: code, discount_shopId: convertToObjectIdMongodb(shopId) }
        });
        if (!foundDiscount) { throw new NotFoundError("Discount code not found");}
        const { discount_is_active, discount_max_uses, discount_min_order_value, discount_max_uses_per_user, discount_users_used, discount_startDate, discount_endDate } = foundDiscount

        if (!discount_is_active) {throw new BadRequestError("Discount code is not active");}

        if (!discount_max_uses) {throw new BadRequestError("Discount code has reached its maximum usage limit");}
        
        // if (new Date(discount_startDate) > new Date() || new Date(discount_endDate) < new Date()) {
        //     throw new BadRequestError("Discount code has expired or is not active yet");
        // }
        
        let totalOrder = 0
        if(discount_min_order_value > 0){
            //get total
            totalOrder = products.reduce((acc, product) => acc + (product.price * product.quantity), 0)
            
            if(totalOrder < discount_min_order_value) {
                throw new BadRequestError(`Minimum order value for this discount code is ${discount_min_order_value}`);
            }
        }
        
        if(discount_max_uses_per_user > 0){
            const userUsedCount = discount_users_used.find(user => user.userId.toString() === userId.toString())
        
            if(userUsedCount && userUsedCount.count >= discount_max_uses_per_user) {
                throw new BadRequestError("You have reached the maximum usage limit for this discount code");
            }
        }

        // Check discount type is fixed amount or percentage
        const discountAmount = foundDiscount.discount_type === 'fixed_amount' ? foundDiscount.discount_value : totalOrder * (foundDiscount.discount_value / 100)
        return {
            totalOrder,
            discountAmount,
            finalAmount: totalOrder - discountAmount
        }

    }

    static async deleteDiscountCode(code, shopId) {
        // note: check if discount code exists and to be used before delete
        const deletedDiscount = await discount.findOneAndDelete({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deletedDiscount
    }
    
    static async cancelDiscountCode(code, shopId, userId) {
        const foundDiscount = await checkExists({
            model: discount, 
            filter : { discount_code: code, discount_shopId: convertToObjectIdMongodb(shopId) }
        });
        if (!foundDiscount) { throw new NotFoundError("Discount code not found");}

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                disount_users_used: userId
            },
            $inc:{
                discount_used_count: -1,
                discount_max_uses: 1
            }
        })

        return result
    }
}

module.exports = DiscountService

