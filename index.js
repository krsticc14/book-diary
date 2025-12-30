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

        await db.query(
            'INSERT INTO books (title, author, olid, cover_url, notes, rating)  VALUES($1, $2, $3, $4, $5, $6)',
            [title, author, olid, cover_url, notes, rating]
        );
    res.redirect("/my-books");
    } catch (err) {
        console.error(err);
        res.send('Error saving book to database');
    }
});

app.get("/my-books", async (req, res) => {
    const result = await db.query("SELECT * FROM books ORDER BY date_added DESC");
    res.render("my-books.ejs", { books: result.rows});
});

app.post("/add-book", async (req, res) => {
    try {
        const { title, author, olid } = req.body;
        await db.query(
            'INSERT INTO books (title, author, olid) VALUES ($1, $2, $3)',
            [title, author, olid]
        );
        res.redirect("/my-books");
    } catch (err) {
        console.error("Add book error:", err);
        res.send("Error saving book to database");
    }
});

app.post("/delete/:id", async (req, res) => {
    const bookId = req.params.id;

    try {
        await db.query("DELETE FROM books WHERE id = $1", [bookId]);
        res.redirect("/my-books");
    } catch (err)  {
        console.error("Error deleting the book:", err);
        res.status(500).send("Error deleting the book");
    }
});

app.post("/notes/:id", async (req, res) => {
    const bookId = req.params.id;
    const { notes } = req.body;

    try {
        await db.query("UPDATE books SET notes = $1 WHERE id = $2", [notes, bookId]);
        res.redirect("/my-books");
    } catch (err) {
        console.errror("Error updating notes:", err);
        res.status(500).send("Error updating notes");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`
));
