const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bugRoutes = require('./routes/bugs');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
}));
app.use(express.json());
app.use('/api/bugs', bugRoutes);
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));