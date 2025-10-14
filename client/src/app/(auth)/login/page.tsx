"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import api from "@/services/axios";
import toast from "react-hot-toast";
import { LoginForm, LogInResponse } from "@/app/types/type";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //console.log("Login submitted:", form);
    try {
      const res = await api.post<LogInResponse>(`/auth/sign-in`, form, {
        headers: { "Content-Type": "application/json" },
      });
      //console.log(res);
      if (res.status === 200) {
        toast.success(res.data?.message || "Login successful!");
        setForm({ email: "", password: "" });
        const role = res.data.user.role;
        if (role === "STUDENT") {
          router.push("/");
        } else {
          router.push("/admin-dashboard"); 
        }
        // document.cookie = `token=${res.data.token}; path=/; max-age=${7*24*60*60}`;
      } else {
        toast.error(res.data?.message || "Login failed.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="abc@gmail.com"
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
          >
            Log In
          </button>
        </form>

        <button className="flex justify-right mt-2">
          <a
            href="/forget"
            className="text-indigo-600  font-medium hover:underline"
          >
            Forgot Password
          </a>
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
