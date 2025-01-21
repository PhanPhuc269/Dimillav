const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: 'NBbQXNFY8NU7uX8NCUpoMagALBm8t58g',
    socket: {
        host: 'redis-19991.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com',
        port: 19991
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

async function connectRedis() {
    await redisClient.connect();
    await redisClient.set('foo', 'bar');
    const result = await redisClient.get('foo');
    console.log(result);  // >>> bar
}

connectRedis();

module.exports = redisClient;