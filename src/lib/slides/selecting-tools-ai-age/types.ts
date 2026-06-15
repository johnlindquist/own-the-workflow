export type SlideKind =
	| 'title'
	| 'thesis'
	| 'receipt'
	| 'candidate'
	| 'questions'
	| 'rubric'
	| 'terminal'
	| 'close'
	| 'links';

export type DemoAction = {
	label: string;
	command: string;
	output?: string[];
	note?: string;
};

export type ToolSlide = {
	id: string;
	kind: SlideKind;
	eyebrow: string;
	title: string;
	point: string;
	visual: {
		stamp?: string;
		items?: string[];
		links?: string[];
		receiptMarks?: string[];
	};
	demo?: DemoAction;
	eggoPrompt: string;
};
