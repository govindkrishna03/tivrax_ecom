"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../lib/supabase"; 
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    const getSessionAndListen = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      if (session?.user) {
        setUser(session.user);
      }
  
      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      });
  
      // Cleanup function
      return () => {
        subscription?.unsubscribe();
      };
    };
  
    const unsubscribe = getSessionAndListen();
  
    return () => {
      // Ensure cleanup if getSessionAndListen resolves later
      unsubscribe?.then((fn) => fn?.());
    };
  }, []);
  
  
  const handleProfileClick = () => {
    if (user) {
      router.push("/profile");
    } else {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 3000);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex sm:justify-between items-center sm:px-10 bg-white sticky top-0 z-50 py-2">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Tivrax Logo"
          width={180}
          height={180}
          className="object-contain"
          priority
        />
      </Link>

      <div className="relative flex flex-row gap-8 sm:gap-20 px-10 sm:px-20 items-center">
        <Link href="/search">
          <Image src="/icons/search.png" alt="Search" width={30} height={30} className="object-contain hover:scale-110 transition-transform duration-200" />
        </Link>

        <Link href="/shopping_cart">
          <Image src="/icons/cart.png" alt="Cart" width={30} height={30} className="object-contain hover:scale-110 transition-transform duration-200" />
        </Link>

        <Link href="/wishlist">
          <Image src="/icons/wishlist.png" alt="Wishlist" width={30} height={30} className="object-contain hover:scale-110 transition-transform duration-200" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative flex items-center" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="focus:outline-none">
            <Image src="/icons/user.png" alt="Profile" width={30} height={30} className="object-contain hover:scale-110 transition-transform duration-200" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-30 w-36 bg-white shadow-lg rounded-md text-sm z-50">
              {user ? (
                <>
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold"
                  >
                    Profile
                  </button>

                  <Link
                    href="/orders"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                      setShowDropdown(false);
                      router.push("/");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block px-4 py-2 hover:bg-gray-100 font-semibold"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showLoginMessage && (
        <div className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          Please login to view your profile
        </div>
      )}
    </nav>
  );
}
