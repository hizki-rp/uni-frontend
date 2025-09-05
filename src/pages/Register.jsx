import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username:"",
    password: "",
    re_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://uni-api-w0ms.onrender.com/api/auth/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        const data = await response.json();
        setError(Object.values(data).flat().join(", ") || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Is Django running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 mt-12 transition-all duration-300 font-sans">
    <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-900 dark:text-gray-50 tracking-tight">
      Create Account
    </h2>
  
    {error && (
      <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm text-center font-medium">
        {error}
      </div>
    )}
  
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      <div>
        <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="username"
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
  
      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
  
      <div>
        <Label htmlFor="re_password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm Password
        </Label>
        <Input
          id="re_password"
          type="password"
          name="re_password"
          value={formData.re_password}
          onChange={handleChange}
          placeholder="********"
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
  
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg py-2 shadow-md hover:shadow-lg transition-all duration-200"
        disabled={loading}
      >
        {loading ? "Creating..." : "Register"}
      </Button>
    </form>
  
    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
      Already have an account?{" "}
      <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
        Log in
      </Link>
    </p>
  </div>
  );
}
