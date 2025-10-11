"use client";

import { useEffect, useState } from "react";
import api from "@/services/axios";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

type Totals = {
  totalUsers: number;
  totalAdmins: number;
  totalStudents: number;
  totalMaterials: number;
};

type RoleCount = { role: string; count: number };
type Contributor = { id: number; name: string; username: string; materialsCount: number };
type TimePoint = { date: string; count: number };
type Voter = { userId: number; name: string; username: string; votes?: number; comments?: number };
type UnivUser = { universityId: number; universityName: string; count: number };

type AnalyticsResponse = {
  totals: Totals;
  roleCounts: RoleCount[];
  topContributors: Contributor[];
  uploadsOverTime: TimePoint[];
  topVoters: Voter[];
  topCommenters: Voter[];
  usersByUniversity: UnivUser[];
};

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#7C3AED", "#06B6D4"];

export default function AdminAnalyzeUsersPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get<AnalyticsResponse>("/admin/analytics");
        setData(res.data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ✅ safely handle null data
  const usersByUniversity = data?.usersByUniversity ?? [];

  const rolePieData = data?.roleCounts ?? [];
  const topContributorsBar =
    data?.topContributors.map((c) => ({
      name: c.username || c.name,
      count: c.materialsCount,
    })) || [];

  const uploadsLine =
    data?.uploadsOverTime.map((p) => ({
      date: p.date,
      count: p.count,
    })) || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analyze Users & Activity</h1>

      {loading && <p>Loading...</p>}
      {!loading && !data && <p>No data available</p>}

      {data && (
        <>
          {/* summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded shadow">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{data.totals.totalUsers}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-sm text-gray-500">Students</p>
              <p className="text-2xl font-bold">{data.totals.totalStudents}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold">{data.totals.totalAdmins}</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-sm text-gray-500">Total Materials</p>
              <p className="text-2xl font-bold">{data.totals.totalMaterials}</p>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Role distribution */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Role Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={rolePieData} dataKey="count" nameKey="role" outerRadius={80} label>
                    {rolePieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top contributors */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Top Contributors</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topContributorsBar}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="count" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Uploads over time */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Uploads (last 30 days)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={uploadsLine}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ReTooltip />
                  <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* tables row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow overflow-auto">
              <h3 className="font-semibold mb-2">Top Voters</h3>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-1">User</th>
                    <th>Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topVoters.map((v) => (
                    <tr key={v.userId} className="border-t">
                      <td className="py-2">
                        {v.name} ({v.username})
                      </td>
                      <td className="text-right">{v.votes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white p-4 rounded shadow overflow-auto">
              <h3 className="font-semibold mb-2">Top Commenters</h3>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-1">User</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topCommenters.map((c) => (
                    <tr key={c.userId} className="border-t">
                      <td className="py-2">
                        {c.name} ({c.username})
                      </td>
                      <td className="text-right">{c.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ Users by University */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Users by University</h3>

            <ul className="space-y-2 mb-4">
              {usersByUniversity.map((u) => (
                <li key={u.universityId} className="flex justify-between">
                  <div>{u.universityName}</div>
                  <div className="font-medium">{u.count}</div>
                </li>
              ))}
            </ul>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usersByUniversity}>
                <XAxis dataKey="universityName" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="count" name="Users" fill="#7C3AED" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
