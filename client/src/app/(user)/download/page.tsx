"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MyContext from "@/context/MyContext";
import api from "@/services/axios";
import { University, Department, Course} from "@/app/types/type";

// app/types/type.ts

export interface User {
  id: number;
  name: string;
  username: string;
  profileImage: string;
  bio: string;
}

export interface Material {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploaderId: number;
  courseId: number;
  createdAt: string;
  course: Course;
  uploader: User; // Add this
}



export default function DownloadMaterialsPage() {
  const { universities, materials, setMaterials } = useContext(MyContext);

  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleUniversityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uni = universities?.find((u) => u.id === Number(e.target.value)) || null;
    setSelectedUniversity(uni);
    setSelectedDepartment(null);
    setSelectedCourse(null);

    if (uni) {
      try {
        const res = await api.get<Material[]>(`/user/university/${uni.id}`);
        setMaterials(res.data);
      } catch (err) {
        console.error("Error fetching materials:", err);
        setMaterials([]);
      }
    } else {
      setMaterials([]);
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = selectedUniversity?.departments?.find((d) => d.id === Number(e.target.value)) || null;
    setSelectedDepartment(dept);
    setSelectedCourse(null);
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const course = selectedDepartment?.courses?.find((c) => c.id === Number(e.target.value)) || null;
    setSelectedCourse(course);
  };

  // Safe filtering with optional chaining
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📚 Download Materials
      </h1>

      {/* University Select */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">
          Select University
        </label>
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

      {/* Department Select */}
      {selectedUniversity && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">
            Select Department
          </label>
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

      {/* Course Select */}
      {selectedDepartment && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">
            Select Course
          </label>
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

      {/* Materials List */}
      <div className="mt-8">
        {filteredMaterials.length === 0 ? (
          <p className="text-gray-500 text-center">No materials found ❌</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Uploaded Materials
                <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 py-1 rounded-full ml-2">
                  {filteredMaterials.length}
                </span>
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid gap-3 sm:gap-4">
                {filteredMaterials.map((m) => (
                  <div
                    key={m.id}
                    className="group bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Uploader Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0">
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
                          </div>
                          <div>
                            <Link 
                              href={`/user-profile/${m.uploader?.id || ''}`}
                              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm sm:text-base"
                            >
                              {m.uploader?.name || "Unknown User"}
                            </Link>
                            <p className="text-gray-500 text-xs sm:text-sm">
                              @{m.uploader?.username || "unknown"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-1">
                              {m.title}
                            </h3>
                            {m.description && (
                              <p className="text-gray-600 mt-1 text-sm line-clamp-2">{m.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="truncate max-w-[80px] sm:max-w-none">
                              {m.course?.name || "Unknown Course"}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="truncate max-w-[80px] sm:max-w-none">
                              {m.course?.department?.name || "Unknown Department"}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="truncate max-w-[80px] sm:max-w-none">
                              {m.course?.department?.university?.name || "Unknown University"}
                            </span>
                          </span>
                          {m.fileType && (
                            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="hidden xs:inline">{m.fileType.toUpperCase()}</span>
                              <span className="xs:hidden">{m.fileType.slice(0, 3).toUpperCase()}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 sm:ml-4">
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={m.title}
                          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base flex-1 sm:flex-none"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span className="hidden sm:inline">Download</span>
                          <span className="sm:hidden">DL</span>
                        </a>
                        <button className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-red-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base flex-1 sm:flex-none">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">Del</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}