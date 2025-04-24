"use client";

import { motion } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube, // This is the correct import for WhatsApp icon in lucide-react
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const socialPlatforms = [
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: <Instagram size={20} />,
    color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    hoverColor: "hover:shadow-lg hover:shadow-pink-500/30"
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/1234567890?text=Hello%20I%20have%20a%20question",
    icon: <FaWhatsapp size={20} />,
    color: "bg-green-500",
    hoverColor: "hover:shadow-lg hover:shadow-green-500/30"
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: <Facebook size={20} />,
    color: "bg-blue-600",
    hoverColor: "hover:shadow-lg hover:shadow-blue-600/30"
  },
  // {
  //   name: "YouTube",
  //   url: "https://www.youtube.com",
  //   icon: <Youtube size={20} />,
  //   color: "bg-red-600",
  //   hoverColor: "hover:shadow-lg hover:shadow-red-600/30"
  // },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    icon: <Linkedin size={20} />,
    color: "bg-blue-700",
    hoverColor: "hover:shadow-lg hover:shadow-blue-700/30"
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/7418713243?text=Hello%20I%20have%20a%20question",
    icon: <FaWhatsapp size={20} />,
    color: "bg-green-500",
    hoverColor: "hover:shadow-lg hover:shadow-green-500/30"
  }
  
];

export function FooterSocial() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
      
      <p className="text-sm text-gray-300 mb-6 max-w-md">
        Join our community for the latest updates, exclusive content, and special offers.
      </p>
      
      <div className="flex flex-wrap gap-4">
        {socialPlatforms.map((platform, index) => (
          <motion.a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Connect with us on ${platform.name}`}
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ y: -5 }}
          >
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-white
              transition-all duration-300 group-hover:scale-110
              ${platform.color} ${platform.hoverColor}
              shadow-md
            `}>
              {platform.icon}
            </div>
            <motion.span 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                        text-xs font-medium text-white opacity-0 
                        group-hover:opacity-100 whitespace-nowrap
                        px-2 py-1 rounded bg-gray-800"
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