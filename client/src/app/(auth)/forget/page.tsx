"use client";
import { useState } from "react";
import axios from "axios";
import { ForgetPasswordResponse } from "@/app/types/type";
import toast from "react-hot-toast";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<ForgetPasswordResponse>(`${api}/auth/forgot-password`, { email });
      toast.success(res.data?.message || "Forget Email Send")
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
        toast.success(err.res.data?.message || "Fail to Forget Email Send")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}
