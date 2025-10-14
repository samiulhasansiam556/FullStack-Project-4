"use client";

import { useState, useContext } from "react";
import toast from "react-hot-toast";
import api from "@/services/axios";
import MyContext from "@/context/MyContext";

export default function UploadMaterialPage() { 

  const { universities } = useContext(MyContext)!;
 
  const [form, setForm] = useState({
    title: "",
    description: "",
    universityId: "",
    departmentId: "",
    courseId: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "universityId") {
      setForm((prev) => ({ ...prev, departmentId: "", courseId: "" }));
    }
    if (name === "departmentId") {
      setForm((prev) => ({ ...prev, courseId: "" }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("courseId", form.courseId);
      formData.append("document", file);

      const res = await api.post("/user/upload-material", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.status === 201) {
        toast.success("Material uploaded successfully!");
        setForm({ title: "", description: "", universityId: "", departmentId: "", courseId: "" });
        setFile(null);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  
  // get selected options
  const selectedUniversity = universities.find((u) => u.id.toString() === form.universityId);
  const selectedDepartment = selectedUniversity?.departments.find(
    (d) => d.id.toString() === form.departmentId
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload Course Material
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={3}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* University Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University
            </label>
            <select
              name="universityId"
              value={form.universityId}
              onChange={handleSelectChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select University</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Select */}
          {selectedUniversity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleSelectChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Department</option>
                {selectedUniversity.departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Course Select */}
          {selectedDepartment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                name="courseId"
                value={form.courseId}
                onChange={handleSelectChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Course</option>
                {selectedDepartment.courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File
            </label>
            <input type="file" onChange={handleFileChange} required />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
