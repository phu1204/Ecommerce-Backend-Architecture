const Comment = require("../models/comment.model");
const { convertToObjectIdMongodb } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");
class CommentService {
  static async createComment(payload) {
    const { productId, userId, content, parentCommentId } = payload;

    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Comment not found");

      rightValue = parentComment.comment_right;

      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        },
      );

      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        },
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } },
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    await comment.save();
    return comment;
  }
}

module.exports = CommentService;
