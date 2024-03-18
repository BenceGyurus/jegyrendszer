const readFromRedisCache = async (redis, key) => {
    return await redis.get(key).then((result) => {
      return result;
    });
  };

const RedisMiddleware  = async (req,res, redis, next)=>{
    try{
        const cachedData = await readFromRedisCache(redis, req.url);
        if (cachedData) res.send(zlib.inflateSync(Buffer.from(cachedData, "base64")).toString());
        else next();
    }catch{
        next();
    }
}

module.exports = RedisMiddleware;