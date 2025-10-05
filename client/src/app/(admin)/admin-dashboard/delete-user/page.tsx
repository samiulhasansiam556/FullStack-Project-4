"use client";

import { useEffect, useState } from "react";
import api from "@/services/axios";
import toast from "react-hot-toast";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;

export default function DeleteUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<User[]>("/admin/get-all-users");
      setUsers(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // delete user
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/delete-user/${id}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  // filtered users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, username or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          className="w-full border rounded p-2"
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : paginatedUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Username</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Joined</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="border p-2">{u.name}</td>
                  <td className="border p-2">{u.username}</td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2">{u.role}</td>
                  <td className="border p-2">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded ${
                  page === currentPage ? "bg-blue-500 text-white" : ""
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
