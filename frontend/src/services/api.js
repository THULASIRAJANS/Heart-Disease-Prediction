// src/services/api.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Upload a retinal image for analysis
 * @param {File} file - The image file to upload
 * @param {Object} patientInfo - Patient information
 * @returns {Promise} - Promise with the prediction results
 */
export const uploadImage = async (file, patientInfo) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientName', patientInfo.name);
    formData.append('patientAge', patientInfo.age);
    formData.append('doctor', patientInfo.doctor);

    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process image');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Get patient history records
 * @returns {Promise} - Promise with patient history data
 */
export const getPatientHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/history`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch patient history');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Get a specific patient record by ID
 * @param {number} recordId - The ID of the record to fetch
 * @returns {Promise} - Promise with the record data
 */
export const getPatientRecord = async (recordId) => {
  try {
    const response = await fetch(`${API_URL}/history/${recordId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch patient record');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Get statistics about diagnoses
 * @returns {Promise} - Promise with statistics data
 */
export const getStatistics = async () => {
  try {
    const response = await fetch(`${API_URL}/statistics`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch statistics');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Send diagnosis report via email
 * @param {number} recordId - The ID of the record to send
 * @param {string} email - Email address to send the report to
 * @returns {Promise} - Promise with the email sending status
 */
export const sendReportEmail = async (recordId, email) => {
  try {
    const response = await fetch(`${API_URL}/email-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recordId, email }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Generate printable PDF report
 * @param {number} recordId - The ID of the record to print
 * @returns {Promise} - Promise with the PDF URL
 */
export const generatePrintableReport = async (recordId) => {
  try {
    const response = await fetch(`${API_URL}/generate-pdf/${recordId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

