const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let books = [
  { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1937 },
  { id: 2, title: "1984", author: "George Orwell", genre: "Dystopian", year: 1949 },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", genre: "Programming", year: 2008 },
];

app.get("/", (req, res) => {
  res.send("📚 Welcome to Book API!");
});

// ✅ Single unified /books route
app.get("/books", (req, res) => {
  const { title, author, genre, year } = req.query;
  let results = books;

  if (title) results = results.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  if (author) results = results.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  if (genre) results = results.filter(b => b.genre.toLowerCase().includes(genre.toLowerCase()));
  if (year) results = results.filter(b => b.year === parseInt(year));

  res.json(results);
});

app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  book ? res.json(book) : res.status(404).json({ message: "Book not found" });
});

app.post("/books", (req, res) => {
  const newBook = { id: books.length + 1, ...req.body };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...req.body };
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.delete("/books/:id", (req, res) => {
  books = books.filter(b => b.id !== parseInt(req.params.id));
  res.json({ message: "Book deleted" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
