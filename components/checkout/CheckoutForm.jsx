"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const defaultFields = [
  { 
    name: "name", 
    label: "Full Name", 
    type: "text",
    placeholder: "Enter your full name", 
    required: true,
    autoComplete: "name",
    validation: (value) => {
      if (!value.trim()) return "Name is required";
      if (value.length < 3) return "Name must be at least 3 characters";
      return null;
    }
  },
  { 
    name: "phone", 
    label: "Phone Number", 
    type: "tel",
    placeholder: "10-digit mobile number", 
    required: true,
    autoComplete: "tel",
    validation: (value) => {
      if (!value.trim()) return "Phone number is required";
      if (!/^\d{10}$/.test(value)) return "Invalid phone number";
      return null;
    }
  },
  { 
    name: "email", 
    label: "Email Address", 
    type: "email",
    placeholder: "email@example.com", 
    required: true,
    autoComplete: "email",
    validation: (value) => {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
      return null;
    }
  },
  { 
    name: "address", 
    label: "Delivery Address", 
    type: "textarea",
    placeholder: "Enter your complete address", 
    required: true,
    autoComplete: "street-address",
    validation: (value) => {
      if (!value.trim()) return "Address is required";
      if (value.length < 10) return "Address is too short";
      return null;
    }
  },
  { 
    name: "pincode", 
    label: "Pincode", 
    type: "text",
    placeholder: "6-digit pincode", 
    required: true,
    autoComplete: "postal-code",
    validation: (value) => {
      if (!value.trim()) return "Pincode is required";
      if (!/^\d{6}$/.test(value)) return "Invalid pincode";
      return null;
    }
  }
];

export default function CheckoutForm({ 
  initialData = {}, 
  onComplete,
  fields = defaultFields,
  buttonText = "Continue to Payment"
}) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = initialData[field.name] || '';
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    const field = fields.find(f => f.name === name);
    return field?.validation ? field.validation(value) : null;
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) newErrors[field.name] = error;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touchedFields[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);
    
    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900">Shipping Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all`}
                required={field.required}
                disabled={isSubmitting}
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all`}
                required={field.required}
                autoComplete={field.autoComplete}
                disabled={isSubmitting}
              />
            )}
            
            {errors[field.name] && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors[field.name]}
              </motion.p>
            )}
          </div>
        ))}
        
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
            isSubmitting 
              ? "bg-blue-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            buttonText
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}