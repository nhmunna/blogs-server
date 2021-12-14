const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

//MIDDLE WARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d2gdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log("database connect successfully");
        const database = client.db('online_blog');
        const blogsCollection = database.collection('blogs');
        const usersCollection = database.collection('users');

        //GET ALL SERVICES
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

        //POST SERVICES
        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog);
            // console.log(result);
            res.json(result);
        });

        //GET SINGLE SERVICE
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const blog = await servicesCollection.findOne(query);
            res.json(blog);
        })


        //ADD USER
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);
        });

        //UPDATE USER
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


        //DELETE API
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        //ADD BLOGS
        // app.post('/blogs', async (req, res) => {
        //     const name = req.body.name;
        //     const email = req.body.email;
        //     const pic = req.files.image;
        //     const picData = pic.data;
        //     const encodedPic = picData.toString('base64');
        //     const imageBuffer = Buffer.from(encodedPic, 'base64');
        //     const doctor = {
        //         name,
        //         email,
        //         image: imageBuffer
        //     }
        //     const result = await doctorsCollection.insertOne(doctor);
        //     res.json(result);
        // })

        //ORDER API
        // app.post('/orders', async (req, res) => {
        //     const order = req.body;
        //     // console.log('order', order);
        //     const result = await ordersCollection.insertOne(order);
        //     res.json(result);
        // });

        //FIND ORDER BY EMAIL
        // app.get('/orders', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email };
        //     const cursor = ordersCollection.find(query);
        //     const order = await cursor.toArray();
        //     res.json(order)
        // });

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello My Blogs!')
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})