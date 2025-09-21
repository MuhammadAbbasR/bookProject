import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", genre: "", year: "" });
  const [search, setSearch] = useState({ title: "", author: "", genre: "", year: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`http://localhost:5000/books?${params}`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleChange = (e, type = "form") => {
    if (type === "form") {
      setForm({ ...form, [e.target.name]: e.target.value });
    } else {
      setSearch({ ...search, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/books/${editingId}`, {
          ...form,
          year: parseInt(form.year),
        });
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/books", {
          ...form,
          year: parseInt(form.year),
        });
      }
      setForm({ title: "", author: "", genre: "", year: "" });
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
    });
    setEditingId(book.id);
  };

  return (
    <div className="app-container">
      <h1>📚 Book List</h1>

      {/* Add/Edit Form */}
      <h2>{editingId ? "Edit Book" : "Add Book"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={(e) => handleChange(e, "form")} required />
        <input type="text" name="author" placeholder="Author" value={form.author} onChange={(e) => handleChange(e, "form")} required />
        <input type="text" name="genre" placeholder="Genre" value={form.genre} onChange={(e) => handleChange(e, "form")} />
        <input type="number" name="year" placeholder="Year" value={form.year} onChange={(e) => handleChange(e, "form")} />
        <button type="submit">{editingId ? "Update Book" : "Add Book"}</button>
        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setForm({ title: "", author: "", genre: "", year: "" });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Search Form */}
      <h2>Search Books</h2>
      <form onSubmit={handleSearch}>
        <input type="text" name="title" placeholder="Search by Title" value={search.title} onChange={(e) => handleChange(e, "search")} />
        <input type="text" name="author" placeholder="Search by Author" value={search.author} onChange={(e) => handleChange(e, "search")} />
        <input type="text" name="genre" placeholder="Search by Genre" value={search.genre} onChange={(e) => handleChange(e, "search")} />
        <input type="number" name="year" placeholder="Search by Year" value={search.year} onChange={(e) => handleChange(e, "search")} />
        <button type="submit">Search</button>
      </form>

      {/* Book List */}
      <h2>All Books</h2>
      <ul>
        {books.length === 0 && <li>No books found</li>}
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author} ({book.year}) — {book.genre}
            <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
