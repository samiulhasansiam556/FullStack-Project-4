"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ResetPasswordResponse } from "@/app/types/type";
import toast from "react-hot-toast";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/auth";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post<ResetPasswordResponse>(`${api}/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      toast.success(res.data?.message || "Password reset successful")
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
      toast.success(err.res.data?.message || "Fail to Reset Password")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}
