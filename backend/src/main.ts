import { env } from './config/env/index.js';
import { createApp } from './infrastructure/rest/express/app.js';

const app = createApp();

app.listen(env.port, () => {
    console.log(`🚀 Backend running on port ${env.port}`);
});