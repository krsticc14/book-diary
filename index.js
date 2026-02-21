import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { db } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.set('view engine','ejs');

app.get('/search', async (req, res) => {
    try {
    const query = req.query.q;

    const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
    const books = response.data.docs.slice(0, 10); 

    res.render("search.ejs", {books});
    } catch (error) {
        console.error(error);
        res.send('Error fetching data from Open Library' + error.message);
    }
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/add-book", async (req, res) => {
    try {
        const { title, author, olid, cover_url, notes, rating } = req.body;

        const { error } = await supabase
        .from('books')
        .insert([{title, author, olid, cover_url, notes, rating}]);

        if (error) throw error;
        res.redirect("/my-books");
    } catch (err) {
        console.error(err);
        res.send("Error saving book to database");
    }
});

app.get("/my-books", async (req, res) => {
   const {data, error } = await supabase
   .from('books')
   .select('*')
   .order('date_added', { ascending: false});

   if (error) {
    console.error(error);
    return res.status(500).send("Error fetching books from database");
   }
   res.render("my-books.ejs", { books: data });
});

app.post("/add-book", async (req, res) => {
    try {
        const { title, author, olid, cover_url, notes, rating } = req.body;

        const { error } = await supabase
        .from('books')
        .insert([{title, author, olid, cover_url, notes, rating}]);

        if (error) throw error;
        res.redirect("/my-books");
    } catch (err) {
        console.error(err);
        res.send("Error saving book to database");
    }
});

app.post("/delete/:id", async (req, res) => {
    const bookId = req.params.id;

    const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId);

    if (error) {
        console.error("Error deleting the book from database", error);
        return res.status(500).send("Error deleting the book");
    }
    res.redirect("/my-books");
});

app.post("/notes/:id", async (req, res) => {
    const bookId = req.params.id;
    const { notes } = req.body;

    const { error } = await supabase
    .from('books')
    .update({notes})
    .eq('id', bookId);

    if (error) {
        console.error("Error adding notes", error);
        return res.status(500).send("Error adding notes");
    }
    res.redirect("/my-books");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`
));
