export interface NoteSummary {
	slug: string;
	title: string;
	description?: string;
	publishedAt: Date;
	year: number;
	month: number;
}

export interface Note extends NoteSummary {
	html: string;
}

export interface ArchiveMonth {
	month: number;
	count: number;
}

export interface ArchiveYear {
	year: number;
	count: number;
	months: ArchiveMonth[];
}
