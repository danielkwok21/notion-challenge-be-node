
const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
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


function getSSEResponse(data) {
    const SSE_REPONSE_FORMAT = `data: ${JSON.stringify(data)}\n\n`;
    return SSE_REPONSE_FORMAT
}
/**SSE endpoint */
let clients = []
app.get('/sse/review_added', async (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers)
    res.write(getSSEResponse({message: 'initial data'}))
    const clientId = Date.now()
    const newClient = {
        id: clientId,
        response: res
    }

    clients.push(newClient)

    req.on('close', () => {
        console.log('connection closed')
        clients = clients.filter(c => c.id !== clientId)
    })
})

app.get('/clear_reviews', async (req, res) => {
	const q0 = 'DELETE FROM Review'
	await query(q0)

	res.json({
	    status: 200,
	})

})

app.get('/reviews', async (req, res) => {
    const q0 = 'SELECT * FROM Review'
    const reviews = await query(q0)

    res.json({
        status: 200,
        reviews
    })
})

app.post('/reviews', async (req, res) => {
    const { review } = req.body
    const q0 = `INSERT INTO Review (comment, stars, createdAt) VALUES ("${review.comment}", ${review.stars}, ${moment().unix()})`
    await query(q0).then(res => res[0])

    console.log(clients.map(c =>c.id))
    console.log(review)
    clients.map(client => {
        client.response.write(getSSEResponse(review))
    })

    res.json({
        status: 200,
        review: review
    })
})

app.get('/products', async (req, res) => {
    const q0 = 'SELECT * FROM Product'
    const products = await query(q0)
    const product = products[0]

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
