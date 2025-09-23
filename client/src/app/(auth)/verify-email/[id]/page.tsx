"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { VerifyEmailResponse } from "@/app/types/type";

export default function VerifyEmailPage() {
  const { id } = useParams(); // token from URL (/verify/[id])
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get<VerifyEmailResponse>(`${api}/auth/verify-email/${id}`);
        if (res.status === 200) {
          setMessage(res.data.message || "Email verified successfully!");
          toast.success("Email verified 🎉");
        } else {
          setMessage(res.data.message || "Verification failed.");
          toast.error("Verification failed ❌");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setMessage(err.response?.data?.message || "Something went wrong.");
        toast.error(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (id) verify();
  }, [id, api]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Email Verification</h2>

        {loading ? (
          <p className="text-gray-600">Verifying your email, please wait...</p>
        ) : (
          <>
            <p className="text-gray-700 mb-6">{message}</p>

            <button
              onClick={() => router.push("/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
