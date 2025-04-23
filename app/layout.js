"use client";

import { useState, useEffect } from "react";
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/footer/Footer';
import Loading from '../components/Loading';
import { Toaster } from 'react-hot-toast';
// import { WishlistProvider } from '../app/context/wishlistcontext'; // 🧠 Add this import

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <Toaster position="top-center" reverseOrder={false} />
        {loading ? (
          <Loading />
        ) : (
          <>
            <Navbar />
            {children}
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
