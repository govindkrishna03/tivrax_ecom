'use client';
import { useState, useEffect, useRef } from 'react';
import { getProductData } from "../lib/getProductData";

export default function CategoryDropdown() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(null);
  const [categories, setCategories] = useState({});
  const dropdownRef = useRef(null);

  const toggleDropdown = (category) => {
    setIsDropdownVisible(isDropdownVisible === category ? null : category);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const products = await getProductData();

        // Group by main category and subcategories (assuming `style` as subcategory)
        const grouped = {};
        products.forEach(({ category, style }) => {
          if (!grouped[category]) {
            grouped[category] = new Set();
          }
          grouped[category].add(style);
        });

        // Convert Sets to arrays
        const finalCategories = {};
        Object.entries(grouped).forEach(([main, subs]) => {
          finalCategories[main] = Array.from(subs);
        });

        setCategories(finalCategories);
      } catch (err) {
        console.error('Error fetching product categories:', err);
      }
    };

    fetchCategories();
  }, []);

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
      <div
        className="flex sm:gap-[100px] lg:gap-[300px] md:gap-[200px] sm:px-10 gap-[50px]"
        ref={dropdownRef}
      >
        {Object.entries(categories).map(([mainCategory, subcategories]) => (
          <div key={mainCategory} className="relative group">
            <button
              onClick={() => toggleDropdown(mainCategory)}
              className="text-sm font-medium sm:text-md text-gray-800 transition duration-300"
            >
              {mainCategory}
            </button>

            <div
              className={`absolute left-0 mt-2 origin-top bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] transform transition-all duration-300 ease-in-out
                ${isDropdownVisible === mainCategory
                  ? 'scale-100 opacity-100 visible'
                  : 'scale-95 opacity-0 invisible'}
              `}
            >
              {subcategories.map((sub, idx) => (
                <a
                  key={idx}
                  href={`/${mainCategory.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-4 py-2 text-gray-700 transition duration-200 hover:underline hover:underline-offset-4 hover:text-[#5a678b]"
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
