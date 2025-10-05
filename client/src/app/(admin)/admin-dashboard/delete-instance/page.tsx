"use client";

import { useEffect, useState } from "react";
import api from "@/services/axios";
import toast, { Toaster } from "react-hot-toast";

interface University {
  id: number;
  name: string;
}
interface Department {
  id: number;
  name: string;
  universityId: number;
}
interface Course {
  id: number;
  name: string;
  code: string;
  departmentId: number;
}

export default function ManageInstance() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [selectedUniversity, setSelectedUniversity] = useState<number | "">("");
  const [selectedDepartment, setSelectedDepartment] = useState<number | "">("");
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [uniRes, deptRes, courseRes] = await Promise.all([
        api.get<University[]>("/admin/get-universities"),
        api.get<Department[]>("/admin/get-departments"),
        api.get<Course[]>("/admin/get-courses"),
      ]);
      setUniversities(uniRes.data);
      setDepartments(deptRes.data);
      setCourses(courseRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch instances");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUniversity !== "") {
      setFilteredDepartments(
        departments.filter((d) => d.universityId === Number(selectedUniversity))
      );
    } else {
      setFilteredDepartments([]);
    }
    setSelectedDepartment("");
    setFilteredCourses([]);
  }, [selectedUniversity, departments]);

  useEffect(() => {
    if (selectedDepartment !== "") {
      setFilteredCourses(
        courses.filter((c) => c.departmentId === Number(selectedDepartment))
      );
    } else {
      setFilteredCourses([]);
    }
  }, [selectedDepartment, courses]);

  const handleDeleteUniversity = async () => {
    if (!selectedUniversity) return toast.error("Select a university first");
    if (!confirm("Are you sure to delete this university?")) return;

    try {
      setLoading(true);
      const res = await api.delete<{ message: string }>(
        `/admin/delete-university/${selectedUniversity}`
      );
      toast.success(res.data.message);
      setSelectedUniversity("");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete university");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return toast.error("Select a department first");
    if (!confirm("Are you sure to delete this department?")) return;

    try {
      setLoading(true);
      const res = await api.delete<{ message: string }>(
        `/admin/delete-department/${selectedDepartment}`
      );
      toast.success(res.data.message);
      setSelectedDepartment("");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete department");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("Are you sure to delete this course?")) return;

    try {
      setLoading(true);
      const res = await api.delete<{ message: string }>(
        `/admin/delete-course/${courseId}`
      );
      toast.success(res.data.message);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-xl font-bold mb-4">Manage Universities, Departments, and Courses</h1>

      {/* Delete University */}
      <div className="border p-4 rounded shadow-sm space-y-2">
        <h2 className="font-semibold text-lg">Delete University</h2>
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select University --</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleDeleteUniversity}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          disabled={loading}
        >
          Delete University
        </button>
      </div>

      {/* Delete Department */}
      <div className="border p-4 rounded shadow-sm space-y-2">
        <h2 className="font-semibold text-lg">Delete Department</h2>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select Department --</option>
          {filteredDepartments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleDeleteDepartment}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          disabled={loading}
        >
          Delete Department
        </button>
      </div>

      {/* Delete Course */}
      <div className="border p-4 rounded shadow-sm space-y-2">
        <h2 className="font-semibold text-lg">Delete Course</h2>
        {filteredCourses.length === 0 ? (
          <p className="text-gray-500">Select a department to see courses</p>
        ) : (
          <ul className="space-y-2">
            {filteredCourses.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{c.name} ({c.code})</span>
                <button
                  onClick={() => handleDeleteCourse(c.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
