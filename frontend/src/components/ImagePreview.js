// components/ImagePreview.jsx
import React from 'react';

export default function ImagePreview({ preview }) {
  if (!preview) {
    return (
      <div className="mb-6 border rounded-lg bg-gray-50 p-6 flex flex-col items-center justify-center min-h-64">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 text-center">
          Image preview will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Retinal Image</h3>
      <div className="border rounded-lg overflow-hidden">
        <img 
          src={preview} 
          alt="Retinal scan preview" 
          className="w-full h-auto object-contain max-h-96"
        />
      </div>
    </div>
  );
}