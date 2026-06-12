'use strict'

const { BadRequestError } = require("../core/error.response")
const cart = require("../models/cart.model")
const order = require("../models/order.model")
const findCartById = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.services")
const { acquireLock, releaseLock } = require("./redis.services")

/*
        {
            cartId,
            userId,
            shop_order_ids:[
                {
                    shopId,
                    shop_discounts:[
                        {
                            shopId,
                            discountId,
                            code,
                        }
                    ],
                    item_products:[
                       {
                            price,
                            quantity,
                            productId,
                        },
                        {
                            price,
                            quantity,
                            productId,
                        }
                    ]
                },
                {
                    shopId,
                    shop_discounts:[
                        {
                            shopId,
                            discountId,
                            code,
                        }
                    ],
                    item_products:[
                       {
                            price,
                            quantity,
                            productId,
                        }
                    ]
                }

            ]
        }
    */ 
class CheckoutService {
    static async checkoutReview ({userId, cartId, shop_order_ids = []}) {
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new NotFoundError('Cart not found')

        const check_order = {
            totalOrder: 0, // trong gia tri don hang cua shop do
            feeShip: 0, // phi van chuyen 
            totalDiscount: 0, //tong gia tri giảm
            totalCheckout: 0 // ton thanh toan
        }, shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids.length ; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            // checkk all product available
            const checkProducts = await checkProductByServer(item_products)
            if(!checkProducts[0]) throw new NotFoundError('Order Wrong!!!')
                const checkoutPrice = checkProducts.reduce((acc, product) => {
                return acc + (product.price * product.quantity)
            }, 0)

            // console.log(checkoutPrice)

            //tong tien truoc khi xu ly
            check_order.totalOrder += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApllyDiscount: checkoutPrice,
                item_products: checkProducts
            }

            //neu co discount thi check xem co hop le hay khong
            if(shop_discounts.length > 0){
                //gia su co 1 discount
                //get amount discount
                const { finalAmount = 0, discountAmount = 0} = await getDiscountAmount({
                    code: shop_discounts[0].code,
                    userId: shop_discounts[0].userId,
                    shopId: shop_discounts[0].shopId,
                    products: item_products
                })

                console.log(finalAmount)
                console.log(discountAmount)

                check_order.totalDiscount += discountAmount

                // neu tien giam gia lon hon 0
                if(discountAmount > 0){
                    itemCheckout.priceApllyDiscount = checkoutPrice - discountAmount
                }
            }

            //thanh toan cuoi cung
            check_order.totalCheckout += itemCheckout.priceApllyDiscount
            shop_order_ids_new.push(itemCheckout)

        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            check_order
        }
    }

    static async orderByUser ({
        shop_order_ids,
        cartId,
        userId,
        user_address={},
        user_payment={},
    }) {
        const { shop_order_ids_new, check_order } = await CheckoutService.checkoutReview({userId, cartId, shop_order_ids})
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, cartId, quantity } = products[i];
            const keyLock = await acquireLock(productId, cartId, quantity)
            acquireProduct.push(keyLock ? true : false)
            if(keyLock){
                await releaseLock(keyLock)
            }
        }
        
        if(acquireProduct.includes(false)){
            throw new BadRequestError('Out of Stock, pls check product again')
        }

        const newOrder = await order.create({
            order_userId: order_userId,
            order_checkout: order_checkout,
            order_shippingAddress: order_shippingAddress,
            order_status: order_status,
            order_products: order_products,
            order_paymentStatus: order_paymentStatus,
            order_paymentMethod: order_paymentMethod,
            order_trackingNumber: order_trackingNumber,
        })

        // if order create have to delete cart
        if(newOrder){
            return await cart.deleteOne({_id: cartId})
        }
    }

    //Query Orders [User]
    static async getOrderByUser(){}

    //Query a order by User[User]
    static async getOneOrderByUser(){}

    //Cancel Order[User]
    static async cancelOrderByUser(){}

    //Update Order[User]
    static async updateOrderStatusByShop(){}
}

module.exports = CheckoutService