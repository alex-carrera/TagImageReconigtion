import express, { type Request, type Response, type NextFunction } from 'express';
import { imageAnalyzerRouter } from '../routes/imageAnalyzerRouter.js';

export function createApp() {
    const app = express();

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