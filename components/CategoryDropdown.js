'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const categories = {
  Shirts: ["Oversized", "Chinese Collar", "Formal", "Casual"],
  Tshirts: ["Oversized", "Printed", "Plain", "Graphic"],
  Hoodies: ["Zipper", "Pullover", "Oversized"],
  Jeans: ["Slim Fit", "Regular Fit", "Distressed"],
};

export default function CategoryDropdown() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (category) => {
    setIsDropdownVisible(isDropdownVisible === category ? null : category);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownVisible(null);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownVisible(null); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside); 
    document.addEventListener('keydown', handleEscapeKey); 

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div className="flex py-4 bg-white shadow-md sm:justify-evenly items-center justify-center">
      <div className="flex sm:gap-[100px] lg:gap-[300px] md:gap-[200px] sm:px-10 gap-[50px] " ref={dropdownRef}>
        {Object.entries(categories).map(([mainCategory, subcategories]) => (
          <div key={mainCategory} className="relative group">
            <button
              onClick={() => toggleDropdown(mainCategory)}
              className="flex items-center  text-sm font-medium sm:text-md sm:font-medium text-gray-800 transition duration-300"
            >
              {mainCategory}
              <ChevronDown
  size={16}
  className={`hidden sm:inline transition-transform duration-300 ${
    isDropdownVisible === mainCategory ? 'rotate-180' : ''
  }`}
/>

            </button>

            {/* Dropdown */}
            <div
              className={`absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] transition-opacity duration-300 ease-in-out ${
                isDropdownVisible === mainCategory ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              {subcategories.map((sub, idx) => (
                <a
                  key={idx}
                  href={`/${mainCategory.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-black hover:text-white transition duration-200"
                >
                  {sub}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
