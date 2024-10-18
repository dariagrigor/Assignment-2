const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./api-products');

const app = express();

app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to DressStore application.');
});

// Listen on port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Connection to MongoDB URI
const dbURI = 'mongodb+srv://dariagrigoro:nyzAmyxcr6lXmmfB@cluster0.3waqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Or your MongoDB Atlas URI

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

// Mount the product routes at /api
app.use('/api', productRoutes); 
