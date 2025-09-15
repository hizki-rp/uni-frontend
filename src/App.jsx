import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UniversityList from "./pages/UniversityList";
import UniversityDetail from "./pages/UniversityDetail";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<UniversityList />} />
          <Route path="/university/:id" element={<UniversityDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
