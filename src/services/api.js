import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 60000, // 60 seconds timeout for larger file uploads
  headers: {
    'Content-Type': 'application/json',
  }
});

// Submit a quote request with file upload
export const submitQuoteRequest = async (formData) => {
  const form = new FormData();
  
  // Add all form fields to FormData
  for (const key in formData) {
    if (key === 'file') {
      if (formData.file) {
        form.append('file', formData.file);
      }
    } else {
      form.append(key, formData[key]);
    }
  }
  
  try {
    const response = await api.post('/submit-quote-request', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error submitting quote request:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while submitting your request.',
    };
  }
};

// Submit a contact form message
export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/contact', formData);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while submitting your message.',
    };
  }
};

// Get available materials
export const getMaterials = async () => {
  try {
    const response = await api.get('/materials');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching materials:', error);
    
    // Fallback data if API is not available
    return {
      success: false,
      data: [
        { id: 'pla', name: 'PLA', description: 'Standard PLA filament, biodegradable and easy to print.' },
        { id: 'abs', name: 'ABS', description: 'Durable ABS plastic, good for functional parts.' },
        { id: 'petg', name: 'PETG', description: 'Combines strength and flexibility, food-safe.' },
        { id: 'tpu', name: 'TPU Flexible', description: 'Flexible material, rubber-like properties.' },
        { id: 'nylon', name: 'Nylon', description: 'Strong, durable and versatile engineering material.' },
        { id: 'resin', name: 'Resin (SLA)', description: 'High detail resin prints, smooth finish.' },
      ],
      error: 'Using fallback material data',
    };
  }
};

// Get print settings (colors, finishes, etc.)
export const getPrintSettings = async () => {
  try {
    const response = await api.get('/print-settings');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching print settings:', error);
    
    // Fallback data if API is not available
    return {
      success: false,
      data: {
        colors: [
          { id: 'black', name: 'Black' },
          { id: 'white', name: 'White' },
          { id: 'grey', name: 'Grey' },
          { id: 'red', name: 'Red' },
          { id: 'blue', name: 'Blue' },
          { id: 'green', name: 'Green' },
          { id: 'yellow', name: 'Yellow' },
          { id: 'orange', name: 'Orange' },
          { id: 'purple', name: 'Purple' },
          { id: 'natural', name: 'Natural/Transparent' },
        ],
        finishes: [
          { id: 'standard', name: 'Standard (As Printed)' },
          { id: 'sanded', name: 'Sanded' },
          { id: 'polished', name: 'Polished' },
          { id: 'painted', name: 'Painted' },
        ],
        infill: [
          { id: '20', name: '20% - Light (Non-Functional)' },
          { id: '50', name: '50% - Standard' },
          { id: '80', name: '80% - Strong' },
          { id: '100', name: '100% - Solid' },
        ],
        quality: [
          { id: 'draft', name: 'Draft (0.3mm layer height)' },
          { id: 'standard', name: 'Standard (0.2mm layer height)' },
          { id: 'high', name: 'High (0.1mm layer height)' },
          { id: 'ultra', name: 'Ultra (0.05mm layer height)' },
        ],
      },
      error: 'Using fallback settings data',
    };
  }
};

export default api; 