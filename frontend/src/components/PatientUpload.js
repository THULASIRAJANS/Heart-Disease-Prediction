// components/PatientUpload.jsx
import { useState } from 'react';
import PatientForm from './PatientForm';
import ImageUploader from './ImageUploader';
import ImagePreview from './ImagePreview';
import DiagnosisResult from './DiagnosisResult';
import { uploadImage } from '../services/api';

export default function PatientUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age:"",
    doctor: ""
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      // Clear previous results when new file is selected
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the API service to upload the image
      const data = await uploadImage(file, patientInfo);
      setResult(data);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Left panel - Patient info & upload */}
        <div className="md:w-1/2 p-6 border-r border-gray-200">
          <PatientForm patientInfo={patientInfo} setPatientInfo={setPatientInfo} />
          <ImageUploader 
            handleFileChange={handleFileChange} 
            file={file} 
            handleSubmit={handleSubmit} 
            loading={loading} 
          />
          
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>
        
        {/* Right panel - Image preview & results */}
        <div className="md:w-1/2 p-6">
          <ImagePreview preview={preview} />
          <DiagnosisResult result={result} patientInfo={patientInfo} />
        </div>
      </div>
    </div>
  );
}