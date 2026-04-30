import { NextResponse} from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';



export async function GET(
  request: Request) {
  const searchParams  = new URL(request.url).searchParams;
  const year = searchParams.get('year') || '';

  try {
    const url = `https://results.shannonsportsit.ie/index.php`;
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // first year is table after 1st year h1 containing "Index for <Year>"
    // we only want rows that have a "Results" link in 5th or 6th column
    const events: { id: string; name: string, year: string, eventDate: string }[] = [];

    const header = $(`h1:contains("Index for ${year}"), h2:contains("Index for ${year}")`);
    header.nextAll('table').first().find('tr').each((index, element) => {
      const cols = $(element).find('td');
      if (cols.length < 5) return;
      const resultsLink = $(cols[cols.length-1]).find('a').attr('href');
      if (resultsLink && resultsLink.includes('results.php?rally=')) {
        const rallyIdMatch = resultsLink.match(/rally=([A-Z0-9]+)/);
        if (rallyIdMatch) {
          const [eventName='', eventYear=''] = $(cols[0]).text().trim().split(',').map(s => s.trim());
          events.push({
            id: rallyIdMatch[1],
            name: eventName,
            year: eventYear,
            eventDate: $(cols[1]).text().trim(),
          });
        }
      }
    });

    // get the full list of years from the h1/h2 headers on the page
    const years: string[] = [];
    $(`h1:contains("Index for"), h2:contains("Index for")`).each((index, element) => {
      const yearMatch = $(element).text().match(/Index for (\d{4})/);
      if (yearMatch) {
        years.push(yearMatch[1]);
      }
    });


    return NextResponse.json({ events, years });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}