import { getCollection, type CollectionEntry } from 'astro:content';
import type { NotesRepository } from './repository';
import type { ArchiveYear, Note, NoteSummary } from './types';

function toSummary(entry: CollectionEntry<'notes'>): NoteSummary {
	const publishedAt = entry.data.publishedAt;
	return {
		slug: entry.id,
		title: entry.data.title,
		description: entry.data.description,
		publishedAt,
		// Dates without a timezone are parsed as UTC, so derive year/month in UTC too.
		year: publishedAt.getUTCFullYear(),
		month: publishedAt.getUTCMonth() + 1,
	};
}

export class ContentNotesRepository implements NotesRepository {
	#entries: Promise<CollectionEntry<'notes'>[]> | undefined;

	#loadEntries() {
		this.#entries ??= getCollection('notes', ({ data }) => !data.draft).then(
			(entries) =>
				entries.sort(
					(a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
				),
		);
		return this.#entries;
	}

	async listNotes() {
		return (await this.#loadEntries()).map(toSummary);
	}

	async listNotesByYear(year: number) {
		return (await this.listNotes()).filter((note) => note.year === year);
	}

	async listNotesByMonth(year: number, month: number) {
		return (await this.listNotes()).filter(
			(note) => note.year === year && note.month === month,
		);
	}

	async getNote(slug: string) {
		const entry = (await this.#loadEntries()).find(({ id }) => id === slug);
		if (!entry) return null;
		const note: Note = { ...toSummary(entry), html: entry.rendered?.html ?? '' };
		return note;
	}

	async getArchive() {
		const years = new Map<number, ArchiveYear>();
		for (const note of await this.listNotes()) {
			let year = years.get(note.year);
			if (!year) {
				year = { year: note.year, count: 0, months: [] };
				years.set(note.year, year);
			}
			year.count += 1;
			let month = year.months.find((m) => m.month === note.month);
			if (!month) {
				month = { month: note.month, count: 0 };
				year.months.push(month);
			}
			month.count += 1;
		}
		// Notes are sorted newest first, so years and months already are too.
		return [...years.values()];
	}
}
