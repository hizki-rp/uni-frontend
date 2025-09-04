import React from "react";
import { Routes, Route, Link, useLocation } from 'react-router-dom'; 

import Login from './pages/Login'; 
import Register from './pages/Register';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">
          <Link to="/">UNI-FINDER</Link>
        </div>

        {/* Menu Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className={isActive("/") ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"}
          > HOME
          </Link>
         {/* 
         
          <Link
            to="/universities"
            className={isActive("/universities") ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"}
          >
            Universities
          </Link>

         */}
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/Login"
            className="px-4 py-2 rounded-lg text-gray-600 border border-blue-600 hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            to="/Register"
            className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-blue-700 transition"
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
  );
}
