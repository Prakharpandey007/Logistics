import {createClient} from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient=createClient({
    // password:process.env.REDIS_PASSWORD,
    // socket:{
    //     host:process.env.REDIS_HOST,
    //     port:parseInt(process.env.REDIS_PORT,10)
    // }
});

redisClient.on('error',(err)=>console.error('Redis connection error',err));

//connect to redis 
redisClient.connect()
    .then(()=>console.log("connected to redis successfully"))
    .catch(()=>console.error("redis conection error",err));

export default redisClient;


