import React from "react";

const ContactPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar (You might want to reuse your existing Navbar component here) */}
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="text-white text-2xl font-bold">
            Uni-Finder
          </a>
          {/* Add navigation links here if needed */}
        </div>
      </nav>

      {/* Contact Form */}
      <div className="container mx-auto py-12">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Contact Us
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Message:
              </label>
              <textarea
                id="message"
                rows="4"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer (You might want to reuse the footer from HomePage) */}
    </div>
  );
};

export default ContactPage;
