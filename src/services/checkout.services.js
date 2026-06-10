'use strict'

const findCartById = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.services")

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
}

module.exports = CheckoutService