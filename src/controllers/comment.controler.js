'use strict'

const { SuccessReponse } = require("../core/success.reponse")
const CommentServices = require("../services/comment.services")

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessReponse({
            message: 'Created Discount Success',
            metadata: await CommentServices.createComment(req.body),
        }).send(res) 
    }
}

module.exports = new CommentController()