import './globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }) {
    return (
      <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <Navbar />
        {children}
      </body>
    </html>
    );
  }