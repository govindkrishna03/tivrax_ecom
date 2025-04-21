"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import PropTypes from 'prop-types';

const socialPlatforms = [
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: <Instagram size={18} />,
    color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: <Facebook size={18} />,
    color: "bg-blue-600",
  },
  {
    name: "Twitter",
    url: "https://www.twitter.com",
    icon: <Twitter size={18} />,
    color: "bg-sky-500",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    icon: <Youtube size={18} />,
    color: "bg-red-600",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    icon: <Linkedin size={18} />,
    color: "bg-blue-700",
  },
];

export function FooterSocial() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
      
      <p className="text-sm text-gray-400 mb-4">
        Stay connected with us on social media for the latest updates, behind-the-scenes content, and inspiration.
      </p>
      
      <div className="flex flex-wrap gap-3">
        {socialPlatforms.map((platform, index) => (
          <motion.a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${platform.name}`}
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-white
              transition-transform duration-300 group-hover:scale-110
              ${platform.color}
            `}>
              {platform.icon}
            </div>
            <motion.span 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap"
              initial={{ opacity: 0, y: -5 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {platform.name}
            </motion.span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

FooterSocial.propTypes = {};