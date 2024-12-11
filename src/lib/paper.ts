import { PUIDToIdx } from './utils';

export class Paper {
	index: number | null = null;
	id: string;
	collectionId: string;
	collectionAcronym: string;
	volumeId: string;
	paperId: string;
	paperTitle: string;
	year: number;
	booktitle: string;
	authors: { first: string; last: string }[];
	abstract: string;
	url: string;
	bibkey: string;
	doi: string;
	fulltext: { key: string[] };
	materialEntities: string[];
	methodEntities: string[];
	metricEntities: string[];
	taskEntities: string[];
	fieldOfStudies: string[];
	summaries: { overview: string; challenge: string; approach: string; outcome: string };
	vectors: { overview: number[]; challenge: number[]; approach: number[]; outcome: number[] };
	relevantPapers: {
		overview: number[] | null;
		challenge: number[] | null;
		approach: number[] | null;
		outcome: number[] | null;
	};

	constructor(paperJson) {
		this.id = paperJson.id;
		this.collectionId = paperJson.payload.collection_id;
		this.collectionAcronym = paperJson.payload.collection_acronym;
		this.volumeId = paperJson.payload.volume_id;
		this.paperId = paperJson.payload.paper_id;
		this.paperTitle = paperJson.payload.paper_title;
		this.year = paperJson.payload.year;
		this.booktitle = paperJson.payload.booktitle;
		this.authors = paperJson.payload.authors;
		this.abstract = paperJson.payload.abstract;
		this.url = paperJson.payload.url;
		this.bibkey = paperJson.payload.bibkey;
		this.doi = paperJson.payload.doi;
		this.fulltext = paperJson.payload.fulltext;
		this.materialEntities = paperJson.payload.material_entities;
		this.methodEntities = paperJson.payload.method_entities;
		this.metricEntities = paperJson.payload.metric_entities;
		this.taskEntities = paperJson.payload.task_entities;
		this.fieldOfStudies = paperJson.payload.field_of_studies;
		this.summaries = paperJson.payload.summaries;
		this.vectors = paperJson.vector;
		this.relevantPapers = paperJson.payload.relevant_papers;
	}

	getNamedEntities() {
		return Object.values(this.materialEntities)
			.flat()
			.concat(
				Object.values(this.methodEntities).flat(),
				Object.values(this.metricEntities).flat(),
				Object.values(this.taskEntities).flat()
			);
	}

	getPDFURL() {
		return 'https://aclanthology.org/' + this.url + '.pdf';
	}

	toContext(idx: number) {
		return `    PUID: ${idx}
    TITLE: ${this.paperTitle}
    PAPER: ${this.abstract}
`;
	}
}

export class PaperList {
	papers: Paper[] = [];

	constructor(papers: Paper[]) {
		this.papers = papers;
	}

	filterByPUIDs(PUIDs: string[]): PaperList {
		let idxs = PUIDs.map((i) => PUIDToIdx(i)).filter((i) => i > -1);
		idxs = idxs.sort((a, b) => a - b);
		const filteredPapers = this.papers.filter((p, i) => idxs.includes(i + 1));
		return new PaperList(filteredPapers);
	}

	addPapers(papers: Paper[]): PaperList {
		let newPapers = [...this.papers, ...papers];
		let newPaperList = new PaperList(newPapers);
		newPaperList.updateIndex();
		return newPaperList;
	}

	updateIndex(): void {
		this.papers = this.papers.map((p, i) => {
			p.index = i + 1;
			return p;
		});
	}
}
