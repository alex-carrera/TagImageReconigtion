import express, { type Request, type Response, type NextFunction } from 'express';
import { imageAnalyzerRouter } from '../routes/imageAnalyzerRouter.js';

export function createApp() {
    const app = express();

    app.use((req: Request, res: Response, next: NextFunction) => {
        // Permitir orígenes específicos (whitelist)
        const allowedOrigins = new Set([
            'http://localhost:4200',
            'http://localhost:8080',
        ]);

        const origin = req.headers.origin as string | undefined;
        if (origin && allowedOrigins.has(origin)) {
            // Refleja el origen permitido para soportar credenciales
            res.header('Access-Control-Allow-Origin', origin);
        }
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');

        // Handle preflight requests quickly
        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }

        next();
    });

    app.use(express.json());
    app.use('/api', imageAnalyzerRouter);

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        if (err?.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                error: 'FILE_TOO_LARGE',
                message: 'El archivo excede el límite de 5MB.',
            });
        }

        console.error(err);

        return res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Unexpected error. Please try again later.',
        });
    });

    return app;
}