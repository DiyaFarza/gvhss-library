const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    bookNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    owner: {
      name: { type: String, default: '' },
      admissionNo: { type: String, default: '' },
      className: { type: String, default: '' },
      division: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);