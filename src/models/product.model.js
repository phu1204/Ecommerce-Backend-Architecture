'use strict'

const { model, Schema, Types } = require('mongoose')
const slugify = require("slugify")

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema ({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,    
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'},
    product_slug: String, // quan-jeans-cao-cap
    product_variations: { type: Array, default:[]},
    product_ratingAvg: {
        type: Number,
        default: 4.5,
        min: [1,'Must be above 1.0'],
        max: [5,'Must be below 5.0'],
        set: (val) => {
        if (val == null) return 4.5
        return Math.round(val * 10) / 10
  }
    },
    isDraft: {type: Boolean, default: true, index: true, selected: false},
    isPublished: {type: Boolean, default: false, index: true, selected: false},
    product_attributes: { type: Schema.Types.Mixed, required: true }
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

//create index for search
productSchema.index({ product_name: 'text', product_description: 'text'})

// run before model save and create
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next();a
})

const clothingSchema = new Schema({
    brand: { type: String, require: true},
    size: { type: String, require: true},
    metarial: String,
    product_shop: Schema.Types.ObjectId
},{
    collection:'Clothes',
    timestamps: String
})

const electronicSchema = new Schema({
    manufacturer: { type: String, require: true},
    model: String,
    color: String,
    product_shop: Schema.Types.ObjectId
},{
    collection:'Electronics',
    timestamps: String
})

const furnitureSchema = new Schema({
    brand: { type: String, require: true},
    size: { type: String, require: true},
    metarial: String,
    product_shop: Schema.Types.ObjectId
},{
    collection:'Furnitures',
    timestamps: String
})

module.exports = {
    product: model( DOCUMENT_NAME, productSchema ),
    clothing: model( 'Clothes', clothingSchema),
    electronic: model( 'Electronics', electronicSchema),
    furniture: model( 'Furnitures',furnitureSchema)
}