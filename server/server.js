const express = require('express');
const redis = require('redis');
const {Pool} = require('pg');
const keys = require('./config/keys');
const app = express();

// connect to redis

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

const redisClient = redis.createClient({
  host: keys.REDIS_HOST,
  port: keys.REDIS_PORT,
  retry_strategy: ()=> 1000
});

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost pg connection'));

pgClient.on('connect', () => {
  pgClient.query('CREATE TABLE IF NOT EXISTS VALUES (NUMBER INT)')
  .catch(err => console.log(err));  
});


const redisPublisher = redisClient.duplicate();


app.get('/', (req, res) => {
  res.send('Welcome to backend');
});

app.get('/values/all', async(req, res) => {
  const values = await pgClient.query('SELECT * FROM VALUES');
  res.send(values.rows);
});

app.get('/values/current', (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values)
  });
});

app.post('/values', async(req, res) => {
  const index = req.body.index;
  if(index > 40){
    return res.status(422).send('Index too high');
  }


  redisClient.hset('values', index, 'Nothing yet');

  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO VALUES(NUMBER) VALUES($1)', [index]);
  res.send({working: true});

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at localhost:${PORT}`);
});