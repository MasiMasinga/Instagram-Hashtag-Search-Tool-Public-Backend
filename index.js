const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/api/posts/", async (req, res) => {
    const posts = await prisma.post.findMany();
    res.json(posts);
});

app.get("/api/posts/search/", async (req, res) => {
    const hashtag = req.query.hashtag;

    if (!hashtag) {
        res.status(400).json({ error: 'The "hashtag" query parameter is empty.' });
        return;
    }

    const posts = await prisma.post.findMany({
        where: {
            hashtags: {
                has: hashtag,
            },
        },
    });

    // Extract the IDs of the posts and the user details
    const postIds = posts.map(post => post.id);
    const users = posts.map(post => post.user);

    // Store the Search Query in the Database
    await prisma.searchResults.create({
        data: {
            query: hashtag,
            results: postIds,
            users: users,
        },
    });

    res.json(posts);
});

app.post("/api/posts/", async (req, res) => {
    const { content, user, hashtags } = req.body;

    if (!content || !user) {
        res.status(400).json({ error: "The 'content' or 'user' field is empty." });
        return;
    }

    const post = await prisma.post.create({
        data: {
            content: content,
            user: user,
            hashtags: hashtags,
        },
    });

    res.json(post);
});

app.use(function (err, _req, res, _next) {
    console.error("error", err);
    res.status(500);
    res.send({ message: "Unfortunately a Technical Error Occurred" });
});

app.listen(PORT, () => {
    console.log(`🚀Backend Server Started on PORT ${PORT}`);
});
