// App.jsx - Main container component
import { useState } from 'react';
import Header from './components/Header';
import PatientUpload from './components/PatientUpload';
import PatientHistory from './components/PatientHistory';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-6xl mx-auto mt-8 px-4 pb-16">
        {activeTab === 'upload' && <PatientUpload />}
        {activeTab === 'history' && <PatientHistory />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'info' && <About />}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;