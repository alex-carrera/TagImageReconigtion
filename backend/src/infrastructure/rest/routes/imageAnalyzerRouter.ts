import { Router } from 'express';
import multer from 'multer';
import {createAnalyzeImageUseCase} from "../../config/container.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

export const imageAnalyzerRouter = Router();

imageAnalyzerRouter.post(
    '/analyze',
    upload.single('image'),
    async (req, res, next) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    error: 'BAD_REQUEST',
                    message: 'No image file provided',
                });
            }

            if (!file.mimetype.startsWith('image/')) {
                return res.status(400).json({
                    error: 'BAD_REQUEST',
                    message: 'Only image files are allowed',
                });
            }

            const useCase = createAnalyzeImageUseCase();

            const result = await useCase.analyzeFromBuffer(file.buffer, {
                providerPreference: 'auto',
                maxTags: 10,
                minConfidence: 0.5,
            });

            return res.json({
                tags: result.tags.map((t) => ({
                    label: t.label,
                    confidence: t.confidence,
                })),
                width: result.width,
                height: result.height,
                provider: result.providerId ?? null,
            });
        } catch (err) {
            next(err);
        }
    }
);