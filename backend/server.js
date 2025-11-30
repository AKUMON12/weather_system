// Load environment variables from .env file
require('dotenv').config();

// 1. Core Imports
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Use the 'promise' wrapper for async/await support

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


// 6. Start the Server
app.listen(PORT, () => {
    console.log(`📡 Server is listening on port ${PORT}`);
    console.log(`🌐 Access it via: http://localhost:${PORT}`);
});