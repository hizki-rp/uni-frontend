import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, School, Users, LogOut, Building } from "lucide-react";
import { useAuth } from "../context/context";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const { user, logoutUser } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      admin: false,
    },
    {
      href: "/universities",
      icon: <School className="h-5 w-5" />,
      label: "Universities",
      admin: false,
    },
    {
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      label: "User Management",
      admin: true,
    },
    {
      href: "/admin/universities",
      icon: <Building className="h-5 w-5" />,
      label: "Manage Universities",
      admin: true,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">UNI-FINDER</h2>
        {user && (
          <p className="text-sm text-muted-foreground">
            Welcome, {user.username}
          </p>
        )}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {user &&
          navItems.map(
            (item) =>
              (!item.admin ||
                user.groups.includes("admin") ||
                user.is_staff) && (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive(item.href) && "bg-muted text-primary"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
          )}
      </nav>
      <div className="mt-auto p-4 border-t">
        {user && (
          <Button
            onClick={logoutUser}
            variant="destructive"
            className="w-full justify-start bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
