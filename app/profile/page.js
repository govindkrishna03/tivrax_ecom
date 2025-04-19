// pages/profile.js
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // Update this path as per your project structure
import { useRouter } from "next/navigation";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(true);
    const [isNameLocked, setIsNameLocked] = useState(false);
    const [isMobileLocked, setIsMobileLocked] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const router = useRouter();




    useEffect(() => {
        const fetchUserData = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error.message);
                router.push("/auth/signin");
            } else if (data) {
                setEmail(data.user.email);
                setName(data.user.user_metadata?.full_name || "");
                setMobile(data.user.user_metadata?.mobile || "");
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    // Handle updating the profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: name,
                    mobile: mobile, // Updating the mobile number
                },
            });

            if (error) {
                alert("Error updating profile: " + error.message);
            } else {
                alert("Profile updated successfully!");
                setIsNameLocked(true);  // Lock the name input after updating
                setIsMobileLocked(true); // Lock the mobile number input after updating
                setIsUpdated(true); // Mark as updated
            }
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error.message);
            alert("Error signing out: " + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>

            <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isNameLocked} // Lock name field after update
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Enter your name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                        placeholder="Email address"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Number</label>
                    <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        disabled={isMobileLocked} // Lock mobile field after update
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Enter your mobile number"
                    />
                </div>
                {isUpdated ? (
                    <div className="w-full h-[52px] mt-2"></div> // Approx height of button to keep spacing
                ) : (
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                )}

            </form>


            <button
                onClick={handleSignOut}
                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 mt-4"
            >
                Sign Out
            </button>

        </div>
    );
}
