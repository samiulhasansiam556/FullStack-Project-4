'use client'

import { useEffect, useState, useContext } from "react";
import MyContext from "@/context/MyContext";
import api from "@/services/axios";
import { StudentProfile, University, Department, Course, Material } from "@/app/types/type";

export default function StudentDashboard() {
  const context = useContext(MyContext);
  if (!context) throw new Error('StudentDashboard must be used within MyState');

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

  if (!studentProfile) return <p>Loading...</p>;

  // Build unique universities/departments/courses from uploaded materials
  const universities: University[] = Array.from(
    new Map(
      studentProfile.materials.map((m) => [m.course.department.university.id, m.course.department.university])
    ).values()
  );

  const departments: Department[] = selectedUniversity
    ? Array.from(
        new Map(
          studentProfile.materials
            .filter((m) => m.course.department.university.id === selectedUniversity.id)
            .map((m) => [m.course.department.id, m.course.department])
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
    <div className="max-w-3xl mx-auto p-4">
      {/* Profile Info */}
      <div className="flex items-center space-x-4 mb-6">
        {studentProfile.profileImage && (
          <img
            src={studentProfile.profileImage}
            alt={studentProfile.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{studentProfile.name}</h2>
          <p className="text-gray-500">@{studentProfile.username}</p>
          <p className="text-gray-600">{studentProfile.bio}</p>
        </div>
      </div>

      {/* Category Selects */}
      <div className="space-y-4 mb-6">
        {/* University */}
        <div>
          <label className="block mb-1 font-medium">University</label>
          <select
            value={selectedUniversity?.id ?? ""}
            onChange={(e) => {
              const uni = universities.find((u) => u.id === Number(e.target.value)) || null;
              setSelectedUniversity(uni);
              setSelectedDepartment(null);
              setSelectedCourse(null);
            }}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select University --</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Department */}
        {selectedUniversity && (
          <div>
            <label className="block mb-1 font-medium">Department</label>
            <select
              value={selectedDepartment?.id ?? ""}
              onChange={(e) => {
                const dept = departments.find((d) => d.id === Number(e.target.value)) || null;
                setSelectedDepartment(dept);
                setSelectedCourse(null);
              }}
              className="w-full border rounded p-2"
            >
              <option value="">-- Select Department --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Course */}
        {selectedDepartment && (
          <div>
            <label className="block mb-1 font-medium">Course</label>
            <select
              value={selectedCourse?.id ?? ""}
              onChange={(e) => {
                const course = courses.find((c) => c.id === Number(e.target.value)) || null;
                setSelectedCourse(course);
              }}
              className="w-full border rounded p-2"
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Materials List */}
      <div>
        {filteredMaterials.length === 0 ? (
          <p className="text-gray-500">No materials found</p>
        ) : (
          <ul className="space-y-2">
            {filteredMaterials.map((m) => (
              <li key={m.id} className="flex justify-between items-center border p-2 rounded">
                <span>{m.title}</span>
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={m.title}
                  className="text-blue-600 underline"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
