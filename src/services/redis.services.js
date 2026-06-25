"use strict";

const redis = require("redis");
const { promisify } = require("util"); // chane a funciton to async await function
const { reservationIventory } = require("../models/repositories/iventory.repo");
const redisClient = redis.createClient();

redisClient.on("connect", () => console.log("Redis Client đang kết nối..."));

redisClient.connect()
    .then(async () => {
        console.log("Kết nối thành công tới Redis Server!");
        const pingResult = await redisClient.ping();
        console.log("Redis PING Test:", pingResult);
    })
    .catch((error) => {
        console.error("Không thể kết nối đến Redis ngầm:", error);
    });

const acquireLock = async (productId, cartId, quantity) => {
  const key = `lock_v2026_${productId}`;
  const retryTime = 10; // 10 lan thu
  const expTime = 3000; // 3s lock temp

  for (let i = 0; i < retryTime.length; i++) {
    // create key, who get key can go checkout
    const result = await redisClient.setnx(key, expTime);
    console.log("Result:", result);
    if (result === 1) {
      // handle inventory
      const isReservation = await reservationIventory({
        productId,
        cartId,
        quanity,
      });
      if (isReservation.modifiedCount) {
        await pexpire(key, expTime);
        return key;
      } else return null;
    } else {
      return await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delKeyLock = promisify(redisClient.del).bind(redisClient);
  return await delKeyLock(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
