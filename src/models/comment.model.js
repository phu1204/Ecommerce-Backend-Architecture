'use strict'

const { model, Schema, mongoose } = require("mongoose");

const commentSchema = new Schema(
    {
        comment_productId: { type: Schema.Types.ObjectId, ref: 'Shop'},
        comment_userId: { type: Number },
        comment_content: { type: String, default: 'text'},
        comment_left: { type: Number, default: 0},
        comment_right: { type: Number, default: 0},
        comment_parentId: { type: Schema.Types.ObjectId, ref: 'Comment'}
      
    },
    {
        collection: 'Comments',
        timestamps: true    
    }
)

module.exports = model('Comment', commentSchema)