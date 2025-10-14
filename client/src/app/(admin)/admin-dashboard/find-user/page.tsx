"use client";

import { useEffect, useState } from "react";
import api from "@/services/axios"; // axios instance
import { toast } from "react-hot-toast";
import { User } from "@/app/types/type";

export default function FindUserPage() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Fetch University Hierarchy once
  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const res = await api.get<any>("/user/get-universityhierarchy");
        setUniversities(res.data?.universities);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load university hierarchy");
      }
    };
    fetchHierarchy();
  }, []);

  // Handle Search
  const handleSearch = async () => {
    if (!username.trim()) return toast.error("Please enter a username");
    setLoading(true);
    setUser(null);

    try {
      const res = await api.get<any>(`/admin/get-user-by-username/${username}`);
      setUser(res.data.user);
      toast.success("User found");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteMaterial = async (id: number) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      await api.delete(`/admin/delete-materials/${id}`);
      toast.success("Material deleted");
      setUser((prev: any) => ({
        ...prev,
        materials: prev.materials.filter((m: any) => m.id !== id),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete material");
    }
  };

  // Apply Filters
  const filteredMaterials = user?.materials?.filter((m: any) => {
    const uniMatch =
      !selectedUniversity ||
      m.course.department.university.id === Number(selectedUniversity);
    const deptMatch =
      !selectedDepartment ||
      m.course.department.id === Number(selectedDepartment);
    const courseMatch =
      !selectedCourse || m.course.id === Number(selectedCourse);
    return uniMatch && deptMatch && courseMatch;
  });

  // Get dropdown data dynamically
  const selectedUni = universities.find(
    (u) => u.id === Number(selectedUniversity)
  );
  const selectedDept = selectedUni?.departments?.find(
    (d:any) => d.id === Number(selectedDepartment)
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎯 Find User by Username</h1>

      {/* Search input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="bg-white p-5 rounded-xl shadow-md space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-500">@{user.username}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-400">Role: {user.role}</p>
            </div>
          </div>

          <hr />

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* University */}
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={selectedUniversity}
              onChange={(e) => {
                setSelectedUniversity(e.target.value);
                setSelectedDepartment("");
                setSelectedCourse("");
              }}
            >
              <option value="">All Universities</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            {/* Department */}
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedCourse("");
              }}
              disabled={!selectedUniversity}
            >
              <option value="">All Departments</option>
              {selectedUni?.departments?.map((d:any) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Course */}
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              disabled={!selectedDepartment}
            >
              <option value="">All Courses</option>
              {selectedDept?.courses?.map((c:any) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.courseCode})
                </option>
              ))}
            </select>
          </div>

          {/* Filtered materials */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">📚 Uploaded Materials</h3>
            {filteredMaterials?.length === 0 ? (
              <p className="text-gray-500">No materials found for filters.</p>
            ) : (
              <ul className="space-y-3">
                {filteredMaterials.map((m: any) => (
                  <li
                    key={m.id}
                    className="flex justify-between items-center border p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{m.title}</p>
                      <p className="text-sm text-gray-500">
                        {m.course.name} — {m.course.courseCode}
                      </p>
                      <p className="text-xs text-gray-400">
                        {m.course.department.name},{" "}
                        {m.course.department.university.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMaterial(m.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
