"use client";

import { useEffect, useState } from "react";
import api from "@/services/axios";
import toast from "react-hot-toast";

export default function ManageHierarchyPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<{ type: string; id: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editCode, setEditCode] = useState(""); // for course code

  // fetch hierarchy
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<{ universities: any[] }>("/admin/get-universityhierarchy");
        setUniversities(res.data.universities);
      } catch (err) {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const handleEdit = (type: string, id: number, name: string, code?: string) => {
    setEditItem({ type, id });
    setEditValue(name);
    setEditCode(code || "");
  };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      let url = "";
      const body: any = { name: editValue };
      if (editItem.type === "university") url = `/admin/update-university/${editItem.id}`;
      if (editItem.type === "department") url = `/admin/update-department/${editItem.id}`;
      if (editItem.type === "course") {
        url = `/admin/update-course/${editItem.id}`;
        body.code = editCode;
      }

      const res = await api.put<any>(url, body);
      toast.success(res.data?.message);
      setEditItem(null);
      // refresh list
      const updated = await api.get<{ universities: any[] }>("/admin/get-universityhierarchy");
      setUniversities(updated.data.universities);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage University Hierarchy</h1>

      <div className="space-y-4">
        {universities.map((uni) => (
          <div key={uni.id} className="border rounded p-3 bg-white shadow-sm">
            {/* --- University --- */}
            <div className="flex justify-between items-center">
              {editItem?.type === "university" && editItem.id === uni.id ? (
                <div className="flex gap-2">
                  <input
                    className="border p-1 rounded"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <button className="bg-green-500 text-white px-2 rounded" onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className="bg-gray-300 px-2 rounded"
                    onClick={() => setEditItem(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-semibold text-lg">{uni.name}</h2>
                  <button
                    className="text-blue-600 hover:underline "
                    onClick={() => handleEdit("university", uni.id, uni.name)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            {/* --- Departments --- */}
            <div className="ml-4 mt-2 space-y-2">
              {uni.departments.map((dept: any) => (
                <div key={dept.id} className="pl-2 border-l-2 border-gray-200">
                  {editItem?.type === "department" && editItem.id === dept.id ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        className="border p-1 rounded"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <button className="bg-green-500 text-white px-2 rounded" onClick={handleSave}>
                        Save
                      </button>
                      <button
                        className="bg-gray-300 px-2 rounded"
                        onClick={() => setEditItem(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{dept.name}</p>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEdit("department", dept.id, dept.name)}
                      >
                        Edit
                      </button>
                    </div>
                  )}

                  {/* --- Courses --- */}
                  <div className="ml-4 mt-1 space-y-1">
                    {dept.courses.map((course: any) => (
                      <div
                        key={course.id}
                        className="flex justify-between items-center text-sm"
                      >
                        {editItem?.type === "course" && editItem.id === course.id ? (
                          <div className="flex gap-2 items-center">
                            <input
                              className="border p-1 rounded"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              placeholder="Course name"
                            />
                            <input
                              className="border p-1 rounded"
                              value={editCode}
                              onChange={(e) => setEditCode(e.target.value)}
                              placeholder="Code"
                              style={{ width: "80px" }}
                            />
                            <button className="bg-green-500 text-white px-2 rounded" onClick={handleSave}>
                              Save
                            </button>
                            <button
                              className="bg-gray-300 px-2 rounded"
                              onClick={() => setEditItem(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <p>
                              {course.name} ({course.code})
                            </p>
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() =>
                                handleEdit("course", course.id, course.name, course.code)
                              }
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
