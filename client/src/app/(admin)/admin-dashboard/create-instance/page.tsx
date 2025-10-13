"use client";

import { useState, useEffect } from "react";
import api from "@/services/axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import MyContext from "@/context/MyContext";
// Types
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

export default function CreateInstance() {
  
  // Form states
  const [universities, setUniversities] = useState<University[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);

  const [uniName, setUniName] = useState("");
  const [deptName, setDeptName] = useState("");
  const [deptUniversityId, setDeptUniversityId] = useState<number | "">("");
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseDepartmentId, setCourseDepartmentId] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  // Fetch all universities
  const fetchUniversities = async () => {
    try {
      const res = await api.get<University[]>("/admin/get-universities");
      setUniversities(res.data);
    } catch (err) {
      console.error("Error fetching universities:", err);
    }
  };

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get<Department[]>("/admin/get-departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchUniversities();
    fetchDepartments();
  }, []);

  // Filter departments when university changes
  useEffect(() => {
    if (deptUniversityId !== "") {
      setFilteredDepartments(
        departments.filter((d) => d.universityId === Number(deptUniversityId))
      );
    } else {
      setFilteredDepartments([]);
    }
    setCourseDepartmentId("");
  }, [deptUniversityId, departments]);

  // Create University
  const handleCreateUniversity = async () => {
    if (!uniName) return alert("University name required");
    try {
      setLoading(true);
      const res = await api.post<{ message: string; university: University }>(
        "/admin/create-university",
        { name: uniName }
      );
      toast.success(res.data.message);
      setUniName("");
      fetchUniversities();
    } catch (err: any) {
      console.error(err);
     toast.error(err.response?.data?.message || "Failed to create university");
    } finally {
      setLoading(false);
    }
  };

  // Create Department
  const handleCreateDepartment = async () => {
    if (!deptName || !deptUniversityId) return alert("Department name and university required");
    try {
      setLoading(true);
      const res = await api.post<{ message: string; department: Department }>(
        "/admin/create-department",
        { name: deptName, universityId: deptUniversityId }
      );
      toast.success(res.data.message);
      setDeptName("");
      setDeptUniversityId("");
      fetchDepartments();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  // Create Course
  const handleCreateCourse = async () => {
    if (!courseName || !courseCode || !courseDepartmentId)
      return alert("Course name, code, and department required");
    try {
      setLoading(true);
      const res = await api.post<{ message: string }>(
        "/admin/create-course",
        { name: courseName, code: courseCode, departmentId: courseDepartmentId }
      );
      toast.success(res.data.message);
      setCourseName("");
      setCourseCode("");
      setCourseDepartmentId("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Create University */}
      <div className="border p-4 rounded shadow-sm space-y-2">
        <h2 className="font-semibold text-lg">Create University</h2>
        <input
          type="text"
          placeholder="University Name"
          value={uniName}
          onChange={(e) => setUniName(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleCreateUniversity}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          Create University
        </button>
      </div>

      {/* Create Department */}
      <div className="border p-4 rounded shadow-sm space-y-2">
        <h2 className="font-semibold text-lg">Create Department</h2>
        <input
          type="text"
          placeholder="Department Name"
          value={deptName}
          onChange={(e) => setDeptName(e.target.value)}
          className="w-full border rounded p-2"
        />
        <select
          value={deptUniversityId}
          onChange={(e) => setDeptUniversityId(Number(e.target.value))}
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
          onClick={handleCreateDepartment}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          Create Department
        </button>
      </div>

      {/* Create Course */}
      <div className="border p-4 rounded shadow-sm space-y-2">
        <h2 className="font-semibold text-lg">Create Course</h2>
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Course Code"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="w-full border rounded p-2"
        />
        <select
          value={courseDepartmentId}
          onChange={(e) => setCourseDepartmentId(Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select Department --</option>
          {filteredDepartments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} (
              {universities.find((u) => u.id === d.universityId)?.name})
            </option>
          ))}
        </select>
        <button
          onClick={handleCreateCourse}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          disabled={loading}
        >
          Create Course
        </button>
      </div>
    </div>
  );
}
