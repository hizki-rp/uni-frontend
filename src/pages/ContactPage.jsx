import React from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";

const ContactPage = () => {
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to your backend.
    toast.success("Thank you for your message! We will get back to you soon.");
    e.target.reset();
  };

  return (
    <div className="bg-gray-50">
      <Toaster richColors />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about
            features, trials, or anything else, our team is ready to answer all
            your questions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-lg">
          <form onSubmit={handleContactSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <div className="mt-6">
              <label
                htmlFor="subject"
                className="block text-gray-700 font-bold mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="message"
                className="block text-gray-700 font-bold mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
              ></textarea>
            </div>
            <div className="text-center mt-8">
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-3 px-10 rounded-full hover:bg-blue-700 transition-colors text-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} UNI-FINDER. All Rights Reserved.
          </p>
          <div className="mt-4">
            <Link to="/privacy" className="hover:text-white mx-2">
              Privacy Policy
            </Link>
            <span className="select-none">|</span>
            <Link to="/terms" className="hover:text-white mx-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
