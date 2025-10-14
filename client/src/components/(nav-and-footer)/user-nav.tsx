"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import MyContext from "@/context/MyContext";
import handleLogout from "@/services/logout";

export default function UserNav() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const context = useContext(MyContext);
  if (!context) throw new Error("StudentDashboard must be used within MyState");

  const { user } = context;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">

      <div className="flex items-center gap-8">
        
        <button className="lg:hidden p-2" onClick={() => setIsMobileOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>

        <span className="text-xl font-bold text-indigo-600">UniShare</span>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-indigo-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-indigo-600">
            About
          </Link>
          <Link href="/contact" className="hover:text-indigo-600">
            Contact
          </Link>
          <Link href="/download" className="hover:text-indigo-600">
            Download
          </Link>
          <Link href="/upload" className="hover:text-indigo-600">
            Upload
          </Link>
        </div>
      </div>

      {/* Right: Profile */}
      <div>
        <img
          src={user?.profileImage ?? undefined}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setIsProfileOpen(true)}
        />
      </div>

      {/* Mobile Menu Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex">
          <div className="bg-white w-64 h-full p-6 flex flex-col gap-6">
            <button className="self-end" onClick={() => setIsMobileOpen(false)}>
              <X className="h-6 w-6" />
            </button>
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>
            <Link href="/about" className="hover:text-indigo-600">
              About
            </Link>
            <Link href="/contact" className="hover:text-indigo-600">
              Contact
            </Link>
            <Link href="/download" className="hover:text-indigo-600">
              Download
            </Link>
            <Link href="/upload" className="hover:text-indigo-600">
              Upload
            </Link>
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
                src={user?.profileImage ?? undefined}
                alt="User"
                className="w-20 h-20 rounded-full mb-3"
              />
              <h3 className="font-bold text-lg">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 text-gray-700">
              <Link href="/profile-edit" className="hover:text-indigo-600">
                Profile Edit
              </Link>
              <Link href="/change-password" className="hover:text-indigo-600">
                Change Password
              </Link>
              <Link href="/dashboard" className="hover:text-indigo-600">
                Dashboard
              </Link>
              {user?.role === "ADMIN" && (
                <Link href="/admin-dashboard" className="hover:text-indigo-600">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-left hover:text-red-500"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </nav>
  );
}
