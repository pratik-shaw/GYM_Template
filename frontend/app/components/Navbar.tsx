'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for transparent to solid background with improved performance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    // Use passive event listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Prevent body scroll when menu is open and reset scroll position for mobile menu
  useEffect(() => {
    if (menuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      // When menu opens, force scroll to top of page to ensure full menu visibility
      window.scrollTo(0, 0);
      
      // Store the scroll position to restore later
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      document.body.style.overflow = '';
      
      // Restore scroll position when menu closes
      const scrollY = document.body.dataset.scrollY;
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);
  
  // Add click outside handler to close menu when clicking outside navbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.querySelector('nav');
      // Check if the menu is open and the click is outside the navbar
      if (menuOpen && navbar && !navbar.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    
    // Add the event listener when the menu is open
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
      scrolled ? 'bg-black/90 backdrop-blur-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 lg:px-16 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group relative z-10">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                RUSH
              </span>
              <span className="absolute top-0 left-0.5 text-2xl font-black text-red-600 blur-[1px] opacity-80 transition-all duration-300 group-hover:blur-[2px] group-hover:opacity-100">
                RUSH
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop navigation links - Updated navigation options with Memberships */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Programs', 'Trainers', 'Contact','Memberships'].map((item, index) => (
            <Link 
              key={index}
              href={`/${item.toLowerCase()}`} 
              className="relative text-gray-300 hover:text-white font-medium tracking-wide transition-all duration-300 group"
            >
              <span className="relative z-10">{item}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Action buttons - desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link 
                href="/profile" 
                className="relative overflow-hidden text-white hover:text-red-500 transition-colors duration-300 flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-medium">Profile</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full border border-red-600 rounded transition-all duration-300 ease-in-out group-hover:scale-105"></div>
                <span className="relative block px-5 py-2 font-medium text-red-500 transition-all duration-300 ease-in-out group-hover:text-red-400">
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="relative overflow-hidden text-white group"
              >
                <span className="relative block px-4 py-2 font-medium transition-all duration-300 ease-in-out group-hover:text-red-500">
                  Login
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/signup" 
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-red-600 rounded transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:bg-red-700"></div>
                <span className="relative block px-6 py-2 font-bold text-white z-10">
                  JOIN NOW
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button - Improved animation */}
        <button 
          className="md:hidden relative z-10 text-white p-2 touch-manipulation"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`w-6 h-0.5 bg-white block transition-all duration-300 transform ${menuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white block transition-all duration-300 mt-1.5 mb-1.5 ${menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`}></span>
            <span className={`w-6 h-0.5 bg-white block transition-all duration-300 transform ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile menu - Updated to be fixed at top of screen regardless of scroll position */}
      <div 
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black z-40 transition-all duration-500 ease-in-out ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-x-full'
        }`}
        style={{ height: '100vh' }}
      >
        {/* Close button (X) for mobile menu */}
        <button 
          className="absolute top-4 right-4 text-white p-2 z-50"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center">
          <div className="flex flex-col items-center gap-8 mb-12">
            {/* Updated mobile menu options with Memberships */}
            {['Home', 'Programs', 'Memberships', 'Trainers', 'Contact'].map((item, index) => (
              <Link 
                key={index}
                href={`/${item.toLowerCase()}`} 
                className="text-2xl font-bold text-white hover:text-red-500 transition-all duration-300 transform hover:translate-x-1"
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {item}
              </Link>
            ))}
          </div>
          
          {isLoggedIn ? (
            <div className="flex flex-col items-center gap-6">
              <Link 
                href="/profile" 
                className="text-xl font-medium text-white hover:text-red-500 transition-all duration-300"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button 
                onClick={() => {
                  setIsLoggedIn(false);
                  setMenuOpen(false);
                }}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full border-2 border-red-600 rounded transition-all duration-300 ease-in-out group-hover:scale-105"></div>
                <span className="relative block px-8 py-3 font-medium text-red-500 transition-all duration-300 ease-in-out group-hover:text-red-400">
                  Logout
                </span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 mt-6">
              <Link 
                href="/login" 
                className="text-xl font-medium text-white hover:text-red-500 transition-all duration-300"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="relative overflow-hidden group"
                onClick={() => setMenuOpen(false)}
              >
                <div className="absolute inset-0 w-full h-full bg-red-600 rounded transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:bg-red-700"></div>
                <span className="relative block px-8 py-3 font-bold text-white z-10">
                  SIGN UP AND JOIN NOW
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}