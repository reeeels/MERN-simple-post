const express = require('express');
const cors = require('cors');

// middleware
const app = express();
app.use(express.json());
app.use(cors())


const mongoose = require("mongoose");
const options = {
    keepAlive: true,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// mongodb+srv://frontend:frontend@cluster0.6vk0qgz.mongodb.net/?retryWrites=true&w=majority
// You guys need to replace with your own server url and correct <username> and <password>
const dbUrl = `mongodb+srv://frontend:frontend@cluster0.y1tmm.mongodb.net/test`;

// Mongo DB connection
mongoose.connect(dbUrl, options, (err) => {
    if (err) console.log(err);
});

// Validate DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Mongo DB Connected successfully");
});

// Schema for posts
let Schema = mongoose.Schema;
let postSchema = new Schema(
    {
        content: String,
    },
    { timestamps: true }
);
let postModel = mongoose.model("post", postSchema);

app.get('/', (req, res) => {
    res.send('Your are lucky!! server is running...');
});

/** GET API: GETs post from DB and returns as response */
app.get('/posts', async (req, res) => {
    try {
        let posts = await postModel.find().sort( { _id: -1 });
        res.status(200).json({
            status: 200,
            data: posts,
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

/** POST API: Gets new post info from React and adds it to DB */
app.post('/posts', async (req, res) => {
    try {
        let newPost = new postModel(req.body);
        console.log(newPost);
        let savedPost = await newPost.save();
        res.status(200).json({
            status: 200,
            data: savedPost,
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

app.delete("/posts/:id", async (req, res) => {
    try {
        console.log(req.params);
        let post = await postModel.findByIdAndRemove(req.params.id);
        if (post) {
            res.status(200).json({
                status: 200,
                message: "post deleted successfully",
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "No post found",
            });
        }
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

app.listen(3001);