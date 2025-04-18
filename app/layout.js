import './globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body oncontextmenu="return false;"><Navbar />{children}</body>
      </html>
    )
  }