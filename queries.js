/* const Pool = require('pg').Pool
const pool = new Pool({
  user: 'romank',
  host: 'localhost',
  database: 'users',
  password: 'hilfiger',
  port: 5432,
}) */

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

client.connect();

const truncateTable = () => {
  return new Promise((resolve) => {
    client.query('TRUNCATE users', (err, res) => {
      if (err) throw err;
      resolve(res.rows);
    })
  })
}

const resetId = () => {
  return new Promise((resolve) => {
    client.query(`DBCC CHECKIDENT (users, RESEED, 0)
    GO`, (err, res) => {
      if (err) throw err;
      resolve(res.rows);
    })
  })
}

const getUsers = () => {
  return new Promise((resolve) => {
    client.query('SELECT * FROM users ORDER BY id ASC', (err, res) => {
      if (err) throw err;
      resolve(res.rows);
    })
  })
}

const getUserById = (id) => {
  return new Promise(resolve => {
    client.query('SELECT * FROM food WHERE id = $1', [id], (err, res) => {
      if (err) throw err;
      console.log(res.rows);
      res.rows.length ? resolve(res.rows) : resolve(null);
    })
  })
}

const getUserByEmail = (email) => {
  return new Promise(resolve => {
    client.query('SELECT * FROM users WHERE email = $1', [email], (err, res) => {
      if (err) throw err;
      res.rows.length ? resolve(res.rows[0]) : resolve(null);
    })
  })
}

const createUser = ({ name, email }) => {
  return new Promise(resolve => {
    client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email], (err, res) => {
      if (err) throw err;
      resolve(res.rows[0]);
    })
  })
}

const updateUser = ({ name, email, id }) => {
  return new Promise(resolve => {
    client.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id',
      [name, email, id], (err, res) => {
        if (err) throw err;
        resolve(res.rows[0]);
      }
    )
  })
}

const deleteUser = (id) => {
  return new Promise(resolve => {
    client.query('DELETE FROM users WHERE id = $1 RETURNING id', [id], (err, res) => {
      if (err) throw err;
      resolve(res.rows[0]);
    }
    )
  })
}

const searchFood = (name) => {
  return new Promise(resolve => {
    client.query('SELECT * FROM food WHERE upper(NAME) LIKE upper($1)', ['%'+name+'%'], (err, res) => {
      if (err) throw err;
      resolve(res.rows);
    })
  })
}
const searchFoodDouble = (name1, name2) => {
  return new Promise(resolve => {
    client.query('SELECT * FROM food WHERE upper(NAME) LIKE upper($1) AND upper(NAME) LIKE upper($2)', ['%'+name1+'%', '%'+name2+'%'], (err, res) => {
      if (err) throw err;
      resolve(res.rows);
    })
  })
}

module.exports = {
  searchFood,
  searchFoodDouble,
  getUserById,
  /* 
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail */
}
