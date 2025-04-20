import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-10 px-6 sm:px-10 mt-12">
      <div className="w-full  mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 items-start px-4 md:px-10">
        
        {/* Logo & Description */}
        <div className="flex flex-col items-start col-span-1">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Tivrax Logo"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </Link>
          <h2 className="text-xl font-bold mt-2 text-center">Tivrax</h2>
          <p className=" text-sm text-gray-400 mt-1">
            Premium quality clothing made with style and comfort in mind.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="#" className="hover:text-white">Shop</Link></li>
            <li><Link href="#" className="hover:text-white">About</Link></li>
            <li><Link href="#" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-300 mb-1">
            Email: support@tivrax.com
          </p>
          <p className="text-sm text-gray-300">
            Phone: +91-7418713243
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex items-center gap-4 mt-4">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              {/* Instagram Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.88a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76z" />
              </svg>
            </a>

            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              {/* Facebook Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24">
                <path d="M22 12.07C22 6.55 17.52 2 12 2S2 6.55 2 12.07c0 5.02 3.66 9.19 8.44 9.93v-7.03H7.9v-2.9h2.54V9.64c0-2.5 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34v7.03C18.34 21.26 22 17.09 22 12.07z" />
              </svg>
            </a>

            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              {/* Twitter Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.3 4.3 0 0 0 1.89-2.37 8.59 8.59 0 0 1-2.73 1.04 4.28 4.28 0 0 0-7.3 3.9 12.13 12.13 0 0 1-8.8-4.46 4.27 4.27 0 0 0 1.32 5.7 4.24 4.24 0 0 1-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.2 4.3 4.3 0 0 1-1.93.07 4.29 4.29 0 0 0 4 2.97A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.57 1.93c7.88 0 12.2-6.53 12.2-12.2 0-.18-.01-.36-.02-.54A8.6 8.6 0 0 0 24 5.5a8.57 8.57 0 0 1-2.54.7z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <hr className="border-gray-700 my-6" />

      <div className="text-center text-sm text-white">
        © {new Date().getFullYear()} Tivrax. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
