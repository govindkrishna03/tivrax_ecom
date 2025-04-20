"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, LogOut, Pencil } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editMobile, setEditMobile] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.error("Fetch error:", error?.message);
        router.push("/auth/signin");
        return;
      }

      const { email, user_metadata } = data.user;
      setUser(data.user);
      setEmail(email);
      setName(user_metadata?.full_name || "");
      setMobile(user_metadata?.mobile || "");
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    // Ensure the data object is structured correctly for updating user metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name.trim(),
        mobile: mobile.trim(), // Update the custom metadata field for mobile number
      },
    });

    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      setSuccessMessage("Profile updated successfully!");
      setEditName(false);
      setEditMobile(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }

    setUpdating(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Sign-out error: " + error.message);
    } else {
      router.push("/");
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>

      <form onSubmit={handleUpdate} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editName}
              className={`w-full p-3 mt-1 border rounded-lg transition ${
                editName ? "border-blue-400 focus:ring" : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
            />
            <button
              type="button"
              onClick={() => setEditName(!editName)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <Pencil size={18} />
            </button>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Mobile Number Field */}
        <div>
          <label className="text-sm text-gray-600">Mobile Number</label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={!editMobile}
              className={`w-full p-3 mt-1 border rounded-lg transition ${
                editMobile ? "border-blue-400 focus:ring" : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
            />
            <button
              type="button"
              onClick={() => setEditMobile(!editMobile)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <Pencil size={18} />
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={updating}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {updating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </button>

        {successMessage && (
          <div className="flex items-center justify-center text-green-600 gap-2 text-sm pt-2">
            <CheckCircle size={18} />
            {successMessage}
          </div>
        )}
      </form>

      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 mt-6 rounded-lg hover:bg-red-600 transition"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
