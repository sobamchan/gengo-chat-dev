import type { PaperList } from "./paper";

export class Prompter {
    inst: string

    constructor(inst: string) {
        this.inst = inst;
    }

    generate(papers: PaperList, query: string) : string {
        const context = papers.papers.map((p, idx) => p.toContext(idx+1)).join('\n');

        const prompt = `${this.inst}

Research papers:
${context}

Query: ${query}

Use markdown list to structure the output.
Make sure to cite relevant papers using PUIDs, like '(PUID:1)(PUID:3)'.
Do not include reference section at the end.`

        return prompt;
    }
}

export function getDefaultPrompter() : Prompter {
    const inst = `You are a helpful search assistant.
Your task is to deliver a concise and accurate response to a user's query, drawing from the given research papers.
Your answer must be precise, of high-quality, and written by an expert using an unbiased and journalistic tone.
It is EXTREMELY IMPORTANT to directly answer the query. NEVER say 'based on the search results' or start your answer with a heading or title.
Get straight to the point.
Your answer MUST be less than 150 words.
	
You MUST cite the relevant papers that answer the query.
Use PUIDs to cite the relevant papers AT THE END of a sentence.
Do not mention any irrelevant papers.
You MUST ADHERE to the following instructions for citing papers:
	to cite a paper, enclose relevant paper's PUIDs at the end of the output sentence, like '(PUID:1)(PUID:3)'
	NO SPACE between the last word and the citation, and ALWAYS use brackets. Only use this format with PUIDs to cite search results.
	DO NOT write a References section.
	Ignore the papers that are not relevant to the query.
You MUST ADHERE to the following formatting instructions:
	Use headings level 2 and 3 to separate sections of your response, like '## Header', but NEVER start an answer with a heading or title of any kind (i.e. Never start with #).
	Use single new lines for lists and double new lines for paragraphs.
	NEVER write URLs or links.`;

    return new Prompter(inst);
}

function getSimplePrompter() : Prompter {
    const inst = `Answer to the following query by using information from the provided list of research papers.
Cite the relevant papers by including corresponding PUIDs, like '[1][3]' at the end of sentences.
DO NOT include paper titles or author names to cite, write PUIDs at the end of sentences.`;
    return new Prompter(inst);
}