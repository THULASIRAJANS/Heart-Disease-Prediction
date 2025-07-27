// components/About.jsx
import React from 'react';

export default function About() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">About RetinaCare</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Our Mission</h3>
          <p className="text-gray-600">
            RetinaCare is an advanced AI-powered diagnostic system designed to assist healthcare professionals in the early detection and classification of retinal disorders. Our mission is to make high-quality retinal screening accessible worldwide, helping to prevent vision loss and blindness through early intervention.
          </p>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">The Technology</h3>
          <p className="text-gray-600 mb-4">
            Our system uses a state-of-the-art convolutional neural network (CNN) trained on thousands of classified retinal images. The AI model can identify the following conditions with high accuracy:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Diabetic Retinopathy</h4>
              <p className="text-sm text-blue-700">
                A diabetes complication that affects the eyes by damaging blood vessels in the retina, potentially leading to vision impairment.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h4 className="font-medium text-yellow-800 mb-2">Glaucoma</h4>
              <p className="text-sm text-yellow-700">
                A group of eye conditions that damage the optic nerve, often caused by abnormally high pressure in the eye.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Cataract</h4>
              <p className="text-sm text-blue-700">
                Clouding of the normally clear lens of the eye, leading to blurry vision and eventually vision loss if untreated.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-medium text-purple-800 mb-2">Age-related Macular Degeneration (AMD)</h4>
              <p className="text-sm text-purple-700">
                A common condition that affects the macula, causing a loss in the center of the field of vision.
              </p>
            </div>
          </div> {/* Closing div for grid */}
        </section> {/* Closing second section */}
      </div> {/* Closing space-y-6 */}
    </div> // Closing main container div
  );
}
