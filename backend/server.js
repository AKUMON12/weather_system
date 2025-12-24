// Load environment variables from .env file
require('dotenv').config();

// 1. Core Imports
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Use the 'promise' wrapper for async/await support

// 7. Axios for making HTTP requests to external APIs and Integrating Weather API and Caching Logic
const axios = require('axios');

// 2. Server Initialization
const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// 3. Middleware Configuration
// CORS: Allows requests from different origins (e.g., frontend running on port 3000)
app.use(cors()); 
// JSON Body Parser: Allows Express to read JSON data sent in request bodies
app.use(express.json());

// 4. Database Connection Pool Setup
/**
 * Definition: A Connection Pool is a cache of database connections 
 * that can be reused. This improves performance and prevents 
 * resource exhaustion compared to opening and closing a connection for every request.
 */
let dbPool;
try {
    // Create a pool using the environment variables
    dbPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('✅ MySQL Connection Pool created successfully.');

} catch (error) {
    console.error('❌ Failed to create MySQL Connection Pool:', error.message);
    // Exit if the database connection fails critically
    process.exit(1); 
}

// 5. Test Route (Verification of Server and Database Status)
// The root endpoint to check if the server is running and database is connected.
app.get('/', async (req, res) => {
    try {
        // Test the database connection by running a simple query
        const [rows] = await dbPool.query('SELECT 1 + 1 AS solution');
        
        res.status(200).json({
            message: '🚀 Weather System Backend is running!',
            databaseStatus: `Connected. Test query result: ${rows[0].solution}`,
            apiAccess: 'Pending integration'
        });
    } catch (error) {
        // If the query fails, it means the database is inaccessible
        res.status(500).json({
            message: 'Server running, but DATABASE CONNECTION FAILED!',
            error: error.message
        });
    }
});

// 8. --- Weather Search Route with Caching ---
app.get('/api/weather/:city', async (req, res) => {
    const city = req.params.city.toLowerCase(); // Standardize city name to lowercase
    const apiKey = process.env.WEATHER_API_KEY; // Your weather API key from .env
    const baseUrl = process.env.WEATHER_API_BASE_URL; // Base URL for the weather API

    try {
        // I. CHECK CACHE: Check if we have fresh data in MySQL
        const [cached] = await dbPool.query(
            'SELECT * FROM cached_weather WHERE location_key = ? AND expires_at > NOW()',
            [city]
        );

        if (cached.length > 0) {
            console.log(`📦 Cache Hit for: ${city}`);
            // Data in MySQL is stored as JSON string; mysql2 automatically parses it if using JSON column
            return res.json({ source: 'database', data: cached[0].weather_data });
        }

        // II. CACHE MISS: Fetch from External API
        console.log(`☁️ Cache Miss. Fetching from API for: ${city}`);
        const response = await axios.get(`${baseUrl}/forecast`, {
            params: {
                q: city,
                appid: apiKey,
                units: 'metric' // We'll handle unit switching in the frontend later
            }
        });

        // OpenWeatherMap's /forecast returns an object where the list of data is in response.data.list
        const weatherData = response.data;

        // III. UPDATE CACHE: Store/Update the data in MySQL
        // We will set the cache to expire in 10 minutes
        const EXPIRY_MINUTES = 10;
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + EXPIRY_MINUTES);

        /**
         * SQL Trick: ON DUPLICATE KEY UPDATE
         * If the city already exists in the cache (but was expired), it updates it.
         * If it doesn't exist, it inserts a new record.
         */
        await dbPool.query(
            `INSERT INTO cached_weather (location_key, weather_data, expires_at) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE weather_data = VALUES(weather_data), expires_at = VALUES(expires_at)`,
            [city, JSON.stringify(weatherData), expiresAt]
        );

        res.json({ source: 'api', data: weatherData });
        
    } catch (error) {
        console.error("Weather API Error:", error.message);
        
        // Handle city not found (404) or API key issues (401)
        const statusCode = error.response ? error.response.status : 500;
        res.status(statusCode).json({
            message: "Failed to fetch weather data",
            error: error.response ? error.response.data.message : error.message
        });
    }
});

// 6. Start the Server
app.listen(PORT, () => {
    console.log(`📡 Server is listening on port ${PORT}`);
    console.log(`🌐 Access it via: http://localhost:${PORT}`);
});