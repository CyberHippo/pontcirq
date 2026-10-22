import type { APIRoute } from 'astro';
import { actualites } from '../data/actualites';
import { buildCalendar, icsResponse } from '../utils/ics';

// Every event, past and upcoming, so subscribers keep their history.
export const GET: APIRoute = ({ site }) => {
  const events = [...actualites].sort((a, b) => a.date.localeCompare(b.date));
  return icsResponse(buildCalendar(events, site!));
};
