'use strict'

const { OK, CREATED, SuccessReponse } = require("../core/success.reponse")
const ProductService2 = require("../services/product.services")

class ProductController {
    createProduct = async (req, res, next) => {
           new SuccessReponse({
            message: 'Created Product Success',
            metadata: await ProductService2.createProduct(req.body.product_type, { ...req.body, product_shop: req.user.userId }),
        }).send(res) 
    }

    findAllDraft =  async (req, res, next) => {
           new SuccessReponse({
            message: 'Get List Success',
            metadata: await ProductService2.findAllDraft({ product_shop: req.user.userId })
        }).send(res) 
    }

    findAllPublished =  async (req, res, next) => {
           new SuccessReponse({
            message: 'Get List Product Published Success',
            metadata: await ProductService2.findAllPublished({ product_shop: req.user.userId })
        }).send(res) 
    }

    publishedProductByShop =  async (req, res, next) => {
           new SuccessReponse({
            message: 'Published Product Success',
            metadata: await ProductService2.publishedProductByShop({ product_shop: req.user.userId, product_id: req.params.id })
        }).send(res) 
    }

    searchProductByUser =  async (req, res, next) => {
           new SuccessReponse({
            message: 'Search Product Success',
            metadata: await ProductService2.searchProductByUser( {keySearch: req.params.keySearch })
        }).send(res) 
    }

    findAllProducts =  async (req, res, next) => {
           new SuccessReponse({
            message: 'Get List Products Success',
            metadata: await ProductService2.findAllProducts(req.query)
        }).send(res) 
    }

    findProduct =  async (req, res, next) => {
           new SuccessReponse({
            message: 'Get Product Success',
            metadata: await ProductService2.findProduct({product_id: req.params.product_id})
        }).send(res) 
    }

    updateProduct =  async (req, res, next) => {
           new SuccessReponse({
            message: 'Update Product Success',
            metadata: await ProductService2.updateProduct(req.body.product_type, req.params.product_id, { ...req.body, product_shop: req.user.userId })
        }).send(res) 
    }
}

module.exports = new ProductController()