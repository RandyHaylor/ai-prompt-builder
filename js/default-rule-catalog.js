/**
 * The rule catalog shipped with the page: rule categories, the options each offers, and
 * the presets built from them. Pure data — nothing here knows about the page.
 *
 * A category is one kind of rule. An option is one choice within it: a short name for the
 * menu and the full text that goes into the prompt. A preset is a named, ordered list of
 * {categoryId, optionId, enabled} choices; a rule that is off stays in the list but is
 * left out of the text.
 */

const category = (categoryId, categoryName, options) => ({
  categoryId,
  categoryName,
  options: options.map(([optionId, shortName, fullText]) => ({ optionId, shortName, fullText })),
});

export const DEFAULT_RULE_CATEGORIES = [
  category("task-research", "Task: Research", [
    ["research-findings-with-sources", "Findings with sources",
      "This task is research. Find out; do not build or change anything.\n- Use current, official sources first. Search with good generic terms, not terms built on your own guess.\n- Every finding carries its source.\n- Separate what is established from what is likely and what is unknown.\n- End with the answer to the question asked, then what would settle anything left open."],
    ["research-compare-options", "Compare options",
      "This task is research into options. Find the realistic options, and for each: what it is, what it costs, what it is good and bad at, and its source. End with a side-by-side comparison. Do not choose for the user unless asked."],
    ["research-quick-answer", "Quick answer",
      "This task is a quick lookup. Find the answer from a reliable source, give it with the source, and stop."],
  ]),
  category("task-tech-spike", "Task: Tech spike", [
    ["spike-throwaway-proof", "Throwaway proof",
      "This task is a tech spike: prove one thing works, as fast and small as possible, before real work depends on it.\n- State the question the spike answers before starting.\n- Throwaway code, done in isolation in its own space. Never the start of the real build.\n- Proof is demonstrated: the command and its output, or screenshots. Where you cannot honestly validate the result yourself (video, motion, feel), say so and ask for a human check.\n- End with: the answer (works / does not work / partly), the proof, and what the real build must know."],
    ["spike-keepable-prototype", "Keepable prototype",
      "This task is a tech spike whose code may be kept: prove the thing works with a small, clean prototype that the real build can grow from. Show the proof, and list what would need to change to make it production quality."],
  ]),
  category("task-bug-fix", "Task: Bug fix", [
    ["bug-reproduce-first", "Reproduce, find cause, fix",
      "This task is a bug fix.\n- Reproduce the bug first and show the reproduction.\n- Find the cause with evidence before changing anything. Do not guess-and-retry.\n- Fix the cause, not the symptom. No workarounds around the defect.\n- Add a test that fails without the fix and passes with it.\n- Change nothing unrelated to the bug."],
    ["bug-quick-fix", "Quick fix",
      "This task is a quick bug fix: find the likely cause, fix it, and show that the problem no longer happens."],
  ]),
  category("task-code-review", "Task: Code review", [
    ["review-against-requirements", "Against the requirements",
      "This task is a review. Change nothing.\n- Check the work against what was asked and its definition of done, item by item.\n- Verify claims yourself: read the code, run the tests and the program. A claim you cannot verify counts as not met.\n- For each item: met or not met, with the evidence.\n- List defects by severity, each with file and line."],
    ["review-quick-read", "Quick read-through",
      "This task is a quick review: read the change and point out anything clearly wrong or risky. Change nothing."],
  ]),
  category("source-of-truth", "Source of truth", [
    ["only-what-you-are-given", "Only what you are given",
      "The only valid information about the work is what you were given. Local code, files, folders, or other agents' work may be referenced as truth only when you are explicitly told you may, and only in the way you are told. \"Look at this folder for reference, do not edit it\" means that and nothing more."],
    ["official-researched-truths", "Official researched truths",
      "Treat as true only what you have confirmed from current official sources — the official documentation, specifications, release notes or issue tracker of the thing in question — or proved by running it yourself. What you remember from training is a hypothesis until checked. Say where each fact came from."],
    ["explore-freely", "Explore freely",
      "Read anything in the project or environment that helps."],
  ]),

  category("adding-details", "Adding details", [
    ["do-not-add-or-change-details", "Do not add or change details",
      "Do not add or change details when translating user direction or information.\n\nThis was clarified when the agent got it wrong twice:\n- User said: be brief\n- Agent wrote: keep it to one line\n  - Wrong\n    - User did not restrict length\n    - Agent added a limit on its own\n- User corrected: never add details or rules I did not state\n- Agent wrote the rule as: record in the user's own words\n  - Wrong again\n    - User did not restrict rewording\n    - User only forbade changing or adding detail\n      - Less constraining than requiring exact words\n- Both mistakes, same mistake\n  - A gap\n  - Filled with the agent's own detail\n  - Presented as if the user had said it\n\nAgents infer and guess far too much. Never add a detail, limit, number, or rule the user did not state. Gaps are named as your own assumption and asked about, or left open. Never quietly turned into a rule."],
    ["fill-gaps-and-list-them", "Fill gaps, list assumptions",
      "Fill small gaps with sensible choices. List every assumption you made at the end."],
    ["use-judgement", "Use your judgement",
      "Where the instructions are silent, decide for yourself and keep going."],
  ]),

  category("scope", "Scope adherence", [
    ["strict-scope", "Strict scope",
      "Do exactly what was asked — no more, no less.\n- Nothing outside the stated scope is changed, added, cleaned up or \"improved\", however tempting.\n- Build as much as possible to spec, then stop. A piece that can't be built to spec is left incomplete, never replaced with something else.\n- A roadblock, or a spec found not to work, halts the work and asks for approval.\n- Anything you notice outside the scope is reported, not acted on."],
    ["scope-with-reported-extras", "Scope, plus small fixes reported",
      "Stay within the stated scope. Small, clearly related fixes you come across may be made, and each one is listed in your response."],
    ["closest-working-version", "Closest working version",
      "If something cannot be built as specified, build the closest working version and say what differs."],
  ]),

  category("escalation", "When blocked", [
    ["escalation-is-a-blocker", "An escalation is a blocker",
      "An escalation is a blocker. You post it and you stop. You do not pick.\n- Blocked means: the instruction is silent on something you must decide; a test contradicts another test or the instruction; a piece cannot be built to spec; you need something you were not given.\n- One question per escalation: Question / Context (file:line) / Options / Blocking: yes.\n- A question that does not block you is not an escalation. Make the call within your discretion and record it in your response."],
    ["handle-only-within-scope", "Handle it only if in scope",
      "When something blocks you, resolve it yourself only if you can do so while staying strictly within the stated scope. If resolving it would mean changing anything outside the scope, or deciding something the instructions leave open, stop and ask."],
    ["decide-and-note", "Decide and note it",
      "When unsure, make the call, keep going, and list the calls you made in your response."],
    ["ask-freely", "Ask whenever unsure",
      "Ask whenever you are unsure, and wait for the answer."],
  ]),

  category("naming", "Naming", [
    ["verbose-oop", "Verbose OOP",
      "Name everything for what it IS or what it DOES — NEVER for how it is implemented and never for where it happens to be used.\n- Name for role, not implementation: `retry_with_backoff`, not `loop_helper`; `customer_lookup`, not `redis_cache_wrapper`.\n- Name for what it is, not who uses it: a function that applies a rule to a string is a `string_rule_applier`, even if today only the checkout page calls it.\n- You use paper and pencil to map something, but you don't call them a \"mapper tool\". You run a mapping operation and produce a map — the tools are a writing and recording tool.\n- Understandable outside of any app context. Never brand internals with the app or product name.\n- Err on the side of verbosity: a short sentence of a name beats a meaningless one."],
    ["modern-clean", "Modern clean",
      "Short, clean, idiomatic names in the style of the language and framework in use."],
    ["match-the-codebase", "Match the codebase",
      "Name things the way the existing codebase already does."],
  ]),

  category("modularity", "Modularity", [
    ["generic-standalone-modules", "Generic, standalone modules",
      "Build each separable piece as a generic, standalone module.\n- It knows nothing about the project that uses it: no project names, no project-specific assumptions, no reaching into the caller's data.\n- It has a small, explicit interface, and could be lifted into another project unchanged.\n- It has its own short documentation and its own tests.\n- Keep project-specific glue thin and separate from the modules it connects."],
    ["clear-interfaces", "Clear interfaces only",
      "Split the work into parts with small, explicit interfaces. Parts may know about the project; they must not reach into each other's internals."],
    ["abstract-on-second-use", "Abstract on second use",
      "Abstract only when there is a second use. Keep code close to where it is used."],
  ]),

  category("simplicity", "Simplicity", [
    ["simplicity-above-all", "Simplicity above all else",
      "Simplicity above all else. Generic pieces, one uniform shape, as much plain data as possible. Lists and queues, NOT state machines — state machines lead to a never ending spiral of complexity. A new behaviour is expressed with the pieces that already exist, not with a new special case."],
    ["conventional-patterns", "Conventional patterns",
      "Use the established patterns and frameworks for this kind of project, even when they are heavier."],
  ]),

  category("structure", "Structure first", [
    ["hollow-before-full", "Hollow before full",
      "\"If we can't solve the big picture first, how can we hope to build the details?\"\n- Build every part hollow before building it full: it exists, is reachable, is testable from the outside, and returns a placeholder.\n- Interfaces, types and names are decided in the hollow version. A part whose content is unknown still exists; it says what must be found out to fill it.\n- Tests of the interfaces are written first and pass against the placeholders.\n- Filling in never adds new structure. Missing structure found later is a design change and goes back to the user."],
    ["vertical-slices", "Thin working slices",
      "Build one thin slice that works end to end, then extend it."],
    ["just-build-it", "Just build it",
      "Build it in whatever order makes sense to you."],
  ]),

  category("requirement-bands", "Requirement bands", [
    ["three-bands", "Firm / design notes / discretion",
      "Sort requirements into three bands:\n- Firm up front: interfaces, types, contracts, modules, names.\n- Design notes: less consequential details, recorded but not binding.\n- Your discretion: decided inside a part, within the firm band."],
    ["all-firm", "Everything is firm",
      "Every requirement given is firm."],
  ]),

  category("work-chunks", "Breaking down work", [
    ["sprint-features", "Sprint features",
      "Break the work into sprint features. Each one: a strictly defined interface, built as a standalone tool, its own definition of done, its own integration testing, and a deliverable including README, packaging, and example code."],
    ["small-tasks", "Small tasks",
      "Break the work into small tasks, each finishable in one sitting."],
    ["one-piece", "One piece",
      "Do the work as one piece; do not break it down."],
  ]),

  category("testing", "Testing", [
    ["no-testing", "No testing",
      "Do not write tests."],
    ["simple-post-testing", "Simple post testing",
      "Test what you've made to ensure it works: run it the way it will actually be used and check the result."],
    ["tdd-module-level", "Test first TDD, module level",
      "Test-first, at the interface and module level, using automated tests wherever at all possible, kept in a git repository (or similar version control) alongside the code.\n- The tests for each module's interface are written first, fail, then pass once the module is built.\n- Finer-grained tests inside a module are at your discretion, where they make sense.\n- Integration tests stay fully real: real entry points, real services, real data. Passing unit tests means it is time to integration test, not that the work is done."],
    ["tdd-granular", "Test first TDD, granular",
      "Strict test-first TDD at every level, using automated tests wherever at all possible, kept in a git repository (or similar version control) alongside the code: one failing test per behaviour, make it pass, refactor, commit."],
  ]),

  category("formatting", "Formatting", [
    ["specify-formatting", "Specify all formatting",
      "Specify formatting for everything that has a form.\n- Outputs of the thing being built: whitespace, alignment, line endings, headers, error message shape.\n- Work products: file layout, naming, commit shape.\n- Documentation: README sections, report structure.\n- A format you do not want to decide is declared discretion, by name. Never silent."],
    ["follow-existing-formatting", "Follow existing conventions",
      "Format things the way the project already does."],
    ["formatting-is-discretion", "Your discretion",
      "Formatting is at your discretion."],
  ]),

  category("questions", "Asking questions", [
    ["batch-questions", "Batch questions",
      "Do not work in a pattern of asking the user a question, working, asking a question, working. It is very inefficient.\n\nCollect all of your questions through the research and planning you can do, then ask them all in quick succession (one at a time, with any needed conversation). Then, if needed, do another round of research and construct another list of questions."],
    ["ask-as-they-come", "Ask as they come up",
      "Ask questions as they come up."],
  ]),

  category("offering-options", "Offering options", [
    ["research-before-options", "Research before offering options",
      "Research before offering the user options. Asking the user a question is not a substitute for research."],
    ["options-early", "Offer options early",
      "Offer options early; research the one the user picks."],
  ]),

  category("troubleshooting", "Troubleshooting", [
    ["research-errors", "Research errors, never guess and retry",
      "When troubleshooting, never fall into a 'try and repeat' loop: failing to research the problem properly and instead testing random guesses with expensive and time-consuming workflows. That can waste hours and hundreds of dollars. You are not authorized to make wild guesses and then run them through CI/CD.\n\nErrors MUST be researched with good generic search terms, NOT niche terms based on your own hypotheses. Searching on your hypothesis is as bad as guessing."],
    ["quick-experiments", "Quick experiments first",
      "Try quick, cheap experiments to narrow the problem down. Research if they do not settle it."],
  ]),

  category("billed-runs", "Paid runs", [
    ["explicit-permission", "Explicit permission",
      "Never start anything that costs money per use (paid API calls, cloud builds, paid CI minutes, model usage) without the user's explicit permission for that specific run."],
    ["research-first", "Research first",
      "Research and proof of current, accurate references are required for fixes before triggering any testing or building that consumes resources that bill per use."],
    ["research-then-permission", "Research, then permission",
      "Before anything that costs money per use: research and prove the fix against current references first, then present what you will run and why, and wait for the user's permission."],
    ["judgement-within-limit", "Best judgement within a limit",
      "Use your best judgement on paid runs, within this limit: [time / usage / cost limit]. Stop and ask before going past it."],
    ["no-billed-run-limits", "No restriction",
      "No restriction on runs that cost money per use."],
  ]),

  category("documentation", "Documentation", [
    ["no-documentation", "None",
      "Do not write documentation."],
    ["keep-docs-in-sync", "Keep existing docs in sync",
      "Write no new documents, but update any existing documentation your change makes wrong, in the same change."],
    ["readme-for-what-you-build", "README for what you build",
      "Everything you build gets a README: what it is, how to run or use it, and a short example. Keep existing docs in sync with your changes."],
    ["full-documentation", "Full documentation",
      "Document as you build:\n- A README for each part: what it is, how to use it, examples.\n- Its interface: inputs, outputs, errors.\n- The decisions made and why, where someone changing it later would look.\n- Existing docs updated in the same change that makes them wrong."],
  ]),

  category("response-format", "Response format", [
    ["full-report", "Full report",
      "Respond with: Status / Built / Tests (exact commands and the test runner's summary line verbatim) / Deviations / Discretion calls / Open items."],
    ["wiki-style", "Wiki style",
      "Respond wiki style: a short title, then headings, each followed by terse indented bullets. Each level reads on its own; deeper levels add detail. No prose paragraphs."],
    ["slides-style", "Slide style",
      "Respond like a slide deck: a few short sections, each with a title line and three to five bullets of a few words each."],
    ["tldr", "TL;DR",
      "Start with a TL;DR of one or two sentences. Then the detail, kept short."],
    ["takeaway-only", "Takeaway only",
      "Give only the takeaway: the answer or result, in one or two sentences. No explanation unless asked."],
    ["condensed", "Condensed",
      "Condensed format: nested fragments, zero filler, zero facts lost. Higher levels tell the story with outcomes, not bare topics. Bullets and headers in the destination's normal syntax. Blank lines between groups. Over three top-level items: open with a one or two sentence lead."],
  ]),

  category("prs", "Pull requests", [
    ["stacked-prs-and-review", "Stacked PRs and review",
      "Use stacked PRs where appropriate. Do not stop and wait for a PR to be merged when you could keep working on the branch or stack follow-up PRs.\nBuild PR review requirements into tasks where appropriate. The reviewer is first a newly spawned agent. Worst case, spawn a fork of yourself, or a similar approach."],
    ["single-pr", "One PR at the end",
      "Open one pull request when the work is finished."],
    ["commit-directly", "Commit directly",
      "Commit directly to the working branch; no pull requests."],
  ]),

  category("parallel-work", "Parallel work", [
    ["suggest-parallel-work", "Suggest parallel work",
      "Suggest parallel work to the user wherever it is possible."],
    ["sequential", "One thing at a time",
      "Do the work in sequence, one thing at a time."],
  ]),

  category("repo", "Repository", [
    ["suggest-a-repo", "Suggest a repo",
      "Only if nothing is in place: if the work has no repo, suggest one. If one is not wanted, suggest the benefits of at least a local one."],
    ["no-repo", "No repo",
      "No repository."],
  ]),
];

const on = (categoryId, optionId) => ({ categoryId, optionId, enabled: true });
const off = (categoryId, optionId) => ({ categoryId, optionId, enabled: false });

/**
 * Example custom text for each preset: where the user says what they actually want done,
 * turning the ruleset into a specific prompt. Placed at the end unless stated.
 */
const EXAMPLE_CUSTOM_TEXT_BY_PRESET = {
  "Quick developer":
    "Task: add a \"copy to clipboard\" button next to each code block on the docs page.",
  "Careful developer":
    "Task: build a command-line tool that takes a folder of CSV files and merges them into one, matching columns by header name. It must handle files with missing columns and report rows it could not merge.",
  "Careful dev manager":
    "Goal: plan and run the work to add user accounts (sign up, sign in, password reset) to the existing web app. Break it into sprint features, propose the plan to me before any building starts, and suggest what can run in parallel.",
  "Task: Research":
    "Question: which open-source libraries can render Markdown to PDF from Python today, and which of them keep code-block syntax highlighting?",
  "Task: Tech spike":
    "Spike question: can a three.js scene render 10,000 animated sprites at 60 fps in a mobile browser?",
  "Task: Bug fix":
    "Bug: after sign-in, users are sent back to the home page instead of the page they came from. Reported on the mobile site only.",
  "Task: Code review":
    "Review: the pull request that adds CSV export to the reports page. The requirements are in the linked issue.",
  "Worker":
    "Your task: implement the parser module described in the plan, against the interface and tests already in the skeleton.",
  "Planner":
    "Plan: a small web app where a team can post and vote on lunch options. Work through it with me before anything is built.",
  "Small one-off":
    "Rename the `data` folder to `input_files` and update every reference to it.",
};

/** The preset selected when the page opens. */
export const PRESET_SELECTED_WHEN_THE_PAGE_OPENS = "Careful developer";

export const DEFAULT_RULE_PRESETS = [
  {
    presetName: "Quick developer",
    entries: [
      on("source-of-truth", "explore-freely"),
      on("adding-details", "fill-gaps-and-list-them"),
      on("scope", "strict-scope"),
      on("escalation", "decide-and-note"),
      on("naming", "modern-clean"),
      on("modularity", "abstract-on-second-use"),
      on("structure", "just-build-it"),
      on("testing", "simple-post-testing"),
      on("troubleshooting", "quick-experiments"),
      on("offering-options", "options-early"),
      on("billed-runs", "explicit-permission"),
      on("documentation", "keep-docs-in-sync"),
      on("response-format", "tldr"),
    ],
  },
  {
    presetName: "Careful developer",
    entries: [
      on("source-of-truth", "official-researched-truths"),
      on("adding-details", "do-not-add-or-change-details"),
      on("scope", "strict-scope"),
      on("escalation", "escalation-is-a-blocker"),
      on("questions", "batch-questions"),
      on("offering-options", "research-before-options"),
      on("simplicity", "simplicity-above-all"),
      on("structure", "hollow-before-full"),
      on("requirement-bands", "three-bands"),
      on("work-chunks", "sprint-features"),
      on("naming", "verbose-oop"),
      on("modularity", "generic-standalone-modules"),
      on("formatting", "specify-formatting"),
      on("testing", "tdd-module-level"),
      on("troubleshooting", "research-errors"),
      on("billed-runs", "research-then-permission"),
      on("documentation", "full-documentation"),
      on("repo", "suggest-a-repo"),
      on("response-format", "full-report"),
    ],
  },
  {
    presetName: "Careful dev manager",
    entries: [
      on("source-of-truth", "official-researched-truths"),
      on("adding-details", "do-not-add-or-change-details"),
      on("scope", "strict-scope"),
      on("questions", "batch-questions"),
      on("offering-options", "research-before-options"),
      on("simplicity", "simplicity-above-all"),
      on("structure", "hollow-before-full"),
      on("requirement-bands", "three-bands"),
      on("work-chunks", "sprint-features"),
      on("formatting", "specify-formatting"),
      on("naming", "verbose-oop"),
      on("modularity", "generic-standalone-modules"),
      on("testing", "tdd-module-level"),
      on("parallel-work", "suggest-parallel-work"),
      on("prs", "stacked-prs-and-review"),
      on("repo", "suggest-a-repo"),
      on("billed-runs", "research-then-permission"),
      on("documentation", "full-documentation"),
      on("escalation", "escalation-is-a-blocker"),
      on("response-format", "wiki-style"),
    ],
  },
  {
    presetName: "Task: Research",
    entries: [
      on("task-research", "research-findings-with-sources"),
      on("source-of-truth", "official-researched-truths"),
      on("adding-details", "do-not-add-or-change-details"),
      on("scope", "strict-scope"),
      on("troubleshooting", "research-errors"),
      on("billed-runs", "explicit-permission"),
      on("response-format", "wiki-style"),
    ],
  },
  {
    presetName: "Task: Tech spike",
    entries: [
      on("task-tech-spike", "spike-throwaway-proof"),
      on("source-of-truth", "official-researched-truths"),
      on("scope", "strict-scope"),
      on("escalation", "decide-and-note"),
      on("structure", "just-build-it"),
      on("testing", "simple-post-testing"),
      on("troubleshooting", "research-errors"),
      on("billed-runs", "research-then-permission"),
      on("response-format", "tldr"),
    ],
  },
  {
    presetName: "Task: Bug fix",
    entries: [
      on("task-bug-fix", "bug-reproduce-first"),
      on("source-of-truth", "official-researched-truths"),
      on("scope", "strict-scope"),
      on("escalation", "handle-only-within-scope"),
      on("troubleshooting", "research-errors"),
      on("testing", "simple-post-testing"),
      on("billed-runs", "research-then-permission"),
      on("documentation", "keep-docs-in-sync"),
      on("response-format", "full-report"),
    ],
  },
  {
    presetName: "Task: Code review",
    entries: [
      on("task-code-review", "review-against-requirements"),
      on("source-of-truth", "only-what-you-are-given"),
      on("adding-details", "do-not-add-or-change-details"),
      on("naming", "verbose-oop"),
      on("modularity", "generic-standalone-modules"),
      on("response-format", "full-report"),
    ],
  },
  {
    presetName: "Worker",
    entries: [
      on("source-of-truth", "only-what-you-are-given"),
      on("adding-details", "do-not-add-or-change-details"),
      on("scope", "strict-scope"),
      on("escalation", "escalation-is-a-blocker"),
      on("naming", "verbose-oop"),
      on("modularity", "generic-standalone-modules"),
      on("testing", "tdd-module-level"),
      on("troubleshooting", "research-errors"),
      on("billed-runs", "research-then-permission"),
      on("documentation", "readme-for-what-you-build"),
      on("response-format", "full-report"),
      off("prs", "stacked-prs-and-review"),
    ],
  },
  {
    presetName: "Planner",
    entries: [
      on("source-of-truth", "official-researched-truths"),
      on("adding-details", "do-not-add-or-change-details"),
      on("simplicity", "simplicity-above-all"),
      on("structure", "hollow-before-full"),
      on("requirement-bands", "three-bands"),
      on("work-chunks", "sprint-features"),
      on("formatting", "specify-formatting"),
      on("questions", "batch-questions"),
      on("offering-options", "research-before-options"),
      on("parallel-work", "suggest-parallel-work"),
      on("prs", "stacked-prs-and-review"),
      on("repo", "suggest-a-repo"),
      on("response-format", "wiki-style"),
    ],
  },
  {
    presetName: "Small one-off",
    entries: [
      on("adding-details", "do-not-add-or-change-details"),
      on("scope", "strict-scope"),
      on("escalation", "handle-only-within-scope"),
      on("naming", "verbose-oop"),
      on("testing", "simple-post-testing"),
      on("response-format", "tldr"),
    ],
  },
];

for (const preset of DEFAULT_RULE_PRESETS) {
  const exampleText = EXAMPLE_CUSTOM_TEXT_BY_PRESET[preset.presetName];
  if (exampleText) preset.customText = { text: exampleText, placement: "end", enabled: true };
}
