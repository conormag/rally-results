import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { GET } from './route';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import fs from 'fs';
import path from 'path';


const mockHtml = fs.readFileSync(
  path.resolve(path.resolve(process.cwd(), 'test/fixtures/events-index.html')),
  'utf8'
);

const server = setupServer(
  http.get('https://results.shannonsportsit.ie/index.php', () => {
    return new HttpResponse(mockHtml, {
      headers: { 'Content-Type': 'text/html' }
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Rally Results API Scraper', () => {
  it('correctly parses event list HTML into JSON results', async () => {
    // Mock the Next.js Request object
    const req = new Request('http://localhost:3000/api/events?year=2025');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.events[0].name).toBe('Killarney Historic Cars Rally');
    expect(data.events[0].id).toBe('KH25');
  });


  it('returns an empty array if the year has no events', async () => {
    const req = new Request('http://localhost:3000/api/events?year=1999');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.events.length).toBe(0);
  });

});