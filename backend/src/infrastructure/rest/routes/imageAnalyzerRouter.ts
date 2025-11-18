import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { createAnalyzeImageUseCase } from '../../config/container.js';

export const imageAnalyzerRouter = Router();

const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

imageAnalyzerRouter.post(
    '/analyze',
    upload.single('image'),
    async (req, res, next) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    error: 'NO_FILE_UPLOADED',
                    message: 'Debes subir una imagen.',
                });
            }

            if (!file.mimetype.startsWith('image/')) {
                return res.status(415).json({
                    error: 'UNSUPPORTED_MEDIA_TYPE',
                    message: 'Solo se permiten imágenes. Ejemplo: JPEG, PNG, WEBP, AVIF.',
                });
            }

            if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
                return res.status(415).json({
                    error: 'UNSUPPORTED_IMAGE_TYPE',
                    message:
                        'Formato de imagen no soportado. Solo JPEG, PNG, WEBP o AVIF.',
                });
            }

            let imageBuffer = file.buffer;

            if (file.mimetype === 'image/avif' || file.mimetype === 'image/webp') {
                try {
                    imageBuffer = await sharp(file.buffer)
                        .jpeg({ quality: 90 })
                        .toBuffer();
                } catch {
                    return res.status(400).json({
                        error: 'IMAGE_CONVERSION_FAILED',
                        message:
                            'No se pudo procesar la imagen. Intenta con un JPEG o PNG.',
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
                tags: result.tags,
                provider: result.providerId ?? null,
            });
        } catch (err) {
            next(err);
        }
    }
);