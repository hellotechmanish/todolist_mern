const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const todoAdmin = require('./routes/admin');
const todoRoutes = require('./routes/todo');
const connectDB = require('./config/mongodb');
const { authenticate } = require('./middleware/auth');



// Load environment variables from .env file
dotenv.config();

// Check if MONGO_URI is defined in .env
if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in .env file!');
    process.exit(1);
}

const app = express();

// Connect to DB
connectDB();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL
    credentials: true
}));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World! Your server is running.');
});

// // Log the MongoDB URI (Optional)
// console.log('MongoDB URI:', process.env.MONGO_URI);

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/todos', todoRoutes);
app.use('/api/todos', todoRoutes);  // Ensure authentication middleware for all routes
app.use('/api/admin', todoAdmin);  // Ensure authentication middleware for all routes



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
