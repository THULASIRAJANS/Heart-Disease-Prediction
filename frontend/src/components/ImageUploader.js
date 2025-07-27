// components/ImageUploader.jsx
import React from 'react';

export default function ImageUploader({ handleFileChange, file, handleSubmit, loading }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Retinal Image</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <label htmlFor="image-upload" className="cursor-pointer block">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            Click to select a retinal image
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, JPEG up to 10MB
          </p>
        </label>
        
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name}
          </p>
        )}
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          !file || loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Analyze Image'
        )}
      </button>
    </div>
  );
}