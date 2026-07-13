const express = require('express');
const Book = require('../models/Book');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get a single book by book number - any logged-in user (admin or regular)
router.get('/:bookNo', requireAuth, async (req, res) => {
  try {
    const book = await Book.findOne({ bookNo: req.params.bookNo.trim() });
    if (!book) {
      return res.status(404).json({ message: 'No book found with that number.' });
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while fetching the book.' });
  }
});

// Get all books - any logged-in user (used for admin's management list, but any user can browse too)
router.get('/', requireAuth, async (req, res) => {
  try {
    const books = await Book.find().sort({ bookNo: 1 });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while fetching books.' });
  }
});

// Create a new book - admin only
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { bookNo, name, author, publisher, price, owner } = req.body;
    if (!bookNo || !name || !author || !publisher || price === undefined) {
      return res.status(400).json({ message: 'Book number, name, author, publisher, and price are required.' });
    }
    const existing = await Book.findOne({ bookNo: bookNo.trim() });
    if (existing) {
      return res.status(409).json({ message: 'A book with that number already exists.' });
    }
    const book = await Book.create({
      bookNo: bookNo.trim(),
      name,
      author,
      publisher,
      price,
      owner: owner || {},
    });
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while adding the book.' });
  }
});

// Update an existing book (details and/or owner) - admin only
router.put('/:bookNo', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, author, publisher, price, owner } = req.body;
    const book = await Book.findOne({ bookNo: req.params.bookNo.trim() });
    if (!book) {
      return res.status(404).json({ message: 'No book found with that number.' });
    }
    if (name !== undefined) book.name = name;
    if (author !== undefined) book.author = author;
    if (publisher !== undefined) book.publisher = publisher;
    if (price !== undefined) book.price = price;
    if (owner !== undefined) book.owner = { ...book.owner.toObject(), ...owner };

    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while updating the book.' });
  }
});

// Delete a book - admin only
router.delete('/:bookNo', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await Book.findOneAndDelete({ bookNo: req.params.bookNo.trim() });
    if (!result) {
      return res.status(404).json({ message: 'No book found with that number.' });
    }
    res.json({ message: 'Book deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while deleting the book.' });
  }
});

module.exports = router;