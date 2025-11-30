import { useState, useEffect} from 'react'
import axios from 'axios';
import './App.css'; // Keep the default index.css for basic styling

function App() {
  const [backendMessage, setBackendMessage] = useState('Connecting to Backend...');
  const [statusColor, setStatusColor] = useState('text-yellow-500');

  // The base URL is read from the environment variable we set up
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // 1. Define an async function to fetch data from the backend
    const fetchBackendStatus = async () => {
      try {
        // 2. Make the request to your backend's test route
        const response = await axios.get(API_URL);
        
        // 3. Update state on success
        setBackendMessage(response.data.message);
        setStatusColor('text-green-600'); 

      } catch (error) {
        // 4. Update state on failure (e.g., backend server is down)
        console.error("Error fetching backend status:", error);
        setBackendMessage('❌ BACKEND CONNECTION FAILED! Is the server running on port 5000?');
        setStatusColor('text-red-600'); 
      }
    };

    fetchBackendStatus();
  }, [API_URL]); // Rerun effect if API_URL changes (though it won't here)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="text-4xl font-bold mb-4">
        🌤️ Weather App
      </header>
      <div className={`p-4 rounded-lg shadow-lg ${statusColor} bg-white font-mono`}>
        {backendMessage}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Status: Frontend running on port 5173 (default)
      </p>
    </div>
  );
}

export default App;
