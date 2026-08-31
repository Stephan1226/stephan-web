import { ContentNotesRepository } from './content';
import type { NotesRepository } from './repository';

export type { NotesRepository } from './repository';
export type { ArchiveMonth, ArchiveYear, Note, NoteSummary } from './types';

// The single data-source swap point: replace this implementation (e.g. with a
// D1-backed repository) to move notes into a database without touching pages.
export const notesRepository: NotesRepository = new ContentNotesRepository();
