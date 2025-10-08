import express from "express" 
import bodyParser from "body-parser"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// In-memory storage (note: this resets on each serverless function call)
let posts = []

// Configure EJS with absolute paths for Vercel

app.use(express.static(path.join(__dirname, '../public')));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/edit/:id", (req,res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);
    if (post) {
      res.render("edit.ejs", {post: post});  
    } else {
        res.redirect("/");
    }
});

app.post("/edit/:id", (req, res) => {
    const id = parseInt (req.params.id);
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex !== -1 ) {
        posts[postIndex] = {
            id: id,
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
            date: posts[postIndex].date
        };
    }
    res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    posts = posts.filter(post => post.id !== id);
    res.redirect("/");
})

app.get("/contact", (req, res) => {
    res.render("contact.ejs")
})

app.get("/about", (req, res) => {
    res.render("about.ejs")
})

app.get("/create", (req, res) => {
    res.render("create.ejs")
})

app.post("/create", (req, res) => {
    const newPost = {
      id: posts.length + 1,
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
      date: new Date().toLocaleDateString(),
    };
    posts.push(newPost);
    res.redirect("/");
});

app.get("/", async (req, res) => {
    try {
      const response = await fetch("https://dev.to/api/articles?tag=webdev&top=7&per_page=3");
      const techNews = await response.json();
      res.render("index.ejs", {
        posts: posts,
        techNews: techNews,
      });
    } catch (error) {
        console.error("API Error:", error);
        res.render("index.ejs", { posts: posts, techNews: [] });
    }
});

// Export the Express app for Vercel
export default app;