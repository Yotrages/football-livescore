// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaFutbol } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-900 via-teal-200 to-cyan-700 text-white shadow-md">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and site title */}
          <Link href="/" className="flex items-center space-x-2">
            <FaFutbol className="text-2xl text-yellow-400" />
            <span className="text-xl font-bold">Football LiveScore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-yellow-300 transition duration-150 ease-in-out">
              Home
            </Link>
            <Link href="/matches" className="hover:text-yellow-300 transition duration-150 ease-in-out">
              Matches
            </Link>
            <Link href="/leagues" className="hover:text-yellow-300 transition duration-150 ease-in-out">
              Leagues
            </Link>
            <Link href="/news" className="hover:text-yellow-300 transition duration-150 ease-in-out">
              News
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden transition-all duration-500 ease-in text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col space-y-3">
            <Link 
              href="/" 
              className="hover:text-yellow-300 transition duration-150 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/matches" 
              className="hover:text-yellow-300 transition duration-150 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              Matches
            </Link>
            <Link 
              href="/leagues" 
              className="hover:text-yellow-300 transition duration-150 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              Leagues
            </Link>
            <Link 
              href="/news" 
              className="hover:text-yellow-300 transition duration-150 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;