const { Types } = require("mongoose")
const { product, clothing, electronic, furniture } = require("../product.model")
const { getSelectData, unGetSelectData } = require("../../utils")

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

module.exports = {
    findAllDraftRepo,
    publishedProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct
}