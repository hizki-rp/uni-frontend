import React from "react";
import { Routes, Route, Link, useLocation } from 'react-router-dom'; 

import Login from './pages/Login'; 
import Register from './pages/Register';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;


  return (

    <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-lg dark:shadow-black/20 py-4 md:py-5 sticky top-0 z-50 font-sans border-b border-gray-200 dark:border-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
    {/* Logo */}
    <div className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
      <Link to="/">UNI-FINDER</Link>
    </div>

    {/* Menu Links */}
    <div className="hidden md:flex space-x-8">
      <Link
        to="/"
        className={isActive("/") ? "text-blue-600 dark:text-blue-400 font-semibold transition-colors duration-200" : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"}
      >
        {/*HOME*/}
      </Link>
      <Link
        to="/universities"
        className={isActive("/universities") ? "text-blue-600 dark:text-blue-400 font-semibold transition-colors duration-200" : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"}
      >
        {/*Universities*/}
      </Link>
    </div>

    {/* Auth Buttons */}
    <div className="flex space-x-3 md:space-x-4">
      <Link
        to="/Login"
        className="px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200 font-medium"
      >
        Login
      </Link>
      <Link
        to="/Register"
        className="px-4 py-2 rounded-full bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-semibold shadow-md"
      >
        Sign Up
      </Link>
    </div>
  </div>

  <main className="max-w-6xl mx-auto">
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
    </Routes>
  </main>
</nav>
  )
  
}
