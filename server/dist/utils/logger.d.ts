import winston from 'winston';
export declare const logger: winston.Logger;
export declare const logStream: {
    write: (message: string) => void;
};
export declare const loggerMiddleware: (req: any, res: any, next: any) => void;
export declare const loggers: {
    database: (message: string, meta?: any) => void;
    api: (message: string, meta?: any) => void;
    service: (message: string, meta?: any) => void;
    auth: (message: string, meta?: any) => void;
    error: (message: string, error?: Error, meta?: any) => void;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map