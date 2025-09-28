"use client";

import { useState,useContext } from "react";
import { Menu, X } from "lucide-react";
import handleLogout from "@/services/logout";
import MyContext from "@/context/MyContext";

export default function UserNav() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

    const context = useContext(MyContext);
    if (!context) throw new Error('StudentDashboard must be used within MyState');
  
    const { user} = context;

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left: Logo + Links */}
      <div className="flex items-center gap-8">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo / Title */}
        <span className="text-xl font-bold text-indigo-600">UniShare</span>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-6 text-gray-700 font-medium">
          <a href="/" className="hover:text-indigo-600">Home</a>
          <a href="/about" className="hover:text-indigo-600">About</a>
          <a href="/contact" className="hover:text-indigo-600">Contact</a>
          <a href="/download" className="hover:text-indigo-600">Download</a>
          <a href="/upload" className="hover:text-indigo-600">Upload</a>
        </div>
      </div>

      {/* Right: Profile */}
      <div>
        <img
          src={user?.profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setIsProfileOpen(true)}
        />
      </div>

      {/* Mobile Menu Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex">
          <div className="bg-white w-64 h-full p-6 flex flex-col gap-6">
            <button
              className="self-end"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <a href="/" className="hover:text-indigo-600">Home</a>
            <a href="/about" className="hover:text-indigo-600">About</a>
            <a href="/contact" className="hover:text-indigo-600">Contact</a>
            <a href="/download" className="hover:text-indigo-600">Download</a>
            <a href="/upload" className="hover:text-indigo-600">Upload</a>
          </div>
        </div>
      )}

      {/* Profile Modal (Right Side) */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
          <div className="bg-white w-72 h-full p-6 shadow-xl">
            <button
              className="mb-4 flex justify-end"
              onClick={() => setIsProfileOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex flex-col items-center">
              <img
                src={user?.profileImage}
                alt="User"
                className="w-20 h-20 rounded-full mb-3"
              />
              <h3 className="font-bold text-lg">J{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 text-gray-700">
              <a href="/profile-edit" className="hover:text-indigo-600">Profile Edit</a>
              <a href="/change-password" className="hover:text-indigo-600">Change Password</a>
              <a href="/dashboard" className="hover:text-indigo-600">Dashboard</a>
              <button
              onClick={handleLogout}
               className="text-left hover:text-red-500">Log Out</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
