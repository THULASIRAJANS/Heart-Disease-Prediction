// components/DiagnosisResult.jsx
import React from 'react';
import ReportActions from './ReportActions';

export default function DiagnosisResult({ result, patientInfo }) {
  if (!result) {
    return null;
  }

  // Function to determine color based on condition
  const getConditionColor = () => {
    switch(result.prediction) {
      case 'Normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Diabetic Retinopathy': return 'bg-red-100 text-red-800 border-red-200';
      case 'Glaucoma': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cataract': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AMD': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionIcon = () => {
    switch(result.prediction) {
      case 'Normal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Diabetic Retinopathy':
      case 'Glaucoma':
      case 'Cataract':
      case 'AMD':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Get severity level description based on confidence
  const getSeverityDescription = (confidence) => {
    const confidenceNum = parseFloat(confidence);
    if (confidenceNum >= 90) return 'High severity';
    if (confidenceNum >= 75) return 'Moderate severity';
    if (confidenceNum >= 60) return 'Mild severity';
    return 'Very mild severity';
  };

  const getConditionAdvice = (prediction) => {
    switch (prediction.toLowerCase()) {
      case 'healthy':
        return "Great news! No signs of disease were detected. Continue maintaining a healthy lifestyle, balanced diet, and regular health check-ups to stay on track.";
      
      case 'milddisease':
        return "Mild abnormalities were detected. While it’s not urgent, you should consult your doctor to understand the cause and prevent any future complications.";
      
      case 'moderatedisease':
        return "Moderate health indicators have been found. It’s important to consult a healthcare provider soon for a proper diagnosis, management plan, and lifestyle guidance.";
      
      case 'severedisease':
        return "Serious signs of disease have been detected. Please schedule an appointment with a specialist immediately for a thorough examination and timely treatment.";
      
      case 'heartattack':
        return "⚠️ Urgent: Signs consistent with a possible heart attack have been identified. Seek **emergency medical attention** without delay — call your local emergency number or go to the nearest hospital.";
      
      default:
        return "This is an AI-generated result. Please consult a medical professional to interpret the findings and receive appropriate care.";
    }
  };
  
  

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Diagnosis Result</h3>
      
      <div className={`border rounded-lg p-6 ${getConditionColor()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getConditionIcon()}
          </div>
          
          <div className="ml-4 flex-grow">
            <h4 className="text-lg font-bold">
              {result.prediction}
            </h4>
            
            <div className="mt-3 flex items-center">
              <div className="text-sm font-medium">
                Confidence: {result.confidence}
              </div>
              
              <div className="ml-4 w-full max-w-48 bg-white bg-opacity-50 rounded-full h-2">
                <div 
                  className="bg-current h-2 rounded-full" 
                  style={{ width: result.confidence }}
                ></div>
              </div>
            </div>

            {result.prediction !== 'Normal' && (
              <div className="mt-2 text-sm font-medium">
                {getSeverityDescription(result.confidence)}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-current border-opacity-20">
              <p className="text-sm">
                    <strong>Suggestion:</strong> {getConditionAdvice(result.prediction)}
              </p>
           </div>

          </div>
        </div>
      </div>

      {/* Only show report actions if we have a result.id (from a saved record) */}
      {result.id && (
        <ReportActions 
          recordId={result.id} 
          patientName={patientInfo?.name || "Patient"}
        />
      )}
    </div>
  );
}


