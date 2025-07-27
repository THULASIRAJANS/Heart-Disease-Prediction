// components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { getStatistics, getPatientHistory } from '../services/api';

export default function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch statistics and recent scans in parallel
        const [statsData, historyData] = await Promise.all([
          getStatistics(),
          getPatientHistory()
        ]);
        
        setStatistics(statsData);
        
        // Get only the 5 most recent scans
        const sortedHistory = [...historyData].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        ).slice(0, 5);
        
        setRecentScans(sortedHistory);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format for the donut chart colors
  const getConditionColor = (condition) => {
    switch(condition) {
      case 'Normal': return '#10B981'; // green-500
      case 'Diabetic Retinopathy': return '#EF4444'; // red-500
      case 'Glaucoma': return '#F59E0B'; // amber-500
      case 'Cataract': return '#3B82F6'; // blue-500
      case 'AMD': return '#8B5CF6'; // purple-500
      default: return '#6B7280'; // gray-500
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
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-medium">Error loading dashboard</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">System Dashboard</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium opacity-80">Total Scans</h3>
              <p className="text-3xl font-bold mt-1">{statistics?.totalScans || 0}</p>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium opacity-80">Average Confidence</h3>
              <p className="text-3xl font-bold mt-1">{statistics?.averageConfidence?.toFixed(2) || 0}%</p>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium opacity-80">Conditions Detected</h3>
              <p className="text-3xl font-bold mt-1">{Object.keys(statistics?.conditionDistribution || {}).length}</p>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Distribution and Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Condition Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Condition Distribution</h3>
          
          {Object.keys(statistics?.conditionDistribution || {}).length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No condition data available
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(statistics?.conditionDistribution || {}).map(([condition, percentage]) => (
                <div key={condition}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{condition}</span>
                    <span className="text-sm font-medium text-gray-700">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getConditionColor(condition)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Scans */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Scans</h3>
          
          {recentScans.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No recent scans available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{scan.patientName}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(scan.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span 
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          style={{
                            backgroundColor: `${getConditionColor(scan.prediction)}20`,
                            color: getConditionColor(scan.prediction)
                          }}
                        >
                          {scan.prediction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}