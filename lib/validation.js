export function validateField(fieldName, value) {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';
        
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[0-9]{10}$/.test(value.trim())) return 'Phone number must be 10 digits';
        return '';
        
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
        return '';
        
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Please enter a complete address';
        return '';
        
      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        if (!/^[0-9]{6}$/.test(value.trim())) return 'Pincode must be 6 digits';
        return '';
        
      default:
        return '';
    }
  }
  
  export function validateForm(data) {
    const errors = {};
    
    Object.keys(data).forEach((key) => {
      const errorMessage = validateField(key, data[key]);
      if (errorMessage) {
        errors[key] = errorMessage;
      }
    });
    
    return errors;
  }