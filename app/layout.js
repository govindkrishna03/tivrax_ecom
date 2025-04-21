"use client";

import { useState, useEffect } from "react";
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/footer/Footer';
import Loading from '../components/Loading'; // Make sure you created this
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // fake delay
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
