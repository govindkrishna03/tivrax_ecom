import PropTypes from 'prop-types';

export function FooterBottom() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="border-t border-gray-800 pt-8 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          © {currentYear} Tivrax. All rights reserved.
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
          <a href="#" className="hover:text-white transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors duration-300">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors duration-300">
            Cookie Policy
          </a>
          <a href="#" className="hover:text-white transition-colors duration-300">
            Accessibility
          </a>
          <a href="#" className="hover:text-white transition-colors duration-300">
            Sitemap
          </a>
        </div>
      </div>
    </div>
  );
}

FooterBottom.propTypes = {};