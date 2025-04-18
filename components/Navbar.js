"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex sm:justify-between justify-start items-center sm:px-10 bg-white sticky top-0 z-50">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Tivrax Logo"
          width={240}
          height={240}
          className="object-contain"
          priority
        />
      </Link>
      <div className="flex flex-row gap-15 sm:gap-20 px-10 sm:px-20">
      <Link href="/search">
        <Image
          src="/icons/search.png"
          alt="shopping_cart"
          width={30}
          height={30}
          className="object-contain hover:scale-110 transition-transform duration-200"
        />
      </Link>
      {/* Shopping Cart */}
      <Link href="/shoppingcart">
        <Image
          src="/icons/cart.png"
          alt="shopping_cart"
          width={30}
          height={30}
          className="object-contain hover:scale-110 transition-transform duration-200"
        />
      </Link>
      </div>
    </nav>
  );
}
