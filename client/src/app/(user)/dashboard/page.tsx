"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MyContext from "@/context/MyContext";
import api from "@/services/axios";
import { University, Department, Course, Material } from "@/app/types/type";

export default function DownloadMaterialsPage() {
  const { universities, materials, setMaterials } = useContext(MyContext);

  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // 🔹 Handle University change
  const handleUniversityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uniId = Number(e.target.value);
    const uni = universities?.find((u) => u.id === uniId) || null;
    setSelectedUniversity(uni);
    setSelectedDepartment(null);
    setSelectedCourse(null);

    if (uni) {
      try {
        const res = await api.get<Material[]>(`/user/university/${uni.id}`);
        setMaterials?.(res.data);
      } catch (err) {
        console.error("Error fetching materials:", err);
        setMaterials?.([]);
      }
    } else {
      setMaterials?.([]);
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = Number(e.target.value);
    const dept = selectedUniversity?.departments?.find((d) => d.id === deptId) || null;
    setSelectedDepartment(dept);
    setSelectedCourse(null);
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = Number(e.target.value);
    const course = selectedDepartment?.courses?.find((c) => c.id === courseId) || null;
    setSelectedCourse(course);
  };

  // 🔹 Filter materials based on selected Department / Course
  let filteredMaterials: Material[] = materials || [];
  if (selectedDepartment) {
    filteredMaterials = filteredMaterials.filter(
      (m) => m.course?.department?.id === selectedDepartment.id
    );
  }
  if (selectedCourse) {
    filteredMaterials = filteredMaterials.filter(
      (m) => m.course?.id === selectedCourse.id
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📚 Download Materials</h1>

      {/* 🔸 University Select */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Select University</label>
        <select
          onChange={handleUniversityChange}
          value={selectedUniversity?.id ?? ""}
          className="w-full border rounded-md p-2 focus:ring focus:ring-blue-400"
        >
          <option value="">-- Select University --</option>
          {universities?.map((uni) => (
            <option key={uni.id} value={uni.id}>
              {uni.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔸 Department Select */}
      {selectedUniversity && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">Select Department</label>
          <select
            onChange={handleDepartmentChange}
            value={selectedDepartment?.id ?? ""}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-400"
          >
            <option value="">-- Select Department --</option>
            {selectedUniversity.departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 🔸 Course Select */}
      {selectedDepartment && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">Select Course</label>
          <select
            onChange={handleCourseChange}
            value={selectedCourse?.id ?? ""}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-400"
          >
            <option value="">-- Select Course --</option>
            {selectedDepartment.courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 🔸 Materials Section */}
      <div className="mt-8">
        {filteredMaterials.length === 0 ? (
          <p className="text-gray-500 text-center">No materials found ❌</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Uploaded Materials
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
                  {filteredMaterials.length}
                </span>
              </h2>
            </div>

            <div className="p-6 grid gap-4">
              {filteredMaterials.map((m) => (
                <div
                  key={m.id}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  {/* Uploader Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={m.uploader?.profileImage || "/default-avatar.png"}
                      alt={m.uploader?.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                    <div>
                      <Link
                        href={`/user-profile/${m.uploader?.id ?? ""}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {m.uploader?.name || "Unknown User"}
                      </Link>
                      <p className="text-gray-500 text-sm">@{m.uploader?.username || "unknown"}</p>
                    </div>
                  </div>

                  {/* Material Info */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {m.title}
                    </h3>
                    {m.description && (
                      <p className="text-gray-600 mt-1 text-sm">{m.description}</p>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {m.course?.name || "Unknown Course"}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {m.course?.department?.name || "Unknown Dept"}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {m.course?.department?.university?.name || "Unknown Univ"}
                    </span>
                    {m.fileType && (
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        {m.fileType.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-4">
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={m.title}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    >
                      Download
                    </a>
                    <button className="text-gray-500 hover:text-red-600 px-4 py-2 rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
