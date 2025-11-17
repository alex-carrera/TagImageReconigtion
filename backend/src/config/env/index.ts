import { config as loadEnv } from 'dotenv';
loadEnv();

interface EnvConfig {
    port: number;

    googleVision: {
        apiKey: string;
        endpoint: string;
    };

    imagga: {
        apiKey: string;
        apiSecret: string;
        endpoint: string;
    };
}

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

export const env: EnvConfig = {
    port: Number(process.env.PORT ?? 3000),

    googleVision: {
        apiKey: required('GOOGLE_VISION_API_KEY'),
        endpoint: process.env.GOOGLE_VISION_ENDPOINT ?? 'https://vision.googleapis.com/v1/images:annotate',
    },

    imagga: {
        apiKey: required('IMAGGA_API_KEY'),
        apiSecret: required('IMAGGA_API_SECRET'),
        endpoint: process.env.IMAGGA_ENDPOINT ?? 'https://api.imagga.com/v2/tags',
    },
};