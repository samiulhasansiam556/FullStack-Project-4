"use client";

import { useEffect, useState } from "react";
import api from "@/services/axios";
import toast from "react-hot-toast";

type Material = {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  uploader: { name: string };
  course: {
    name: string;
    department: { name: string; university: { name: string } };
  };
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;

export default function ManageDocuments() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // fetch materials
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await api.get<Material[]>("/admin/get-all-materials");
      setMaterials(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // delete material
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/admin/delete-materials/${id}`);
      toast.success("Document deleted successfully");
      setMaterials(materials.filter((m) => m.id !== id));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete document");
    }
  };

  // filtered & paginated materials
  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.course.name.toLowerCase().includes(search.toLowerCase()) ||
      m.course.department.name.toLowerCase().includes(search.toLowerCase()) ||
      m.course.department.university.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE);
  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Documents</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title, course, department, or university..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full border rounded p-2"
        />
      </div>

      {loading ? (
        <p>Loading documents...</p>
      ) : paginatedMaterials.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Uploader</th>
                <th className="border p-2 text-left">Course</th>
                <th className="border p-2 text-left">Department</th>
                <th className="border p-2 text-left">University</th>
                <th className="border p-2 text-left">Created</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMaterials.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="border p-2">{m.title}</td>
                  <td className="border p-2">{m.uploader.name}</td>
                  <td className="border p-2">{m.course.name}</td>
                  <td className="border p-2">{m.course.department.name}</td>
                  <td className="border p-2">{m.course.department.university.name}</td>
                  <td className="border p-2">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(m.id)}
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
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  page === currentPage ? "bg-blue-500 text-white" : ""
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
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
