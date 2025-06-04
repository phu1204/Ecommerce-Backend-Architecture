'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const keyTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
    refreshToken: { type: String, require: true},
    refreshTokensUsed: { type: Array, require: true, default: []},
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "KeyTokens",
    timestamps: true
  }
);

module.exports = mongoose.model("KeyToken", keyTokenSchema);
