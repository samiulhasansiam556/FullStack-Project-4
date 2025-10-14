"use client";

import { useContext, useMemo, useState } from "react";
import MyContext from "@/context/MyContext";
import { University } from "@/app/types/type";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#9c27b0",
  "#f44336",
];

// Helper: filter by date range
function filterByDate<T extends { createdAt: string }>(
  items: T[],
  filter: string
) {
  const now = new Date();
  return items.filter((item) => {
    const created = new Date(item.createdAt);

    switch (filter) {
      case "day":
        return created.toDateString() === now.toDateString();
      case "week":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        return created >= startOfWeek;
      case "month":
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      case "year":
        return created.getFullYear() === now.getFullYear();
      default:
        return true; // all
    }
  });
}

export default function AnalyzeDocuments() {
  const context = useContext(MyContext);
  if (!context) throw new Error("Must be used within MyState");

  const { universities } = context;

  const [dateFilter, setDateFilter] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(
    null
  );
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );

  // University-level data
  const universityData = useMemo(() => {
    return universities.map((u) => {
      const allMaterials = u.departments.flatMap((d) =>
        d.courses.flatMap((c) => filterByDate(c.materials, dateFilter))
      );
      return { name: u.name, count: allMaterials.length };
    });
  }, [universities, dateFilter]);

  const totalUniversityDocs = universityData.reduce(
    (sum, u) => sum + u.count,
    0
  );

  // Department-level data
  const departmentData = useMemo(() => {
    if (!selectedUniversity) return [];
    const uni = universities.find((u) => u.id === selectedUniversity);
    if (!uni) return [];
    const deptData = uni.departments.map((d) => {
      const allMaterials = d.courses.flatMap((c) =>
        filterByDate(c.materials, dateFilter)
      );
      return { name: d.name, count: allMaterials.length };
    });
    const total = deptData.reduce((s, d) => s + d.count, 0);
    return deptData.map((d) => ({
      ...d,
      percentage: total ? ((d.count / total) * 100).toFixed(1) : "0.0",
    }));
  }, [universities, selectedUniversity, dateFilter]);

  // Course-level data
  const courseData = useMemo(() => {
    if (!selectedUniversity || !selectedDepartment) return [];
    const uni = universities.find((u) => u.id === selectedUniversity);
    const dept = uni?.departments.find((d) => d.id === selectedDepartment);
    if (!dept) return [];
    const courseData = dept.courses.map((c) => ({
      name: c.name,
      count: filterByDate(c.materials, dateFilter).length,
    }));
    const total = courseData.reduce((s, c) => s + c.count, 0);
    return courseData.map((c) => ({
      ...c,
      percentage: total ? ((c.count / total) * 100).toFixed(1) : "0.0",
    }));
  }, [universities, selectedUniversity, selectedDepartment, dateFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Time</option>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        <select
          value={selectedUniversity ?? ""}
          onChange={(e) =>
            setSelectedUniversity(Number(e.target.value) || null)
          }
          className="border p-2 rounded"
        >
          <option value="">Select University</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartment ?? ""}
          onChange={(e) =>
            setSelectedDepartment(Number(e.target.value) || null)
          }
          className="border p-2 rounded"
          disabled={!selectedUniversity}
        >
          <option value="">Select Department</option>
          {selectedUniversity &&
            universities
              .find((u) => u.id === selectedUniversity)
              ?.departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
        </select>
      </div>

      {/* University Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">PDFs by University</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={universityData}
              dataKey="count"
              nameKey="name"
              outerRadius={120}
              label={(props) => {
                const { name, value } = props;
                const percentage =
                  totalUniversityDocs === 0
                    ? 0
                    : ((Number(value) / totalUniversityDocs) * 100).toFixed(1);
                return `${name} (${value}, ${percentage}%)`;
              }}
            >
              {universityData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const percentage =
                  totalUniversityDocs === 0
                    ? 0
                    : ((Number(value) / totalUniversityDocs) * 100).toFixed(1);
                return [`${value} PDFs (${percentage}%)`, name];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Department Chart */}
      {selectedUniversity && (
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">PDFs by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name, props: any) => [
                  `${value} PDFs (${props.payload.percentage}%)`,
                  name,
                ]}
              />
              <Legend />
              <Bar dataKey="count" fill="#8884d8">
                <LabelList
                  dataKey="percentage"
                  position="top"
                  formatter={(label) => (typeof label === "string" ? `${label}%` : label)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Course Chart */}
      {selectedDepartment && (
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">PDFs by Course</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name, props: any) => [
                  `${value} PDFs (${props.payload.percentage}%)`,
                  name,
                ]}
              />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d">
                <LabelList
                  dataKey="percentage"
                  position="top"
                  formatter={(label) => typeof label === "string" ? `${label}%` : label}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
