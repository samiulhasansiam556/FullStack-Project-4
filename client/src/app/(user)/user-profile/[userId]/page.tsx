"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/axios";
import Image from "next/image";
import Link from "next/link";
import { University, Department, Course, Material } from "@/app/types/type";

interface UserProfile {
  id: number;
  name: string;
  username: string;
  bio?: string;
  profileImage?: string;
  materials: Material[];
}

export default function UserProfilePage() {
const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await api.get<UserProfile>(`/user/get-user-details/${userId}`);
      setProfile({
        ...res.data,
        materials: res.data.materials || [], // fallback
      });
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };
  fetchProfile();
}, [userId]);

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  // Unique universities
  const universities: University[] = Array.from(
    new Map(
      profile.materials.map((m) => [
        m.course.department.university.id,
        m.course.department.university as University,
      ])
    ).values()
  );

  // Unique departments
  const departments: Department[] = selectedUniversity
    ? Array.from(
        new Map(
          profile.materials
            .filter((m) => m.course.department.university.id === selectedUniversity.id)
            .map((m) => [m.course.department.id, m.course.department])
        ).values()
      )
    : [];

  // Unique courses
  const courses: Course[] = selectedDepartment
    ? Array.from(
        new Map(
          profile.materials
            .filter((m) => m.course.department.id === selectedDepartment.id)
            .map((m) => [m.course.id, m.course])
        ).values()
      )
    : [];

  // Filter materials
  let filteredMaterials: Material[] = profile.materials;
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Info */}
      {/* Profile Section */}
<div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
  <div className="flex items-start gap-6">
    {profile.profileImage && (
      <div className="relative">
        <Image
          src={profile.profileImage}
          alt={profile.name}
          width={96}
          height={96}
          className="rounded-2xl object-cover shadow-lg ring-4 ring-white"
        />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
      </div>
    )}
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
          {profile.name}
        </h1>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
          Student
        </span>
      </div>
      <p className="text-gray-500 text-lg mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        @{profile.username}
      </p>
      {profile.bio && (
        <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
          <p className="text-gray-700 leading-relaxed flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {profile.bio}
          </p>
        </div>
      )}
    </div>
  </div>
</div>

{/* Filters Section */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
  <div className="flex items-center gap-2 mb-6">
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
    <h2 className="text-xl font-bold text-gray-800">Filter Materials</h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* University Filter */}
    <div className="group">
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
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
          className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
        >
          <option value="">Select University</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    {/* Department Filter */}
    {selectedUniversity && (
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
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
            className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    )}

    {/* Course Filter */}
    {selectedDepartment && (
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Course
        </label>
        <div className="relative">
          <select
            value={selectedCourse?.id ?? ""}
            onChange={(e) => {
              const course = courses.find((c) => c.id === Number(e.target.value)) || null;
              setSelectedCourse(course);
            }}
            className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Clear Filters Button */}
  {(selectedUniversity || selectedDepartment || selectedCourse) && (
    <div className="mt-4 flex justify-end">
      <button
        onClick={() => {
          setSelectedUniversity(null);
          setSelectedDepartment(null);
          setSelectedCourse(null);
        }}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        Clear Filters
      </button>
    </div>
  )}
</div>
      {/* Materials */}
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
    {filteredMaterials.length === 0 ? (
      <div className="text-center py-8 sm:py-12">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-500 text-base sm:text-lg mb-2">No materials available</p>
        <p className="text-gray-400 text-xs sm:text-sm">Upload some materials to get started</p>
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
                    <span className="truncate max-w-[80px] sm:max-w-none">{m.course.name}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="truncate max-w-[80px] sm:max-w-none">{m.course.department.name}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="truncate max-w-[80px] sm:max-w-none">{m.course.department.university.name}</span>
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
    )}
  </div>
</div>
    </div>
  );
}
