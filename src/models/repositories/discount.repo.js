const { unGetSelectData,getSelectData } = require("../../utils");
const { discount } = require("../discount.model");
const { product } = require("../product.model");

const findAllDiscountCodesUnselect = async ({
    limit, page, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean()
}

const findAllDiscountCodesSelect = async ({
    limit, page, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select((unSelect))
        .lean()
}

const updateDiscountById = async (code, userId, orderValue, productIds) => {
  return await discount.findOneAndUpdate(
    { discount_code: code },
    {
      $inc: { discount_used_count: 1 },
      $push: { discount_users_used: userId },
    },
    { new: true }
  ).lean();
}  

