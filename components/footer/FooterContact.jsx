import { Mail, MapPin, Phone } from "lucide-react";
import PropTypes from 'prop-types';

export function FooterContact() {
  return (
    <div className="space-y-6 ">
      <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="bg-gray-800 p-2 rounded-full">
            <MapPin size={16} className="text-gray-300" />
          </div>
          <div>
            <p className="text-sm text-gray-300">
              123 Fashion Street, Design District
              <br />New York, NY 10001
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-gray-800 p-2 rounded-full">
            <Mail size={16} className="text-gray-300" />
          </div>
          <a 
            href="mailto:support@tivrax.com" 
            className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
          >
            support@tivrax.com
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-gray-800 p-2 rounded-full">
            <Phone size={16} className="text-gray-300" />
          </div>
          <a 
            href="tel:+917418713243" 
            className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
          >
            +91 741 871 3243
          </a>
        </div>
      </div>

    </div>
  );
}

FooterContact.propTypes = {};