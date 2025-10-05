"use client";

import { useEffect, useState, useContext } from "react";
import MyContext from "@/context/MyContext";
import api from "@/services/axios";
import {
  StudentProfile,
  University,
  Department,
  Course,
  Material,
} from "@/app/types/type";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const context = useContext(MyContext);
  if (!context) throw new Error("StudentDashboard must be used within MyState");

  const { user, studentProfile, setStudentProfile } = context;

  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<StudentProfile>(`/user/student`);
        setStudentProfile?.(res.data);
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      }
    };
    fetchProfile();
  }, [user?.id, setStudentProfile]);

  const handleDelete = async (id: number) => {
    try {
      const res = await api.delete(`/user/delete-material/${id}`);
      console.log(res);

      if (res.status !== 200) {
        toast.error(res.data?.message || "Delete Failed");
      } else {
        toast.success(res.data?.message || "Delete Successful");
        // Refresh the profile to update the materials list
        const profileRes = await api.get<StudentProfile>(`/user/student`);
        setStudentProfile?.(profileRes.data);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    }
  };

  if (!studentProfile) return <p>Loading...</p>;

  // Build unique universities/departments/courses from uploaded materials
  const universities: University[] = Array.from(
    new Map(
      studentProfile.materials.map((m) => [
        m.course.department.university.id,
        m.course.department.university,
      ])
    ).values()
  );

  const departments: Department[] = selectedUniversity
    ? Array.from(
        new Map(
          studentProfile.materials
            .filter(
              (m) => m.course.department.university.id === selectedUniversity.id
            )
            .map((m) => [
              m.course.department.id,
              m.course.department,
            ])
        ).values()
      )
    : [];

  const courses: Course[] = selectedDepartment
    ? Array.from(
        new Map(
          studentProfile.materials
            .filter((m) => m.course.department.id === selectedDepartment.id)
            .map((m) => [m.course.id, m.course])
        ).values()
      )
    : [];

  // Filter materials based on selection
  let filteredMaterials: Material[] = studentProfile.materials;
  if (selectedUniversity) {
    filteredMaterials = filteredMaterials.filter(
      (m) => m.course.department.university.id === selectedUniversity.id
    );
  }
  if (selectedDepartment) {
    filteredMaterials = filteredMaterials.filter(
      (m) => m.course.department.id === selectedDepartment.id
    );
  }
  if (selectedCourse) {
    filteredMaterials = filteredMaterials.filter(
      (m) => m.course.id === selectedCourse.id
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-sm border border-blue-100 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {studentProfile.profileImage && (
            <div className="relative">
              <img
                src={studentProfile.profileImage}
                alt={studentProfile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-lg ring-4 ring-white"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                {studentProfile.name}
              </h1>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium self-center sm:self-auto">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Student
              </span>
            </div>
            <p className="text-gray-500 text-lg mb-4 flex items-center justify-center sm:justify-start gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              @{studentProfile.username}
            </p>
            {studentProfile.bio && (
              <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                <p className="text-gray-700 leading-relaxed flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="flex-1">{studentProfile.bio}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Filter Materials</h2>
            <p className="text-gray-500 text-sm">Narrow down by university, department, and course</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* University Filter */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              University
            </label>
            <div className="relative">
              <select
                value={selectedUniversity?.id ?? ""}
                onChange={(e) => {
                  const uni = universities.find((u) => u.id === Number(e.target.value)) || null;
                  setSelectedUniversity(uni);
                  setSelectedDepartment(null);
                  setSelectedCourse(null);
                }}
                className="w-full bg-white border border-gray-300 rounded-xl py-3.5 px-4 pr-12 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 text-gray-700 font-medium"
              >
                <option value="" className="text-gray-400">Select University</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id} className="py-2">
                    {u.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Department Filter */}
          {selectedUniversity && (
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                Department
              </label>
              <div className="relative">
                <select
                  value={selectedDepartment?.id ?? ""}
                  onChange={(e) => {
                    const dept = departments.find((d) => d.id === Number(e.target.value)) || null;
                    setSelectedDepartment(dept);
                    setSelectedCourse(null);
                  }}
                  className="w-full bg-white border border-gray-300 rounded-xl py-3.5 px-4 pr-12 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 text-gray-700 font-medium"
                >
                  <option value="" className="text-gray-400">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id} className="py-2">
                      {d.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Course Filter */}
          {selectedDepartment && (
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                Course
              </label>
              <div className="relative">
                <select
                  value={selectedCourse?.id ?? ""}
                  onChange={(e) => {
                    const course = courses.find((c) => c.id === Number(e.target.value)) || null;
                    setSelectedCourse(course);
                  }}
                  className="w-full bg-white border border-gray-300 rounded-xl py-3.5 px-4 pr-12 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 text-gray-700 font-medium"
                >
                  <option value="" className="text-gray-400">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="py-2">
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {(selectedUniversity || selectedDepartment || selectedCourse) && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setSelectedUniversity(null);
                setSelectedDepartment(null);
                setSelectedCourse(null);
              }}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            Uploaded Materials
            <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 py-1 rounded-full ml-2">
              {filteredMaterials.length}
            </span>
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-base sm:text-lg mb-2">
                No materials available
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Upload some materials to get started
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {filteredMaterials.map((m) => (
                <div
                  key={m.id}
                  className="group bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-1">
                            {m.title}
                          </h3>
                          {m.description && (
                            <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                              {m.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <span className="truncate max-w-[80px] sm:max-w-none">
                            {m.course.name}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span className="truncate max-w-[80px] sm:max-w-none">
                            {m.course.department.name}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span className="truncate max-w-[80px] sm:max-w-none">
                            {m.course.department.university.name}
                          </span>
                        </span>
                        {m.fileType && (
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="hidden xs:inline">
                              {m.fileType.toUpperCase()}
                            </span>
                            <span className="xs:hidden">
                              {m.fileType.slice(0, 3).toUpperCase()}
                            </span>
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
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        <span className="hidden sm:inline">Download</span>
                        <span className="sm:hidden">DL</span>
                      </a>
                      <button 
                        onClick={() => handleDelete(m.id)}
                        className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-red-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base flex-1 sm:flex-none"
                      >
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span className="hidden sm:inline">Delete</span>
                        <span className="sm:hidden">Del</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}