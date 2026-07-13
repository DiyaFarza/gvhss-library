import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const [bookNo, setBookNo] = useState('');
  const [book, setBook] = useState(null);
  const [showOwner, setShowOwner] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    setError('');
    setBook(null);
    setShowOwner(false);
    if (!bookNo.trim()) return;

    setLoading(true);
    try {
      const res = await api.get(`/books/${bookNo.trim()}`);
      setBook(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen relative bg-gray-50">
      <header className="relative z-20 bg-brand-800 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-brand-800 rounded-full flex items-center justify-center font-bold">
              GL
            </div>
            <div>
              <h1 className="font-semibold leading-tight">GVHSS Alanallur</h1>
              <p className="text-xs text-brand-100">Library System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {auth?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="text-sm bg-white text-brand-800 px-3 py-1.5 rounded-lg font-medium hover:bg-brand-50"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-sm bg-brand-700 hover:bg-brand-900 px-3 py-1.5 rounded-lg font-medium"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Bottom-half background illustration, fades into white so text stays readable */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] min-h-[380px] z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: "url('/students-reading.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/40 to-transparent" />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Find a Book</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={bookNo}
              onChange={(e) => setBookNo(e.target.value)}
              placeholder="Enter book number (e.g. 1936)"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {book && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{book.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Book No: {book.bookNo}</p>

            <dl className="grid grid-cols-2 gap-y-3 text-sm mb-5">
              <dt className="text-gray-500">Author</dt>
              <dd className="text-gray-800 font-medium">{book.author}</dd>
              <dt className="text-gray-500">Publisher</dt>
              <dd className="text-gray-800 font-medium">{book.publisher}</dd>
              <dt className="text-gray-500">Price</dt>
              <dd className="text-gray-800 font-medium">₹{book.price}</dd>
            </dl>

            <button
              onClick={() => setShowOwner(!showOwner)}
              className="text-brand-700 font-medium text-sm hover:underline"
            >
              {showOwner ? 'Hide' : 'View'} Owner Details
            </button>

            {showOwner && (
              <div className="mt-4 bg-brand-50 rounded-xl p-4">
                {book.owner?.name ? (
                  <dl className="grid grid-cols-2 gap-y-2 text-sm">
                    <dt className="text-gray-500">Student Name</dt>
                    <dd className="text-gray-800 font-medium">{book.owner.name}</dd>
                    <dt className="text-gray-500">Admission No</dt>
                    <dd className="text-gray-800 font-medium">{book.owner.admissionNo}</dd>
                    <dt className="text-gray-500">Class</dt>
                    <dd className="text-gray-800 font-medium">{book.owner.className}</dd>
                    <dt className="text-gray-500">Division</dt>
                    <dd className="text-gray-800 font-medium">{book.owner.division}</dd>
                  </dl>
                ) : (
                  <p className="text-gray-500 text-sm">No owner assigned to this book yet.</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}