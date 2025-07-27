// components/PatientHistory.jsx
import React, { useState, useEffect } from 'react';
import { getPatientHistory } from '../services/api';

export default function PatientHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getPatientHistory();
        setHistory(data);
      } catch (err) {
        setError(err.message || 'Failed to load patient history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  // Function to determine color based on condition
  const getConditionColor = (condition) => {
    switch(condition) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Diabetic Retinopathy': return 'bg-red-100 text-red-800';
      case 'Glaucoma': return 'bg-yellow-100 text-yellow-800';
      case 'Cataract': return 'bg-blue-100 text-blue-800';
      case 'AMD': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center min-h-96">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading patient history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-medium">Error loading patient history</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex min-h-screen">
        {/* Left Side - Patient List */}
        <div className="md:w-1/3 border-r border-gray-200 bg-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Patient Records</h2>
          
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No patient records found
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div 
                  key={record.id}
                  onClick={() => handleRecordClick(record)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedRecord && selectedRecord.id === record.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{record.patientName}</h3>
                    <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Age: {record.age}</span>
                      <span className="text-xs text-gray-500">Dr. {record.doctor}</span>
                    </div>
                    <span 
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(record.prediction)}`}
                    >
                      {record.prediction}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Side - Record Details */}
        <div className="md:w-2/3 p-6">
          {selectedRecord ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Patient Details</h2>
                <span className="text-sm text-gray-500">Record #{selectedRecord.id}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Patient Name</h3>
                  <p className="text-lg font-medium text-gray-900">{selectedRecord.patientName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Patient Age</h3>
                  <p className="text-lg font-medium text-gray-900">{selectedRecord.age} years</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Attending Doctor</h3>
                  <p className="text-lg font-medium text-gray-900">{selectedRecord.doctor}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Examination Date</h3>
                  <p className="text-lg font-medium text-gray-900">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Diagnosis</h3>
                <div className={`inline-block px-4 py-2 rounded-lg font-medium ${getConditionColor(selectedRecord.prediction)}`}>
                  {selectedRecord.prediction} (Confidence: {selectedRecord.confidence})
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Retinal Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Original Image</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${selectedRecord.imagePath}`} 
                        alt="Original retinal scan" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Processed Image</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${selectedRecord.imagePath.replace('uploads', 'processed')}`} 
                        alt="Processed retinal scan" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  <strong>Note:</strong> This record was generated by the RetinaCare AI diagnostic system. 
                  Always consult with an ophthalmologist for a comprehensive evaluation.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>Select a patient record from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}