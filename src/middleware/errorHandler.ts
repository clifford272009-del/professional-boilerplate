import { Request, Response, NextFunction } from 'express';

const env = process.env as Record<string, any>;

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({
        success: false,
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: `Route ${req.method} ${req.originalUrl} not found`,
        },
    });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500;
    const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'Internal Server Error';
    const details = err.details;

    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message,
            ...(details && { details }),
            ...(env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
};