"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import UserNav from "@/components/(nav-and-footer)/user-nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin-dashboard", label: "Dashboard" },
    { href: "/admin-dashboard/analyze-users", label: "Analyze Users" },
    { href: "/admin-dashboard/analyze-documents", label: "Analyze Documents" },
    { href: "/admin-dashboard/delete-user", label: "Delete User" },
    { href: "/admin-dashboard/delete-documents", label: "Delete PDF" },
    { href: "/admin-dashboard/create-instance", label: "Create Instance" },
    { href: "/admin-dashboard/delete-instance", label: "Delete Instance" },
    { href: "/admin-dashboard/find-user", label: "Find User" },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      {/* <nav className="h-14 bg-gray-800 text-white flex items-center px-4 shadow">
        <h1 className="font-bold text-lg">Admin Dashboard</h1>
      </nav> */}
   
      <UserNav/>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 border-r p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md transition ${
                pathname === link.href
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
