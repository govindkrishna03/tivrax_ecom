"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, LogOut, Pencil } from "lucide-react";
import Loading from "../../components/Loading"; // Adjust path as needed

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editMobile, setEditMobile] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
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

    if (hasUpdated) return; // Prevent further updates

    setUpdating(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name.trim(),
        mobile: mobile.trim(),
      },
    });

    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      setSuccessMessage("Profile updated successfully!");
      setEditName(false);
      setEditMobile(false);
      setHasUpdated(true); // Mark as updated
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

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">My Account</h2>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editName}
                  className={`w-full px-4 py-3 border rounded-xl transition-all ${editName
                      ? "border-blue-500 focus:ring-2 focus:ring-blue-400"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
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
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Mobile</label>
              <div className="relative">
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={!editMobile}
                  className={`w-full px-4 py-3 border rounded-xl transition-all ${editMobile
                      ? "border-blue-500 focus:ring-2 focus:ring-blue-400"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
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

            {/* Update Button */}
            <button
              type="submit"
              disabled={updating || hasUpdated}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition ${updating || hasUpdated
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {updating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Updating...
                </>
              ) : hasUpdated ? (
                "You have already updated"
              ) : (
                "Update Profile"
              )}
            </button>


            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center justify-center text-green-600 gap-2 text-sm pt-2">
                <CheckCircle size={18} />
                {successMessage}
              </div>
            )}
          </form>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 mt-6 rounded-xl hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </main>

      {/* Sticky footer */}
      <footer className="text-center text-gray-400 py-4 text-sm">
        © {new Date().getFullYear()} YourBrand. All rights reserved.
      </footer>
    </div>
  );
}
