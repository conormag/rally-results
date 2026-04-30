import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { GET } from './route';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import fs from 'fs';
import path from 'path';


const mockHtml = fs.readFileSync(
  path.resolve(path.resolve(process.cwd(), 'test/fixtures/stage2-results-page.html')),
  'utf8'
);

const server = setupServer(
  http.get('https://results.shannonsportsit.ie/results.php', () => {
    return new HttpResponse(mockHtml, {
      headers: { 'Content-Type': 'text/html' }
    });
  }),
  http.post('https://results.shannonsportsit.ie/results.php', (req) => {
    // We can inspect the request body here if needed to ensure correct form submission
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
    const req = new Request('http://localhost:3000/api/results/MO26/SS2');
    const params = Promise.resolve({ rallyId: 'MO26', stageId: 'SS2' });

    const response = await GET(req, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.mainResults[0].pos).toBe('1');
    expect(data.mainResults[0].posChange).toBe('3');
    expect(data.mainResults[0].stageTime).toBe('5:57.6');
    expect(data.mainResults[1].gapToLeader).toBe('0:03.1');
  });

});