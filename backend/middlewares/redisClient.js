import { createClient } from "redis";

const redisClient = createClient({ 
    url: process.env.REDIS_URL,
    socket: {
        tls: process.env.NODE_ENV === "production",
    }
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

await redisClient.connect();
console.log("Redis client connected");

export default redisClient;