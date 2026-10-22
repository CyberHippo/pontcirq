// Minimal iCalendar (RFC 5545) writer for the events in src/data/actualites.ts.
// Single-day events with a `time` are timed in Europe/Paris; the others are all-day.
import type { Actualite } from '../data/actualites';

const encoder = new TextEncoder();

// Escape a TEXT value (RFC 5545 §3.3.11).
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// Fold a content line at 75 octets without splitting a UTF-8 character (RFC 5545 §3.1).
function foldLine(line: string): string {
  const parts: string[] = [];
  let current = '';
  let size = 0;
  for (const char of line) {
    const charSize = encoder.encode(char).length;
    // Continuation lines start with a space, which counts toward the limit.
    const limit = parts.length === 0 ? 75 : 74;
    if (size + charSize > limit) {
      parts.push(current);
      current = '';
      size = 0;
    }
    current += char;
    size += charSize;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

// 'YYYY-MM-DD' -> 'YYYYMMDD', optionally shifted by a number of days.
function formatDate(date: string, addDays = 0): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + addDays)).toISOString().slice(0, 10).replace(/-/g, '');
}

// 'YYYY-MM-DD' + 'HH:MM' -> 'YYYYMMDDTHHMM00' (local time, used with TZID).
function formatLocalDateTime(date: string, time: string): string {
  return `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
}

// Events only have a start time; assume this duration so calendars show a block.
const DEFAULT_DURATION = 'PT2H';

// Europe/Paris with the EU daylight-saving rules, referenced by TZID.
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Paris',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

function eventTiming(event: Actualite): string[] {
  if (event.time && !event.endDate) {
    return [
      `DTSTART;TZID=Europe/Paris:${formatLocalDateTime(event.date, event.time)}`,
      `DURATION:${DEFAULT_DURATION}`,
    ];
  }
  return [
    `DTSTART;VALUE=DATE:${formatDate(event.date)}`,
    // DTEND is exclusive for all-day events: the day after the last day.
    `DTEND;VALUE=DATE:${formatDate(event.endDate ?? event.date, 1)}`,
  ];
}

const dtstamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function buildCalendar(events: Actualite[], site: URL): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//Commune de Pontcirq//${site.host}//FR`,
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Pontcirq',
    'X-WR-TIMEZONE:Europe/Paris',
    ...VTIMEZONE,
  ];

  for (const event of events) {
    const url = new URL(`/actualites/${event.id}/`, site).href;
    lines.push(
      'BEGIN:VEVENT',
      `UID:actualite-${event.id}@${site.host}`,
      `DTSTAMP:${dtstamp}`,
      ...eventTiming(event),
      `SUMMARY:${escapeText(event.title)}`,
      ...(event.lieu ? [`LOCATION:${escapeText(event.lieu)}`] : []),
      `DESCRIPTION:${escapeText(`${event.excerpt}\n\n${url}`)}`,
      `URL:${url}`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

export function icsResponse(body: string): Response {
  return new Response(body, {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
}
