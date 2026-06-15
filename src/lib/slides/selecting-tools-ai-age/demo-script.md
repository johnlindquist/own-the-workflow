# Selecting Tools in the AI Age Demo Script

Use this as the 20 minute recording track. The slides carry the story; the terminal receipts prove the pattern.

## 0:00-2:00 - Frame the Talk

Say:

> AI changes how software gets built. Open source changes what we can do with that software. The question is no longer just "should I buy this app?" It is "can I own the workflow?"

Point at the opening slides:

- Popular apps are being rebuilt in public.
- Working repos are better ingredients than blank prompts.
- You often only need the 20 percent of the app you repeat every day.

## 2:00-4:00 - The Clone Wave

Say:

> If a tool is useful, expensive, and focused, assume someone is rebuilding the useful part in public.

Use these examples as categories, not heroes:

- dictation tools like SuperWhisper
- screenshot tools like CleanShot
- menu bar utilities like Bartender or Ice
- autocomplete tools like coding assistants and system-wide text completion

Say:

> The repos are not the story. The story is that open-source copies are now part of tool selection.

## 4:00-7:00 - Build From Working Examples

Run:

```bash
gh search repos "cleanshot alternative" --limit 8 \
  --json fullName,description,url,updatedAt,stargazersCount,language
```

Then run:

```bash
gh search repos "superwhisper" --limit 8 --sort updated \
  --json fullName,description,url,updatedAt,stargazersCount,language
```

Say:

> Before I ask an agent to build a thing, I want to know what people already tried. The repo does not have to be in my language. It only has to show a working shape the agent can adapt.

Call out examples only as receipts:

- Swift screenshot apps
- Rust dictation tools
- TypeScript autocomplete projects
- Python local workflow experiments

## 7:00-9:00 - Ingredients Beat Inference

Say:

> AI works better when you give it working patterns to adapt instead of asking it to infer the whole implementation from a blank prompt.

Use the repo examples as ingredients:

- permissions
- UI patterns
- storage paths
- sharing flows

Say:

> The point is not to copy one repo wholesale. The point is to find working patterns you can combine, translate, and reshape.

## 9:00-11:00 - Build the 20% You Use

Run:

```bash
gh repo view fayazara/Screendrop \
  --json nameWithOwner,description,licenseInfo,pushedAt,repositoryTopics,stargazerCount,primaryLanguage
```

Say:

> The useful question is not "can this replace CleanShot?" The useful question is "which part of CleanShot do I actually use?" Capture, annotate, copy link, save. That is a much smaller target.

Say:

> If the repo is close, maybe I use it. If it is missing one feature, maybe I fork it. If it is too much, maybe I build the tiny version I actually need.

## 11:00-12:00 - Old Code Is Raw Material

Run:

```bash
gh repo view stonerl/Thaw \
  --json nameWithOwner,description,licenseInfo,pushedAt,repositoryTopics,stargazerCount
```

Say:

> Thaw is a good example of the new value of old code. An unmaintained project might still have the UI shape, permissions model, install notes, or workflow you want.

Call out:

- stale repo
- working pattern
- agent-assisted repair
- your fork

Say:

> Before agents, stale code was often a dead end. Now it can be raw material. You can ask an agent what broke, update the dependencies, modernize the platform assumptions, and keep the useful workflow alive.

## 12:00-14:00 - Yoink Without Cloning

Show DeepWiki for one or more repos, or narrate the workflow:

```bash
gh repo view FuJacob/cotabby \
  --json nameWithOwner,description,licenseInfo,pushedAt,repositoryTopics,stargazerCount
```

Say:

> DeepWiki means I do not have to clone every maybe. I can ask a repo questions while it is still remote, pull out the useful ingredients, and compare how multiple projects solve the same problem.

DeepWiki question prompts to show or say:

- "How does this repo handle capture?"
- "Where is state stored?"
- "What commands or scripts matter?"
- "How does this compare to the other screenshot repos?"

Say:

> GitHub CLI gives me the candidates. DeepWiki turns remote repos into ingredients. Then I clone only the repo that earns it.

## 14:00-15:00 - Build Tools Agents Can Use

Say:

> Now the tool standard changes. If agents are part of how we build, we should build and choose tools that agents can use too.

Point at the slide checklist:

- human
- agent
- tool
- receipt

Say:

> When agents can drive your tools, the tool becomes part of the team instead of another thing you have to babysit.

## 15:00-16:00 - Tools Need a Feedback Loop

Say:

> Sending commands is not enough. Agents also need to read back what happened: state, history, logs, errors, and proof of success.

Point at the slide checklist:

- command
- state
- history
- proof

Say:

> This is the setup for cmux. It is not just that an agent can send text into a pane. It can identify the target, read the screen, inspect state, and confirm the result.

## 16:00-19:00 - Autonomous Workspaces

Run:

```bash
cmux identify --json
```

Say:

> cmux is the kind of open-source tool I want more of. It exposes identity: app path, socket path, workspace refs, pane refs, surface refs. That gives agents a way to know where they are.

Run:

```bash
cmux --help
```

Point to:

- `tree`
- `list-panes`
- `read-screen`
- `send`
- `new-pane`
- `new-surface`
- `set-status`
- `set-progress`

Then show the autonomous loop:

```bash
cmux new-pane --direction right --focus false
cmux send --surface surface:2 'codex "read surface:1 and continue the task"'
cmux read-screen --surface surface:1 --lines 40
```

Say:

> This is where cmux becomes more than a terminal manager. A pane can create another pane, launch an agent, and that agent can read the pane that opened it.

Show the classic scripting plus agents pattern:

```bash
while true; do
  cmux send --surface surface:2 'status check: read the parent pane and summarize progress'
  sleep 300
done
```

Say:

> Classic scripts are good at timing, routing, and repetition. Agents are good at judgment. cmux lets both share the same workspace, so the workspace can start coordinating itself.

## 19:00-20:00 - Close

Say:

> Apps will change, clones will appear, and agents will get better. The durable thing is the workflow you can inspect, fork, automate, and move.

Close on:

- app changes
- repo appears
- agent adapts
- workflow survives

## Cut Lines

If time is tight:

- Cut the detailed Cotabby contrast first.
- Cut the extra voice-dictation repo list second.
- Do not cut the GitHub CLI search, DeepWiki inspection, or cmux CLI demo.

## Safety Notes

- Do not present the example repos as official recommendations.
- Treat star counts and updated dates as sampled evidence, not durable claims.
- Keep saying "use, fork, or build" instead of "replace everything."
