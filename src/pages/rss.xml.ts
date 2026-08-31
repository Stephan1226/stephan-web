import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { notesRepository } from '../lib/notes';

export const GET: APIRoute = async (context) => {
	const notes = await notesRepository.listNotes();

	return rss({
		title: 'Stephan Kim',
		description: 'Short notes, ideas and observations.',
		site: context.site ?? 'https://stephan.kim',
		items: notes.map((note) => ({
			title: note.title,
			description: note.description ?? '',
			pubDate: note.publishedAt,
			link: `/notes/${note.slug}/`,
		})),
	});
};
