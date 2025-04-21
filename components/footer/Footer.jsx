"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FooterLogo } from "./FooterLogo";
import { FooterContact } from "./FooterContact";
import { FooterSocial } from "./FooterSocial";
import { FooterBottom } from "./FooterBottom";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Background gradient layer */}
      <div className="absolute inset-0 opacity-10" />

      {/* Content wrapper */}
      <motion.div
        className="relative z-10 w-full px-6 sm:px-10 py-20 flex flex-col justify-between min-h-[500px]"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Main grid - evenly spaced sections */}
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 justify-between w-full">
          <motion.div variants={itemVariants}>
            <FooterLogo />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterContact />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterSocial />
          </motion.div>
        </div>

     
        <motion.div
         
          variants={itemVariants}
        >
          <FooterBottom />
        </motion.div>
      </motion.div>


    </footer>
  );
}

Footer.propTypes = {};
