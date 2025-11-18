import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../express/app.js';

const app = createApp();

const dummyPdf = Buffer.from('%PDF-1.4 dummy');

describe('ImageAnalyzerRouter', () => {
  it('should reject non-image files', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .attach('image', dummyPdf, { filename: 'test.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(415);
    expect(res.body.error).toBe('UNSUPPORTED_MEDIA_TYPE');
  });

  it('should reject files above size limit', async () => {
    const bigBuffer = Buffer.alloc(6 * 1024 * 1024);

    const res = await request(app)
      .post('/api/analyze')
      .attach('image', bigBuffer, {
        filename: 'big.jpg',
        contentType: 'image/jpeg'
      });

    expect(res.status).toBe(413);
    expect(res.body.error).toBe('FILE_TOO_LARGE');
  });
});
