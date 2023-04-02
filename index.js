const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested, Content-Type, Accept Authorization"
    )
    if (req.method === "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "POST, PUT, PATCH, GET, DELETE"
        )
        return res.status(200).json({})
    }
    next()
})

//use specific port
console.log(process.env.DATABASE_URL)
app.listen(port, () => console.log(`Listening on port ${port}`))

//data
const db = require('./queries')

//helpers

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', async (request, response) => {
    const users = await db.getUsers();
    response.status(200).json(users);
})

app.get('/food/:id', async (request, response) => {
    console.log(request.params)
    const id = parseInt(request.params.id)
    const user = await db.getUserById(id);
    user ? response.status(200).json(user[0]) : response.status(404).send(`User with Id ${id} not found.`);
})

//heroku db search

app.get('/food/', async (request, response) => {
    const name = request.query.name;
    let query = name.split(" ");
    let item = null;
    if (query.length > 1) {
        item = await db.searchFoodDouble(query[0], query[1])
    } else {
        item = await db.searchFood(name);
    }

    item ? response.status(200).json(item) : response.status(404).send(`Food with name ${name} not found.`);
})

////

app.post('/users', async (request, response) => {
    const { name, email } = request.body;
    const userExists = await db.getUserByEmail(email);
    console.log(userExists);
    if (!userExists) {
        const user = await db.createUser({ name, email });
        user ? response.status(200).send(`Added user ${name}, ${email} with id: ${user.id}.`) : response.status(404).send(`Something went wrong.`);
    } else {
        response.status(400).send(`User with email already exists.`)
    }
})

app.put('/users/:id', async (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body;

    const user = await db.getUserById(id)
    if (user.length) {
        const updated = await db.updateUser({ name, email, id });
        response.status(200).send(`Updated user with id: ${updated.id}, with new data.`)
    } else {
        response.status(404).send(`Something went wrong.`);
    }

})

app.delete('/users/:id', async (request, response) => {
    const id = parseInt(request.params.id)

    const user = await db.getUserById(id)
    if (user.length) {
        const deleted = await db.deleteUser(id);
        response.status(200).send(`Deleted user with id: ${deleted.id}.`)
    } else {
        response.status(404).send(`Something went wrong.`);
    }
})

