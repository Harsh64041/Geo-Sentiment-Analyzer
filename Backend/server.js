require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests (from React)
app.use(express.json()); // Allow app to accept JSON

// API Routes
app.use('/api', apiRoutes);
app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));