import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const emptyForm = {
  bookNo: '',
  name: '',
  author: '',
  publisher: '',
  price: '',
  ownerName: '',
  admissionNo: '',
  className: '',
  division: '',
};

export default function AdminAddBook() {
  const [form, setForm] = useState(emptyForm);
  const [mode, setMode] = useState('add'); // 'add' or 'update'
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLookup() {
    setError('');
    setMessage('');
    if (!form.bookNo.trim()) return;
    try {
      const res = await api.get(`/books/${form.bookNo.trim()}`);
      const b = res.data;
      setForm({
        bookNo: b.bookNo,
        name: b.name,
        author: b.author,
        publisher: b.publisher,
        price: b.price,
        ownerName: b.owner?.name || '',
        admissionNo: b.owner?.admissionNo || '',
        className: b.owner?.className || '',
        division: b.owner?.division || '',
      });
      setMode('update');
      setMessage('Book found. Editing existing record.');
    } catch (err) {
      setMode('add');
      setMessage('No existing book with that number. Fill in the details to add it.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const payload = {
      bookNo: form.bookNo.trim(),
      name: form.name,
      author: form.author,
      publisher: form.publisher,
      price: Number(form.price),
      owner: {
        name: form.ownerName,
        admissionNo: form.admissionNo,
        className: form.className,
        division: form.division,
      },
    };

    try {
      if (mode === 'update') {
        await api.put(`/books/${payload.bookNo}`, payload);
        setMessage('Book updated successfully.');
      } else {
        await api.post('/books', payload);
        setMessage('Book added successfully.');
      }
      setForm(emptyForm);
      setMode('add');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <svg
        className="absolute -bottom-24 -right-24 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] text-brand-800/[0.05] pointer-events-none select-none"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M100 35 C72 18 30 18 12 28 V158 C30 148 72 148 100 165 C128 148 170 148 188 158 V28 C170 18 128 18 100 35 Z" />
        <path d="M100 35 V165" />
      </svg>
      <svg
        className="absolute -top-24 -left-24 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] text-brand-800/[0.04] pointer-events-none select-none rotate-12"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M100 35 C72 18 30 18 12 28 V158 C30 148 72 148 100 165 C128 148 170 148 188 158 V28 C170 18 128 18 100 35 Z" />
        <path d="M100 35 V165" />
      </svg>

      <header className="relative z-10 bg-brand-800 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-semibold">Admin Panel — Manage Books</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm bg-white text-brand-800 px-3 py-1.5 rounded-lg font-medium hover:bg-brand-50"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              name="bookNo"
              value={form.bookNo}
              onChange={handleChange}
              placeholder="Book number"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
            <button
              type="button"
              onClick={handleLookup}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg"
            >
              Look Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input name="author" value={form.author} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                <input name="publisher" value={form.publisher} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600" />
              </div>
            </div>

            <hr className="my-2" />
            <p className="text-sm font-semibold text-gray-600">Current Owner (optional)</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input name="ownerName" value={form.ownerName} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission No</label>
                <input name="admissionNo" value={form.admissionNo} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input name="className" value={form.className} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                <input name="division" value={form.division} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600" />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? 'Saving...' : mode === 'update' ? 'Update Book' : 'Add Book'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}