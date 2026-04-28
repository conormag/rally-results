import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: { rallyId: string } }
) {
  try {
    const { rallyId } = params;
    // Example URL: https://results.shannonsportsit.ie/results.php?rally=MO26
    const url = `https://results.shannonsportsit.ie/results.php?rally=${rallyId}`;

    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    type ResultRow = {
      pos: string;
      carNo: string;
      driver: string;
      codriver: string;
      make: string;
      eventClass: string;
      classPos: string;
      totalTime: string;
      gapToLeader: string;
      gapToPrev: string;
    };

    const mainResults: ResultRow[] = [];
    const juniorResults: ResultRow[] = [];
    const historicResults: ResultRow[] = [];

    const parseTableInto = (table: cheerio.Cheerio<any>, target: ResultRow[]) => {
      table.find('tr').each((index, element) => {
        if (index === 0) return; // Skip header row

        const cols = $(element).find('td');
        if (cols.length < 9) return;

        const names = $(cols[2]).text().trim().split('/');
        target.push({
          pos: $(cols[0]).text().trim(),
          carNo: $(cols[1]).text().trim(),
          driver: names[0]?.trim() || '',
          codriver: names[1]?.trim() || '',
          make: $(cols[3]).text().trim(),
          eventClass: $(cols[4]).text().trim(),
          classPos: $(cols[5]).text().trim(),
          totalTime: $(cols[6]).text().trim(),
          gapToLeader: $(cols[7]).text().trim(),
          gapToPrev: $(cols[8]).text().trim(),
        });
      });
    };

    $('h3').each((_, heading) => {
      const headingText = $(heading).text().trim();
      const table = $(heading).nextAll('table').first();

      if (table.length === 0) return;

      if (headingText.includes('Main Field')) {
        parseTableInto(table, mainResults);
      } else if (headingText.includes('Junior')) {
        parseTableInto(table, juniorResults);
      } else if (headingText.includes('Historic')) {
        parseTableInto(table, historicResults);
      }
    });

    return NextResponse.json({
      mainResults,
      juniorResults,
      historicResults,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
  }
}