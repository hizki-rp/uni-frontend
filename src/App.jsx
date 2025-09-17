import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/context";
import ProtectedRoute from "./utils/ProtectedRoute";
import UniversityList from "./pages/UniversityList";
import UserManagement from "./pages/UserManagement";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UniversityDetail from "./pages/UniversityDetail";
import AdminUniversityPage from "./pages/AdminUniversityPage";
import Navbar from "./Navbar";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Protected Routes for Logged-in Users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/universities" element={<UniversityList />} />
          <Route path="/university/:id" element={<UniversityDetail />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add other user-only routes here */}
        </Route>
        {/* Protected Routes for Admins Only */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/universities" element={<AdminUniversityPage />} />
        </Route>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} /> {/* Default to login */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
