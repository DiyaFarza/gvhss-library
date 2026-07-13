import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 flex flex-col items-center justify-center px-4 py-10">
      {/* Decorative open-book silhouettes, purely CSS/SVG - no image files needed */}
      <svg
        className="absolute -bottom-24 -right-24 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] text-white/[0.06] pointer-events-none select-none"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M100 35 C72 18 30 18 12 28 V158 C30 148 72 148 100 165 C128 148 170 148 188 158 V28 C170 18 128 18 100 35 Z" />
        <path d="M100 35 V165" />
      </svg>
      <svg
        className="absolute -top-28 -left-28 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] text-white/[0.05] pointer-events-none select-none rotate-12"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M100 35 C72 18 30 18 12 28 V158 C30 148 72 148 100 165 C128 148 170 148 188 158 V28 C170 18 128 18 100 35 Z" />
        <path d="M100 35 V165" />
      </svg>

      <div className="relative z-10 text-center mb-8 max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
          GVHSS Alanallur Library
        </h1>
        <p className="text-brand-100 mt-3 text-sm sm:text-base">
          School Library Management System
        </p>
      </div>

      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}