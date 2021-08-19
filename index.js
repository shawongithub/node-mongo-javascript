const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId
const password = "rrp7rMxbP8vzt7i"
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://tshirtBuyer:rrp7rMxbP8vzt7i@cluster0.lhztw.mongodb.net/organicDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }))
const jsonParser = bodyParser.json()

// // create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


client.connect(err => {
    const collection = client.db("organicDB").collection("products");
    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })
    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })

    })
    app.post('/addProduct', (req, res) => {
        const product = req.body
        collection.insertOne(product)
            .then(result => {
                res.redirect('/')
            })

    })
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result)
                res.send(result.deletedCount > 0)
            })
        console.log(req.params.id)
    })
    app.patch('/update/:id', jsonParser, (req, res) => {
        console.log(req.params.id)
        console.log(req.body.price)
        collection.updateOne({ _id: ObjectId(req.params.id) }, {
            $set: { price: req.body.price, quantity: req.body.quantity }
        }
        )
            .then(result => {
                console.log(result)
                res.send(result.modifiedCount > 0)
            })
    })
});

app.listen(3000, () => console.log('listening from port 3000'))