import express from "express" 
import bodyParser from "body-parser"

 const app = express()
const port = process.env.PORT || 3000;


 let posts = []

app.set("view engine", "ejs");
 app.use(express.static("public"))

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

app.put("", (req, res) => {
    
})

app.patch("", (req, res) => {
    
})

app.delete("", (req, res) => {
    
})



app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})

// Export for Vercel
export default app;
