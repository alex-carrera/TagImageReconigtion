import express from 'express';
import {imageAnalyzerRouter} from "../routes/imageAnalyzerRouter.js";

export function createApp() {
    const app = express();

    app.use(express.json());
    app.use('/api', imageAnalyzerRouter);

    // endpoint simple de healthcheck
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });

    return app;
}