import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'ASTRA-LOOP API',
    description: 'Closed-Loop Astronaut Health Twin Backend Engine',
    version: '1.0.0',
    status: 'OPERATIONAL',
    disclaimer: 'Decision support and research prototype. Synthetic health data.',
  });
});

// Central Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 ASTRA-LOOP Mission Control API active on http://localhost:${PORT}`);
  });
}

export default app;
