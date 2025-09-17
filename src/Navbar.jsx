import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./context/context";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";

export default function Navbar() {
  const location = useLocation();
  const { user, logoutUser } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm dark:shadow-black/20 py-4 md:py-5 sticky top-0 z-50 font-sans border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          <Link to="/">UNI-FINDER</Link>
        </div>

        {/* Menu Links */}
        <div className="hidden md:flex space-x-8">
          {user && (
            <>
              <Link
                to="/dashboard"
                className={
                  isActive("/dashboard") ||
                  location.pathname.startsWith("/university/")
                    ? "text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 pb-1 transition-colors duration-200"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 pb-1 border-b-2 border-transparent"
                }
              >
                Dashboard
              </Link>
              <Link
                to="/universities"
                className={
                  isActive("/universities")
                    ? "text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 pb-1 transition-colors duration-200"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 pb-1 border-b-2 border-transparent"
                }
              >
                Universities
              </Link>
              {(user.groups.includes("admin") || user.is_staff) && (
                <>
                  <Link
                    to="/admin/users"
                    className={
                      isActive("/admin/users")
                        ? "text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 pb-1 transition-colors duration-200"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 pb-1 border-b-2 border-transparent"
                    }
                  >
                    User Management
                  </Link>
                  <Link
                    to="/admin/universities"
                    className={
                      isActive("/admin/universities")
                        ? "text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 pb-1 transition-colors duration-200"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 pb-1 border-b-2 border-transparent"
                    }
                  >
                    Manage Universities
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Auth Buttons & Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            {user && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            )}
          </div>
          {user ? (
            <Button
              onClick={logoutUser}
              variant="outline"
              className="hidden md:flex"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 font-semibold shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
