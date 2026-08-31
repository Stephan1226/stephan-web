import type { ArchiveYear, Note, NoteSummary } from './types';

export interface NotesRepository {
	/** All published notes, newest first. */
	listNotes(): Promise<NoteSummary[]>;
	listNotesByYear(year: number): Promise<NoteSummary[]>;
	listNotesByMonth(year: number, month: number): Promise<NoteSummary[]>;
	getNote(slug: string): Promise<Note | null>;
	/** Years and months that contain published notes, newest first. */
	getArchive(): Promise<ArchiveYear[]>;
}
