'use strict'

const { mongoose, Schema } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        maxlength: 150
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        // required:true,
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify:{
        type: Schema.Types.Boolean,
        defalut: false
    },
    roles:{
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: 'Shops'
});

//Export the model
module.exports = mongoose.model('shop', shopSchema);