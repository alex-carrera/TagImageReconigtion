import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import {createAnalyzeImageUseCase} from "../../config/container.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

export const imageAnalyzerRouter = Router();

const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
];

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
                    error: 'UNSUPPORTED_MEDIA_TYPE',
                    message:
                        'Only image files are allowed (jpeg, png, webp, avif).',
                });
            }

            if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
                return res.status(400).json({
                    error: 'UNSUPPORTED_IMAGE_TYPE',
                    message:
                        'Unsupported image type. Allowed types: JPEG, PNG, WEBP, AVIF.',
                });
            }

            let imageBuffer = file.buffer;

            // AVIF/WEBP → JPEG por compatibilidad con algunos proveedores (p. ej., Imagga)
            if (file.mimetype === 'image/avif' || file.mimetype === 'image/webp') {
                try {
                    imageBuffer = await sharp(file.buffer)
                        .jpeg({ quality: 90 })
                        .toBuffer();
                } catch (err) {
                    return res.status(400).json({
                        error: 'IMAGE_CONVERSION_FAILED',
                        message:
                            'Could not process the uploaded image. Try another image or format (JPEG/PNG).',
                    });
                }
            }

            const useCase = createAnalyzeImageUseCase();

            const result = await useCase.analyzeFromBuffer(imageBuffer, {
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