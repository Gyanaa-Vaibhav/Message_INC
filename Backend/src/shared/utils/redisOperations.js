import Redis from "ioredis";
const redis = new Redis();

export async function storeToRedis(room,message) {
    await redis.lpush(room, message);
}

export async function getFromRedis(room) {
    return await redis.lrange(room, 0, -1);
}

export async function setExpiry(room){
    await redis.expire(room, 3600);
}