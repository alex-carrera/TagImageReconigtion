import { config } from 'dotenv';
config(); // carga variables de entorno desde .env si existe

import { createApp } from './infrastructure/rest/express/app.js';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = createApp();

app.listen(port, () => {
    console.log(`Image Analyzer backend listening on port ${port}`);
});