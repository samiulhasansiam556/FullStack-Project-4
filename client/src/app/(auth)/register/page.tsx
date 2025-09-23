"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SignUpForm, SignUpResponse } from "@/app/types/type";

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const api = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
   // console.log("Form submitted:", form);

    try {
      const res = await axios.post<SignUpResponse>(
        `${api}/auth/sign-up`,
        form, 
        {
          headers: { "Content-Type": "application/json" },
        }
      );

       // console.log("res",res)
      if (res.status === 201) {
         toast.success(res.data.message || "User registered. Check your email to verify.")
        //  setForm({ name: "", username: "", email: "", password: "" });
      } else {
        toast.error(res.data?.message || "Signup failed.");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create an Account
        </h2>

        {/* ✅ No action, React handles it */}
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Samiul"
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="siam"
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

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
            type="submit" // ✅ ensures React handles submission
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
