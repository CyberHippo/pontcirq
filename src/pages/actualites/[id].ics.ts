import type { APIRoute, GetStaticPaths } from 'astro';
import { actualites, getById } from '../../data/actualites';
import { buildCalendar, icsResponse } from '../../utils/ics';

export const getStaticPaths = (() =>
  actualites.map((item) => ({ params: { id: String(item.id) } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params, site }) => {
  const actualite = getById(Number(params.id))!;
  return icsResponse(buildCalendar([actualite], site!));
};
