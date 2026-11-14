import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/data-source';

// Kung wala kay explicit export nga `logger` gikan sa utils/logger, o kung `createLogger` naa didto:
import { createLogger } from './utils/logger';

// I-adjust ang import path sa imong middleware ug routes kon asa gyud sila dapit nahimutang
import { userRoutes } from './routes/userRoutes';
import { authRoutes } from './routes/authRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const logger = createLogger('Server');
const app = express();
const env = process.env as Record<string, any>;
const PORT = env.PORT || 3000;

app.set('trust proxy', 1);

// Parsing Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Route (Diretso na diri, wala na magkinahanglan og healthRoutes file)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        database: AppDataSource.isInitialized ? 'connected' : 'disconnected' 
    });
});

// Register API Routes
app.use('/api/auth', authRoutes);
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