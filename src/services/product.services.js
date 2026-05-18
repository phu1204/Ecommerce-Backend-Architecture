'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')
const listProductType = require('../configs/product.config')
const { findAllDraftRepo, publishedProductByShop,searchProductByUser, findAllProducts, findProduct, updateProductById } = require('../models/repositories/product.repo')
const { updateNestedObjectPaser } = require('../utils')
class ProductFactory {

    static productRegistry = {} //key-class

    static registerProductType(type,classRef){
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct (type, payload) {
        const productClass = ProductFactory.productRegistry[type]

        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)  
        
        return new productClass(payload).createProduct()
    }

    static async updateProduct (type, product_id, payload) {
        const productClass = ProductFactory.productRegistry[type]

        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)  
        
        return new productClass(payload).updateProduct(product_id)
    }

    static async findAllDraft({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isDraft: true}
        return await findAllDraftRepo({query, limit, skip})
    }

    static async findAllPublished({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isPublished: true}
        return await findAllDraftRepo({query, limit, skip})
    }

    static async publishedProductByShop({product_shop, product_id}){
        return await publishedProductByShop({product_shop, product_id})
    }

    static async searchProductByUser({keySearch}){
        return await searchProductByUser({keySearch})
    }

    static async findAllProducts ({sort = 'ctime', limit = 50, page = 1, filter = {isPublished: true} }) {
        return await findAllProducts({sort, limit, page, filter, select: ['product_name', 'product_price', 'product_thumb', 'product_slug']})
    }

    static async findProduct ({product_id}) {
        return await findProduct({product_id, unSelect: ['__v', 'product_variations']})
    }
}

class Product {
    constructor({product_name, product_description, product_thumb, product_price, product_quantity, product_type, product_shop, product_slug, product_variations, product_ratingAvg, isDraft, isPublished , product_attributes }){
        this.product_name = product_name,
        this.product_description = product_description,
        this.product_thumb = product_thumb,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_slug = product_slug,
        this.product_variations = product_variations,
        this.product_ratingAvg = product_ratingAvg,
        this.isDraft = isDraft,
        this.isPublished = isPublished,
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct( product_id ){
        return await product.create({...this, _id: product_id})
    }

    async updateProduct ( product_id, bodyUpdate ){
        return await updateProductById({product_id, bodyUpdate, model: product})
    }
}

class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create({...this.product_attributes, product_shop: this.product_shop })
        if(!newClothing) throw new BadRequestError('Create New Product Error')
        
        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Create New Product Error')
        return newProduct
    }

    async updateProduct( product_id ){
        // remove all attr has null or underfined
        const objectParams = this
        // update where ? (1 is child, 2 is parent)
        if(objectParams.product_attributes){
            //update child
            await updateProductById({product_id, bodyUpdate: updateNestedObjectPaser(objectParams.product_attributes), model: clothing})
       }

       const updateProduct = await super.updateProduct(product_id, updateNestedObjectPaser(objectParams))
       return updateProduct
    }
}

class Electronic extends Product {
    async createProduct(){
        const newElectronic = await electronic.create(this.product_attributes,
            { product_shop: this.product_shop });
        if(!newElectronic) throw new BadRequestError('Create New Product Error')
            
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create New Product Error')
        return newProduct
    }
}

class Furniture extends Product {
    async createProduct(){
        const newFurniture = await furniture.create(this.product_attributes,
            { product_shop: this.product_shop });
        if(!newFurniture) throw new BadRequestError('Create New Product Error')
            
        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Create New Product Error')
        return newProduct
    }
}

const classMap = { Clothing, Electronic, Furniture }

listProductType.forEach(type => {
    ProductFactory.registerProductType(type, classMap[type])
})

module.exports = ProductFactory