import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { validateRallyId } from '@/lib/scrapers';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ rallyId: string, stageId: string }> }
) {
  const { rallyId, stageId } = await params;

  if (!validateRallyId(rallyId)) {
    return NextResponse.json({ error: 'Invalid rally ID format' }, { status: 400 });
  }

  try {
    // 1. Prepare the Form Data
    // We use URLSearchParams to format it as application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('stage', stageId);
    formData.append('event', '--');
    formData.append('select', 'byposn');
    formData.append('submit', 'Show Me'); // Often required by legacy PHP scripts

    // 2. Perform the POST request
    const response = await axios.post(
      `https://results.shannonsportsit.ie/results.php?rally=${rallyId}`,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const $ = cheerio.load(response.data);

    type ResultRow = {
      pos: string;
      posChange: string;
      carNo: string;
      driver: string;
      codriver: string;
      make: string;
      eventClass: string;
      classPos: string;
      stageTime: string;
      roadTime: string;
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
        if (cols.length < 11) return;

        const names = $(cols[2]).text().trim().split('/');
        // regex to split 1(+3) into 1 and +3
        // can also be 3(-1) or 2(=)
        // can also be just the pos with no change, like 5
        const text = $(cols[0]).text().trim();
        const posChangeMatch = text.match(/(\d+)\s*(\(([-+=]\d+)\))?/);
        const pos = posChangeMatch ? posChangeMatch[1] : '';
        const posChange = posChangeMatch && posChangeMatch[3] ? posChangeMatch[3] : '0';
        // convert posChange to a number for easier handling in the frontend
        const posChangeNum = parseInt(posChange, 10) || 0;
        target.push({
          pos,
          posChange: posChangeNum.toString(),
          carNo: $(cols[1]).text().trim(),
          driver: names[0]?.trim() || '',
          codriver: names[1]?.trim() || '',
          make: $(cols[3]).text().trim(),
          eventClass: $(cols[4]).text().trim(),
          classPos: $(cols[5]).text().trim(),
          stageTime: $(cols[6]).text().trim(),
          roadTime: $(cols[7]).text().trim(),
          totalTime: $(cols[8]).text().trim(),
          gapToLeader: $(cols[9]).text().trim(),
          gapToPrev: $(cols[10]).text().trim(),
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

    const mainResultsClassFilter: Set<string> = new Set(mainResults.map(r => r.eventClass));
    const juniorResultsClassFilter: Set<string> = new Set(juniorResults.map(r =>r.eventClass));
    const historicResultsClassFilter: Set<string> = new Set(historicResults.map(r =>r.eventClass));

    // get the list of stages
    const stages: {id: string, name: string}[] = [];
    const options = $('select[name="stage"] option');
    options.each((i, el) => {
      const stageId = $(el).attr('value') || '';
      stageId.length > 0 && stageId !== 'FI' && stages.push({id: stageId, name: `SS${stageId}`});
    });

    return NextResponse.json({
      mainResults,
      juniorResults,
      historicResults,
      mainResultsClassFilter,
      juniorResultsClassFilter,
      historicResultsClassFilter,
      stages
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
  }
}