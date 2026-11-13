import "reflect-metadata";
import express from 'express';
import { AppDataSource } from './config/data-source';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { userRoutes } from './routes/userRoutes';

const app = express();
const env = process.env as Record<string, any>;
const PORT = env.PORT || 3000;

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route (Para sa Test 1 sa Postman)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        database: AppDataSource.isInitialized ? 'connected' : 'disconnected' 
    });
});

// API Routes
app.use('/api/users', userRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize Database and Start Server
AppDataSource.initialize()
    .then(() => {
        logger.info('Data Source has been initialized successfully.');
        
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        logger.error('Error during Data Source initialization:', error);
    });