import type { ToolSlide } from './types';

export const toolSlides: ToolSlide[] = [
	{
		id: 'title',
		kind: 'title',
		eyebrow: 'the new tool question',
		title: 'Choose Tools You Can Own',
		point:
			'AI makes software easier to build. Open source makes it easier to inspect, change, and replace.',
		visual: {
			stamp: 'new question',
			items: ['buy the app?', 'can I own the workflow?']
		},
		eggoPrompt:
			'Transparent-background tactile egghead/eggo character holding a small toolbox in one hand and a wiring diagram in the other, soft studio light, clay-like texture.'
	},
	{
		id: 'slice-over-list',
		kind: 'thesis',
		eyebrow: 'popular apps become repos',
		title: 'The Clone Wave',
		point:
			'Paid apps are getting rebuilt in public: dictation, screenshots, menu bars, autocomplete.',
		visual: {
			stamp: 'public repos',
			items: [
				'dictation -> Handy',
				'screenshots -> Screendrop',
				'menu bar -> Thaw',
				'autocomplete -> Cotabby'
			],
			links: [
				'https://handy.computer/',
				'https://github.com/fayazara/Screendrop',
				'https://github.com/stonerl/Thaw',
				'https://cotabby.app/'
			]
		},
		eggoPrompt:
			'Transparent-background tactile eggo character cutting one clean slice through a layered workflow cake with icon layers for hotkey, microphone, transcript, cursor, and paste target.'
	},
	{
		id: 'search-before-build',
		kind: 'receipt',
		eyebrow: 'do this first',
		title: 'Build From Working Examples',
		point:
			'Search GitHub before starting from a blank prompt. DeepWiki can explain the repo, even if it is written in another language.',
		visual: {
			stamp: 'repo ingredients',
			receiptMarks: ['gh search', 'Swift', 'Rust', 'TypeScript', 'DeepWiki']
		},
		demo: {
			label: 'GitHub CLI',
			command:
				'gh search repos "cleanshot alternative" --limit 8 --json fullName,description,url,updatedAt',
			output: [
				'Swift screenshot app -> capture pattern',
				'Rust dictation tool -> input pipeline',
				'TypeScript autocomplete -> interaction model'
			],
			note: 'The repo does not have to be in your language. It just has to show a working shape the agent can adapt.'
		},
		eggoPrompt:
			'Transparent-background tactile eggo character with a headlamp studying a map made from GitHub repo cards and branching search trails.'
	},
	{
		id: 'leads-not-proof',
		kind: 'candidate',
		eyebrow: 'better input for agents',
		title: 'Ingredients Beat Inference',
		point:
			'Give agents working repos to learn from. Then ask them to translate, combine, trim, and ship.',
		visual: {
			stamp: 'repo ingredients',
			items: ['permissions', 'UI', 'storage', 'sharing']
		},
		demo: {
			label: 'Pattern library',
			command:
				'gh search repos "superwhisper" --limit 8 --sort updated --json fullName,description,updatedAt,stargazersCount',
			output: [
				'blank prompt -> guess APIs',
				'blank prompt -> guess state',
				'repo examples -> adapt working patterns',
				'repo examples -> combine proven pieces'
			],
			note: 'You are not shopping for the perfect clone. You are building a library of working patterns.'
		},
		eggoPrompt:
			'Transparent-background tactile eggo character inspecting repo cards with a magnifying glass, sorting paper tags labeled lead and proof.'
	},
	{
		id: 'candidate-not-replacement',
		kind: 'candidate',
		eyebrow: 'you only need your slice',
		title: 'Build the 20% You Use',
		point:
			'You may not need a full CleanShot clone. You may need capture, annotate, copy link, and save.',
		visual: {
			stamp: 'your slice',
			items: ['teams', 'cloud', 'libraries', 'templates', 'capture', 'annotate', 'copy link', 'save']
		},
		demo: {
			label: 'Screenshot slice',
			command:
				'gh repo view fayazara/Screendrop --json description,licenseInfo,pushedAt,repositoryTopics,primaryLanguage',
			output: [
				'whole app: teams, cloud, libraries, templates',
				'your slice: capture, annotate, copy link, save',
				'add the one feature you personally want'
			],
			note: 'The power move is not cloning the entire product. It is building the workflow you repeat.'
		},
		eggoPrompt:
			'Transparent-background tactile eggo character holding a screenshot frame, marker pen, upload cloud, and clipboard, arranged like a clean local capture workflow.'
	},
	{
		id: 'thaw-caveat',
		kind: 'candidate',
		eyebrow: 'stale does not mean useless',
		title: 'Old Code Is Raw Material',
		point:
			'Agents change the value of stale repos. A dead project can still contain the UI, permissions, and workflow shape you need.',
		visual: {
			stamp: 'agent repair',
			items: ['stale repo', 'working pattern', 'agent repair', 'your fork']
		},
		demo: {
			label: 'Thaw as material',
			command:
				'gh repo view stonerl/Thaw --json description,licenseInfo,pushedAt,repositoryTopics,stargazerCount',
			output: [
				'stale repo -> useful workflow shape',
				'old Swift project -> modern macOS target',
				'agent reads breakage -> patch the fork'
			],
			note: 'The important part is not adopting Thaw. It is recognizing that stale code can still be useful material.'
		},
		eggoPrompt:
			'Transparent-background tactile eggo character lifting a menu bar icon like a trapdoor, revealing hidden launch, permissions, preferences, and recovery mechanisms underneath.'
	},
	{
		id: 'ask-the-repo',
		kind: 'questions',
		eyebrow: 'remote repos are usable',
		title: 'Yoink Without Cloning',
		point:
			'DeepWiki lets you ask across a repo before it touches your machine. Pull out patterns, commands, and architecture notes, then clone only if needed.',
		visual: {
			stamp: 'remote ingredients',
			items: ['ask repo', 'extract pattern', 'compare approach', 'clone only if needed']
		},
		eggoPrompt:
			'Transparent-background tactile eggo character opening a repo cabinet with drawers labeled README, license, issues, releases, CLI, and config.'
	},
	{
		id: 'agent-first-five',
		kind: 'rubric',
		eyebrow: 'the tool standard changed',
		title: 'Build Tools Agents Can Use',
		point:
			'When agents can drive your tools, the tools become part of the team instead of another thing you have to babysit.',
		visual: {
			stamp: 'agent-ready',
			items: ['human', 'agent', 'tool', 'receipt']
		},
		eggoPrompt:
			'Transparent-background tactile eggo character moving a workflow card from a human handoff lane into an agent control panel with inspect, drive, verify, recover, and exit levers.'
	},
	{
		id: 'cli-handles',
		kind: 'terminal',
		eyebrow: 'the missing half',
		title: 'Tools Need a Feedback Loop',
		point:
			'Agents can send commands, but they also need feedback: current state, previous actions, logs, errors, and proof of success.',
		visual: {
			stamp: 'feedback loop',
			items: ['command', 'state', 'history', 'proof']
		},
		demo: {
			label: 'two-way tool use',
			command: 'cmux identify --json',
			output: [
				'app_cli_path: /Applications/cmux.app/Contents/Resources/bin/cmux',
				'socket_path: ~/.local/state/cmux/cmux-501.sock',
				'workspace_ref, pane_ref, surface_ref, tab_ref'
			],
			note: 'Before an agent can operate a tool reliably, it needs a way to act and a way to read back what happened.'
		},
		eggoPrompt:
			'Transparent-background tactile eggo character attaching physical handles to a terminal window, socket badge, config file, and log stream.'
	},
	{
		id: 'cmux-control-surface',
		kind: 'terminal',
		eyebrow: 'scripts plus agents',
		title: 'Autonomous Workspaces',
		point:
			'When panes can create panes, send messages, read screens, and launch agents, the workspace can start coordinating itself.',
		visual: {
			stamp: 'self-driving',
			items: ['pane creates pane', 'agent reads pane', 'script nudges agent', 'workspace continues']
		},
		demo: {
			label: 'cmux loop',
			command: 'cmux new-pane --direction right --focus false',
			output: [
				'cmux send --surface surface:2 \'codex "read surface:1 and continue"\'',
				'cmux read-screen --surface surface:1 --lines 40',
				'timer -> cmux send --surface surface:2 "status check"',
				'agent reads state -> decides next move'
			],
			note: 'Classic scripts handle timing, routing, and repetition. Agents handle judgment.'
		},
		eggoPrompt:
			'Transparent-background tactile eggo character at a bright control desk with panes, surfaces, browser snapshot tiles, and a socket indicator.'
	},
	{
		id: 'close',
		kind: 'close',
		eyebrow: 'own the workflow, not the app',
		title: 'Own the Workflow',
		point:
			'Apps will change, clones will appear, and agents will get better. The durable thing is the workflow you can inspect, fork, automate, and move.',
		visual: {
			stamp: 'workflow survives',
			receiptMarks: ['app changes', 'repo appears', 'agent adapts', 'workflow survives']
		},
		eggoPrompt:
			'Transparent-background tactile eggo character choosing a simple exposed control panel over a glossy sealed box, with a small checklist for search, test, and control.'
	},
	{
		id: 'resources',
		kind: 'links',
		eyebrow: 'slides and workshop',
		title: 'Keep Building',
		point: 'Scan for the slide source, examples, and deployable repo. The Codex workshop is the deeper follow-up.',
		visual: {
			stamp: 'github.com/johnlindquist/own-the-workflow',
			items: ['Slides repo', 'Codex Power User Workshop'],
			links: [
				'https://github.com/johnlindquist/own-the-workflow',
				'https://egghead.io/workshop/codex'
			]
		},
		eggoPrompt:
			'Transparent-background tactile eggo character holding a QR code placard and pointing toward a workshop sign.'
	}
];

export const getSlideIndex = (id: string) => toolSlides.findIndex((slide) => slide.id === id);
