// components/PatientForm.jsx
import React from 'react';

export default function PatientForm({ patientInfo, setPatientInfo }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={patientInfo.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter patient name"
          />
        </div>
        
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Patient Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={patientInfo.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter patient age"
            min="0"
            max="120"
          />
        </div>
        
        <div>
          <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
            Attending Doctor
          </label>
          <input
            type="text"
            id="doctor"
            name="doctor"
            value={patientInfo.doctor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter doctor's name"
          />
        </div>
      </div>
    </div>
  );
}