import React from "react";
import { Link } from "react-router-dom"; // --- SVG Icons ---
const SearchIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <circle cx="11" cy="11" r="8"></circle>{" "}
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>{" "}
  </svg>
);

const ListIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <line x1="8" y1="6" x2="21" y2="6"></line>{" "}
    <line x1="8" y1="12" x2="21" y2="12"></line>{" "}
    <line x1="8" y1="18" x2="21" y2="18"></line>{" "}
    <line x1="3" y1="6" x2="3.01" y2="6"></line>{" "}
    <line x1="3" y1="12" x2="3.01" y2="12"></line>{" "}
    <line x1="3" y1="18" x2="3.01" y2="18"></line>{" "}
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>{" "}
    <polyline points="22 4 12 14.01 9 11.01"></polyline>{" "}
  </svg>
);

const DocumentTextIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const PlaneIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 1 4 4-1h3l3-2 3.7 3.7c.4.4 1 .4 1.4 0l.4-.4c.4-.4.4-1 0-1.4Z" />
  </svg>
);

const HomePage = () => {
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to your backend.
    alert("Thank you for your message! We will get back to you soon.");
    e.target.reset();
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          }}
        ></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Don't Just Apply. Strategize.
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Stop juggling spreadsheets and scattered notes. UNI-FINDER is your
            all-in-one dashboard to discover, track, and conquer your university
            applications.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition-transform transform hover:scale-105"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need, All in One Place
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            You're missing out on the most organized way to manage your future.
            Here's what you get with UNI-FINDER:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="feature-card">
              <div className="bg-blue-100 text-blue-600 rounded-full p-4 inline-block mb-4">
                <SearchIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Discover Your Fit</h3>
              <p className="text-gray-600">
                Search our extensive database of universities. Filter by
                tuition, location, and more to find schools you never knew
                existed.
              </p>
            </div>
            <div className="feature-card">
              <div className="bg-green-100 text-green-600 rounded-full p-4 inline-block mb-4">
                <ListIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
              <p className="text-gray-600">
                Move beyond "did I apply?". Track every university from
                "Interested" to "Applied" and "Accepted". Never miss a deadline
                again.
              </p>
            </div>
            <div className="feature-card">
              <div className="bg-purple-100 text-purple-600 rounded-full p-4 inline-block mb-4">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visualize Success</h3>
              <p className="text-gray-600">
                See your entire application journey on one simple dashboard.
                Make informed decisions by comparing your top choices with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Section */}
      <section id="preparation" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prepare for Success
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-12">
              The journey to studying abroad involves careful preparation.
              UNI-FINDER helps you stay on top of everything.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Admission Documents */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-600 rounded-full p-3 inline-block">
                  <DocumentTextIcon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold ml-4">Admission Documents</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Most universities require these key documents. Start gathering
                them early!
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Valid Passport
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Academic Transcripts & Certificates
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Standardized Test Scores (SAT, GRE, etc.)
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Language Proficiency (TOEFL, IELTS)
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Letters of Recommendation
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Statement of Purpose or Essay
                </li>
              </ul>
            </div>

            {/* Visa Requirements */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 text-green-600 rounded-full p-3 inline-block">
                  <PlaneIcon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold ml-4">
                  Visa Application Essentials
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Be prepared for your student visa interview with these common
                requirements.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Official University Acceptance Letter
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Proof of Financial Support
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Valid Passport with at least 6 months validity
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Completed Visa Application Forms
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Passport-sized Photographs
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Proof of Accommodation & Travel Insurance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Trusted by Students Like You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-gray-600 italic mb-4">
                "UNI-FINDER took the chaos out of my application process. I felt
                so much more in control and confident. I can't imagine doing it
                any other way now."
              </p>
              <p className="font-bold">- Alex P., Admitted to UCLA</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-gray-600 italic mb-4">
                "The ability to filter by tuition and track my application
                status for each school was a game-changer. I discovered an
                affordable university I wouldn't have found otherwise!"
              </p>
              <p className="font-bold">- Sarah L., Future Engineer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 mb-8">
              We're here to help. Fill out the form below and a member of our
              team will get back to you.
            </p>
          </div>
          <form
            onSubmit={handleContactSubmit}
            className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                {" "}
                Name{" "}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                {" "}
                Email{" "}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-gray-700 font-bold mb-2"
              >
                {" "}
                Message{" "}
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Take Control of Your Future?
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join today and turn the stress of university applications into a
            clear, manageable, and successful journey. It's free to get started!
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition-transform transform hover:scale-105"
          >
            Sign Up - It's Free!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} UNI-FINDER. All Rights Reserved.
          </p>
          <div className="mt-4">
            <Link to="/privacy" className="hover:text-white mx-2">
              {" "}
              Privacy Policy{" "}
            </Link>
            <span className="select-none">|</span>
            <Link to="/terms" className="hover:text-white mx-2">
              {" "}
              Terms of Service{" "}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
