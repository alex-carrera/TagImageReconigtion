import express from 'express';
import cors from 'cors';
import { imageAnalyzerRouter } from '../routes/imageAnalyzerRouter.js';

export function createApp() {
    const app = express();

    app.use(
        cors({
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'OPTIONS'],
            allowedHeaders: ['Content-Type'],
        })
    );

    app.use(express.json());
    app.use('/api', imageAnalyzerRouter);

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });

    return app;
}