"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        setError(error.message);
        console.error("Error during password reset:", error);
      } else {
        setMessage("Check your email for the password reset link.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.png"
            alt="Tivrax Logo"
            width={240}
            height={240}
            className="object-contain"
            priority
          />
        </div>

        <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {message && <p className="text-green-500 mb-4">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {loading ? "Sending Reset Email..." : "Reset Password"}
          </button>

          <p className="mt-4 text-sm text-center text-gray-600">
            Remembered your password?{" "}
            <a href="/auth/signin" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
