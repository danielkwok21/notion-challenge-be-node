
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const { query } = require('./db')
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, AUTHORIZATION');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/reviews', async (req, res) => {
    const q0 = 'SELECT * FROM Review'
    const reviews = await query(q0)

    res.json({
        status: 200,
        reviews
    })
})

app.get('/products', async (req, res) => {
    const q0 = 'SELECT * FROM Product LIMIT 1'
    const product = await query(q0)

    res.json({
        status: 200,
        product
    })
})

app.get('/', (req, res) => {
    res.send('Hello World from notion-challenge-be-node')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
