declare class SchichtplanungServer {
    private app;
    private port;
    constructor();
    private initializeMiddleware;
    private initializeRoutes;
    private initializeErrorHandling;
    private initializeDatabase;
    start(): Promise<void>;
    private gracefulShutdown;
}
export default SchichtplanungServer;
//# sourceMappingURL=server.d.ts.map