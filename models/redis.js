const redis = require('redis');
require("dotenv").config()

const client = redis.createClient({url: process.env.REDIS_URL});
(async () => {
  await client.connect();
})();

client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err) => console.log('<:: Redis Client Error', err));

module.exports = {
  setToken(token, exSecs){
    client.set(token, 1, "EX", exSecs );
  },
  del(token=""){
    client.del(token);
  },
  get: async (token)=>{
    return client.get(token)
  }
};

