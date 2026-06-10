const { Types } = require("mongoose")
const { product, clothing, electronic, furniture } = require("../product.model")
const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require("../../utils")
const { NotFoundError } = require("../../core/error.response")

const findAllDraftRepo = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const publishedProductByShop = async({product_shop, product_id}) => {
   const foundShop = await product.findOne({product_shop: product_shop, _id: product_id})

   if(!foundShop) return null

   foundShop.isDraft = false
   foundShop.isPublished = true

   const {modifiedCount} = await foundShop.updateOne(foundShop)

   return modifiedCount
}

const searchProductByUser = async({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.findOne({
        isPublished: true,
        $text: { $search: regexSearch}
    },
        {score: {$meta: 'textScore'}}
    ).sort({score: {$meta: 'textScore'}}).lean()

    return results
}

const queryProduct = async({query, limit, skip}) => {
     return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const getProductById = async(productId) => {
     return await product.findOne({_id: convertToObjectIdMongodb(productId)})
    .lean()
}

const findAllProducts = async({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

const findProduct = async({product_id, unSelect}) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect)).lean()
}

const updateProductById = async({product_id, bodyUpdate, model, isNew = true}) => {
    return await model.findByIdAndUpdate(product_id, bodyUpdate, {
        new: isNew
    })
}

const checkProductByServer = async(products) => {
    return await Promise.all(products.map( async product => {
        const foundProduct = await getProductById(product.productId)
        if(!foundProduct) throw new NotFoundError('Product not exist in shop')
            
        return {
            price: foundProduct.product_price,
            quantity: product.quantity,
            productId: foundProduct._id
        }
    }))
}

module.exports = {
    findAllDraftRepo,
    publishedProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
    checkProductByServer
}