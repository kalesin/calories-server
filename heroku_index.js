const { Client } = require('pg');
require('dotenv').config()

console.log(process.env.DATABASE_URL)

var dbAddress = 'postgresql://romank:hilfiger@localhost:5432/users'

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT * FROM users;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
