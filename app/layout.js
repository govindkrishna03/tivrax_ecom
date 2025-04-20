import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { Toaster } from 'react-hot-toast';

<Toaster position="top-center" reverseOrder={false} />

export default function RootLayout({ children }) {
    return (
      <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
    );
  }