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
            Cheyyur to Pavunjur road, North Cheyyur, Cheyyur Tk, 
              <br />Chengalpattu district -603302,TN
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
            +91 7418713243,+91 7418396243
          </a>
        </div>
 
      </div>
      {/* <div className="pt-4">
        <div className="relative h-40 w-full overflow-hidden rounded-lg">
          <iframe 
           src="https://maps.google.com/maps?q=12.35651683807373,80.00938415527344&z=17&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Tivrax Store Location"
            className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />
        </div>
      </div> */}
    </div>
  );
}

FooterContact.propTypes = {};