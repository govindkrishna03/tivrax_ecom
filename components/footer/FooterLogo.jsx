"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export function FooterLogo() {
  return (
    <motion.div
      className="flex flex-col items-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* <Link href="/" className="group relative">
        <div className="relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out group-hover:shadow-2xl">
          <Image
            src="/transparent.png"
            alt="Tivrax Logo"
            width={250}
            height={220}
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            priority
          />
        </div>
      </Link> */}

      <motion.h2
        className="text-3xl font-extrabold mt-5 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Tivrax
      </motion.h2>

      <motion.p
        className="text-sm text-gray-400 mt-3 max-w-sm leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        Premium quality clothing crafted with exceptional materials, innovative designs, 
        and meticulous attention to detail for the modern individual.
      </motion.p>
    </motion.div>
  );
}

FooterLogo.propTypes = {};
