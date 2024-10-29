import axios from 'axios';
import express, { json } from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Testing: Welcome to the API!');
});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

// User model
const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
}, {
    timestamps: true,
});

// Predefined users
const createPredefinedUsers = async () => {
  const users = [
    { email: 'user1@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' },
    { email: 'user3@example.com', password: 'password3' },
  ];

  for (const user of users) {
    await User.findOrCreate({
      where: { email: user.email },
      defaults: { password: user.password },
    });
  }
};
//Endpoint to to check the fecthed login list for email and password
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, password } });
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Endpoint to fetch users
app.get('/api/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Endpoint to fetch financial data for selected companies
app.get('/api/financial-data', async (req, res) => {
  const companies = req.query.companies ? req.query.companies.split(',') : ['AAPL']; // Default to AAPL if no companies provided
  const apiKey = process.env.REACT_APP__API_KEY; // API key from environment variables

  // Log the companies being requested
  console.log('Requested companies:', companies);
  console.log('Using API Key:', apiKey ? 'Available' : 'Not available');

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured' });
  }

  try {
    const responses = await Promise.all(
      companies.map(company =>
        axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${company}?period=annual&apikey=${apiKey}`)
          .catch(err => {
            console.error(`Error fetching data for ${company}:`, err.response ? err.response.data : err.message);
            return { data: [] }; // Return empty data for this company on error
          })
      )
    );

    // Combine data and handle empty responses
    const combinedData = responses.flatMap(response => 
      response.data.map(item => ({
        date: item.date,
        revenue: item.revenue,
        netIncome: item.netIncome,
        company: item.symbol // Each response includes a symbol
      }))
    );

    if (combinedData.length === 0) {
      console.warn('No data found for the requested companies');
    }

    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

const startServer = async () => {
  try {
    await sequelize.authenticate(); // Test DB connection
    console.log('Database connection established successfully.');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();

