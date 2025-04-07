import { useEffect, useState, useCallback, Suspense, lazy } from "react";
import Navbar from "../../components/Navbar";
import {
  Calendar,
  FileText,
  UserCircle,
  Upload,
  Heart,
  Pill,
  MessageSquare,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  MapPin // Added MapPin icon instead of missing Map
} from 'lucide-react';
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ErrorBoundary from "../../components/ErrorBoundary";
// Lazy load components that aren't immediately visible
const HealthChart = lazy(() => import("../../components/HealthChart"));
const ChatComponent = lazy(() => import("../../components/ChatComponent"));

// Create axios instance with default config
const api = axios.create({
  timeout: 8000, // 8 second timeout
});

const PatientDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentVisits: [],
    vitalsData: [],
    prescriptions: [],
    nextAppointment: null,
    wellnessTip: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Get the cursor position relative to the window
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Memoize the fetchData function to prevent recreations on re-renders
  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      setLoading(true);
      
      // Batch requests to reduce separate HTTP overhead
      const endpoints = [
        "http://localhost:5000/api/patient/dashboard",
        "http://localhost:5000/api/patient/recent-visits", 
        "http://localhost:5000/api/patient/vitals",
        "http://localhost:5000/api/patient/prescriptions", 
        "http://localhost:5000/api/patient/next-appointment",
        "http://localhost:5000/api/patient/wellness-tip"
      ];

      // Make all requests concurrently with Promise.allSettled
      const results = await Promise.allSettled(
        endpoints.map(endpoint => 
          api.get(endpoint, { headers }).catch(err => {
            console.warn(`Request to ${endpoint} failed:`, err.message);
            return { data: endpoint.includes('visits') ? [] : null };
          })
        )
      );
      
      // Extract data from results with default values for failed requests
      const [
        statsRes = { data: {} }, 
        visitsRes = { data: [] }, 
        vitalsRes = { data: [] }, 
        prescriptionsRes = { data: [] }, 
        nextApptRes = { data: null }, 
        tipRes = { data: "Stay healthy!" }
      ] = results.map(result => result.status === 'fulfilled' ? result.value : { data: null });

      // Process and normalize all data at once to reduce state updates
      setDashboardData({
        stats: statsRes.data || {},
        recentVisits: Array.isArray(visitsRes.data) ? visitsRes.data : (visitsRes.data?.visits || []),
        vitalsData: Array.isArray(vitalsRes.data) ? vitalsRes.data : (vitalsRes.data?.vitals || []),
        prescriptions: Array.isArray(prescriptionsRes.data) ? prescriptionsRes.data : (prescriptionsRes.data?.prescriptions || []),
        nextAppointment: nextApptRes.data || null,
        wellnessTip: typeof tipRes.data === 'object' && tipRes.data?.tip 
          ? tipRes.data.tip 
          : (typeof tipRes.data === 'string' ? tipRes.data : "Stay healthy!")
      });
      
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error.message);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError("Please log in to view your dashboard");
    }
    
    // Clean up any pending requests
    return () => {
      // Cancel any pending requests when component unmounts
      api.interceptors.request.use(config => {
        config.signal = new AbortController().signal;
        return config;
      });
    };
  }, [fetchDashboardData]);

  const handleReportUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("report", file);

    try {
      await api.post("/api/patient/upload-report", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Report uploaded successfully!");
      fetchDashboardData(); // Refresh data without full page reload
    } catch (error) {
      console.error("❌ Error uploading report:", error.message);
      alert("Failed to upload report.");
    }
  };

  const { stats, recentVisits, vitalsData, prescriptions, nextAppointment, wellnessTip } = dashboardData;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-slate-50 min-h-screen">
          <div className="relative">
            {/* Dynamic background patterns */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 50% 50%, rgba(0, 163, 173, 0.2) 0%, transparent 70%),
                    radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 123, 255, 0.3) 0%, transparent 60%),
                    radial-gradient(circle at 90% 90%, rgba(73, 197, 182, 0.15) 0%, transparent 50%)
                  `,
                  transition: 'background-position 0.2s ease-out'
                }}
              />
              <div className="absolute inset-0 backdrop-blur-sm" />
            </div>
            <div className="container mx-auto px-4 py-16 relative z-10">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
              </div>
              <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                Loading your health data...
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="bg-slate-50 min-h-screen">
          <div className="relative">
            {/* Dynamic background patterns */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 50% 50%, rgba(0, 163, 173, 0.2) 0%, transparent 70%),
                    radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 123, 255, 0.3) 0%, transparent 60%),
                    radial-gradient(circle at 90% 90%, rgba(73, 197, 182, 0.15) 0%, transparent 50%)
                  `,
                  transition: 'background-position 0.2s ease-out'
                }}
              />
              <div className="absolute inset-0 backdrop-blur-sm" />
            </div>
            <div className="container mx-auto px-4 py-16 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                Patient Dashboard
              </h2>
              <div className="bg-white border-l-4 border-red-500 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                <p className="text-slate-700 mb-4">{error}</p>
                <button 
                  className="group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden"
                  onClick={fetchDashboardData}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 transition-transform group-hover:scale-105" />
                  <div className="relative flex items-center justify-center gap-2 text-white">
                    <span>Try Again</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-slate-50 min-h-screen">
        <div className="relative">
          {/* Dynamic background patterns */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 50%, rgba(0, 163, 173, 0.2) 0%, transparent 70%),
                  radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 123, 255, 0.3) 0%, transparent 60%),
                  radial-gradient(circle at 90% 90%, rgba(73, 197, 182, 0.15) 0%, transparent 50%)
                `,
                transition: 'background-position 0.2s ease-out'
              }}
            />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[20%] w-64 h-64 rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 animate-float blur-xl" />
            <div className="absolute bottom-40 right-[15%] w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 animate-float-delayed blur-xl" />
          </div>
          
          {/* Content Container */}
          <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                Patient Dashboard
              </h2>
              
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dashboard Cards */}
                  <div className="group bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Upcoming Appointments</h3>
                    <p className="text-3xl font-bold text-cyan-600">{stats.upcomingAppointments || 0}</p>
                  </div>
                  
                  <div className="group bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Reports Uploaded</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.medicalReports || 0}</p>
                  </div>
                  
                  <div className="group bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <UserCircle className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Doctors Visited</h3>
                    <p className="text-3xl font-bold text-cyan-600">{stats.doctorsVisited || 0}</p>
                  </div>
                  
                  <div className="group bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Upload New Report</h3>
                    <div className="mt-4">
                      <label className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Choose File</span>
                        <input type="file" onChange={handleReportUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="group bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300 col-span-1 md:col-span-2 lg:col-span-1">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-4">Health Vitals</h3>
                    <ErrorBoundary>
                      <Suspense fallback={
                        <div className="flex justify-center items-center h-32">
                          <div className="animate-pulse w-full h-full bg-slate-200 rounded-lg"></div>
                        </div>
                      }>
                        <HealthChart data={vitalsData || []} />
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                  
                  <div className="group bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Pill className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Active Prescriptions</h3>
                    <p className="text-3xl font-bold text-cyan-600">{prescriptions.length}</p>
                  </div>
                  
                  <div className="group bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300 col-span-1 md:col-span-2 lg:col-span-1">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-4">Chat with Doctor</h3>
                    <Suspense fallback={
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-pulse w-full h-full bg-slate-200 rounded-lg"></div>
                      </div>
                    }>
                      <ChatComponent />
                    </Suspense>
                  </div>
                  
                  {nextAppointment && (
                    <div className="group bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-4">Next Appointment</h3>
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-teal-700 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>{nextAppointment.date} | {nextAppointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-teal-700 mb-2">
                          <UserCircle className="w-4 h-4" />
                          <span>Dr. {nextAppointment.doctorName || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-teal-700">
                          <MapPin className="w-4 h-4" />
                          <span>{nextAppointment.location || "Not specified"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="group bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-4">Wellness Tip</h3>
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg">
                      <p className="italic text-teal-700">{wellnessTip}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Recent Visits Section */}
              <div className="mt-12 md:mt-16">
                <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                  Recent Visits
                </h3>
                
                {recentVisits.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                          <tr>
                            <th className="py-4 px-6 font-semibold">Doctor</th>
                            <th className="py-4 px-6 font-semibold">Date</th>
                            <th className="py-4 px-6 font-semibold">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentVisits.map((visit) => (
                            <tr key={visit._id || visit.id || Math.random().toString()} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4 px-6 font-medium">{visit.doctorName || "Doctor"}</td>
                              <td className="py-4 px-6 text-slate-600">{new Date(visit.date).toLocaleDateString()}</td>
                              <td className="py-4 px-6 text-slate-700">{visit.reason || "Check-up"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <p className="text-slate-600">No recent visits to display.</p>
                  </div>
                )}
              </div>
              
              {/* Active Prescriptions Section */}
              <div className="mt-12 md:mt-16">
                <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                  Active Prescriptions
                </h3>
                
                {prescriptions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prescriptions.map((prescription) => (
                      <div key={prescription._id || prescription.id || Math.random().toString()} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <Pill className="w-5 h-5 text-teal-600" />
                          </div>
                          <h4 className="font-semibold text-lg">
                            Dr. {prescription.doctor ? (
                              typeof prescription.doctor === 'object' ? prescription.doctor.name : prescription.doctor
                            ) : "Unknown"}
                          </h4>
                        </div>
                        
                        <div className="pl-4 border-l-2 border-teal-500">
                          {prescription.medicines && Array.isArray(prescription.medicines) ? (
                            prescription.medicines.map((med, idx) => (
                              <div key={idx} className="mb-2 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">{med.name}</span>
                                  <p className="text-sm text-slate-600">{med.dosage} ({med.frequency})</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="mb-2 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" />
                              <div>
                                <span className="font-medium">{prescription.medicineName || "Prescribed medicine"}</span>
                                <p className="text-sm text-slate-600">{prescription.dosage || "As directed"}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {prescription.notes && (
                          <div className="mt-4 bg-slate-50 p-3 rounded-lg">
                            <p className="text-sm text-slate-600 italic">
                              <span className="font-medium">Notes:</span> {prescription.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <p className="text-slate-600">No active prescriptions.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;