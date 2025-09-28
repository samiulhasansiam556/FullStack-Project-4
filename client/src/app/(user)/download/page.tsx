"use client";

import { useContext, useState } from "react";
import MyContext from "@/context/MyContext";
import api from "@/services/axios";
import { University, Department, Course, Material } from "@/app/types/type";

export default function DownloadMaterialsPage() {
  const { universities, materials, setMaterials } = useContext(MyContext);

  console.log(universities);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleUniversityChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const uni =
      universities.find((u) => u.id === Number(e.target.value)) || null;
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

   console.log(materials)
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept =
      selectedUniversity?.departments.find(
        (d) => d.id === Number(e.target.value)
      ) || null;
    setSelectedDepartment(dept);
    setSelectedCourse(null);
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const course =
      selectedDepartment?.courses.find(
        (c) => c.id === Number(e.target.value)
      ) || null;
    setSelectedCourse(course);
  };

  // Filter materials locally
  let filteredMaterials: Material[] = materials || [];
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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Download Materials</h1>

      {/* University Select */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Select University</label>
        <select
          onChange={handleUniversityChange}
          value={selectedUniversity?.id ?? ""}
          className="w-full border rounded p-2"
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
        <div className="mb-3">
          <label className="block mb-1 font-medium">Select Department</label>
          <select
            onChange={handleDepartmentChange}
            value={selectedDepartment?.id ?? ""}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Department --</option>
            {selectedUniversity.departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Course Select */}
      {selectedDepartment && (
        <div className="mb-3">
          <label className="block mb-1 font-medium">Select Course</label>
          <select
            onChange={handleCourseChange}
            value={selectedCourse?.id ?? ""}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Course --</option>
            {selectedDepartment.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Materials List */}
      <div className="mt-6">
        {filteredMaterials.length === 0 ? (
          <p className="text-gray-500">No materials found</p>
        ) : (
          <ul className="space-y-2">
            {filteredMaterials.map((m) => (
              <li
                key={m.id}
                className="flex justify-between items-center border p-2 rounded"
              >
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
