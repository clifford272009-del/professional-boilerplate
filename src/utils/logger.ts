// src/utils/logger.ts
export const createLogger = (serviceName: string) => {
    return {
        info: (message: string, meta?: any) => {
            console.log(`[INFO] [${serviceName}]: ${message}`, meta ? meta : '');
        },
        error: (message: string, meta?: any) => {
            console.error(`[ERROR] [${serviceName}]: ${message}`, meta ? meta : '');
        },
        warn: (message: string, meta?: any) => {
            console.warn(`[WARN] [${serviceName}]: ${message}`, meta ? meta : '');
        },
        debug: (message: string, meta?: any) => {
            console.debug(`[DEBUG] [${serviceName}]: ${message}`, meta ? meta : '');
        }
    };
};