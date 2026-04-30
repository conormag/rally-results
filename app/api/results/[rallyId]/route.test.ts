import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { GET } from './route';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import fs from 'fs';
import path from 'path';


const mockHtml = fs.readFileSync(
  path.resolve(path.resolve(process.cwd(), 'test/fixtures/oa-results-page.html')),
  'utf8'
);

const server = setupServer(
  http.get('https://results.shannonsportsit.ie/results.php', () => {
    return new HttpResponse(mockHtml, {
      headers: { 'Content-Type': 'text/html' }
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Rally Results API Scraper', () => {
  it('correctly parses HTML into JSON results', async () => {
    // Mock the Next.js Request object
    const req = new Request('http://localhost:3000/api/results/MO26');
    const params = Promise.resolve({ rallyId: 'MO26' });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mainResults[0].driver).toBe('Callum Devine');
    expect(data.mainResults[0].pos).toBe('1');
  });


  it('returns a 400 if the rally ID format is invalid', async () => {
    const req = new Request('http://localhost:3000/api/results/INVALID');
    const response = await GET(req, { params: { rallyId: 'INVALID' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid rally ID format');
  });

  it('returns a 500 if the scraper fails', async () => {
    // Force a server error for this specific test
    server.use(
      http.get('https://results.shannonsportsit.ie/results.php', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const req = new Request('http://localhost:3000/api/results/ZZ25');
    const params = Promise.resolve({ rallyId: 'MO26' });
    const response = await GET(req, { params });
    const data = await response.json();
    expect(response.status).toBe(500);
  });


  it('returns correct number of stages', async () => {
    const req = new Request('http://localhost:3000/api/results/MO26');
    const params = Promise.resolve({ rallyId: 'MO26' });

    const response = await GET(req, { params });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.stages.length).toBe(16);
  });
});