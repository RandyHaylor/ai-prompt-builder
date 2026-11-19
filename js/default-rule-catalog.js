/**
 * The rule catalog shipped with the page: rule categories, the options each offers, and
 * the presets built from them. Pure data — nothing here knows about the page.
 *
 * A category is one kind of rule. An option is one choice within it: a short name for the
 * menu and the full text that goes into the prompt. A preset is a named, ordered list of
 * {categoryId, optionId} choices.
 *
 * The rule texts are the author's own wording, taken from his planning-system rules and
 * project notes.
 */

export const DEFAULT_RULE_CATEGORIES = [
  {
    categoryId: "naming",
    categoryName: "Naming",
    options: [
      {
        optionId: "verbose-oop",
        shortName: "Verbose OOP",
        fullText:
          "Strive for modular code with clear interfaces designed as part of specs. Name everything for what it IS or what it DOES, in a way that is understandable outside of any app context. This is easy for humans, hard for AI — err on the side of verbosity: a short sentence of a name beats a meaningless name. Names are NEVER for implementation, only for role.\n- You use paper and pencil to map something, but you don't call them a \"mapper tool\". You run a mapping operation and produce a map, yet there was never a mapping tool — only a writing and recording tool.\n- Never brand internal mechanisms with the app name.",
      },
      {
        optionId: "good-clear-naming",
        shortName: "Good clear naming",
        fullText: "Use good clear naming that describes what something does.",
      },
      {
        optionId: "modern-clean",
        shortName: "Modern clean",
        fullText: "Modern clean naming.",
      },
    ],
  },
  {
    categoryId: "testing",
    categoryName: "Testing",
    options: [
      {
        optionId: "no-testing",
        shortName: "No testing",
        fullText: "No testing.",
      },
      {
        optionId: "simple-post-testing",
        shortName: "Simple post testing",
        fullText: "Simple post testing.",
      },
      {
        optionId: "tdd-module-level",
        shortName: "Test first TDD, module level",
        fullText:
          "Real TDD at the interface and module level. These tests are the skeleton's rails, written before delegation.\n- Micro TDD inside a module is at the dev agent's discretion, basic and where it makes sense.\n  - Reason: agents are not good or efficient at the micro TDD humans describe, because few humans do it well and no agent is trained on it done right.\n- Integration tests stay fully real.",
      },
      {
        optionId: "tdd-granular",
        shortName: "Test first TDD, granular",
        fullText: "Test first TDD, granular.",
      },
    ],
  },
  {
    categoryId: "adding-details",
    categoryName: "Adding details",
    options: [
      {
        optionId: "do-not-add-or-change-details",
        shortName: "Do not add or change details",
        fullText:
          "Do not add or change details when translating user direction or information.\n\nThis was clarified when the agent got it wrong twice:\n- User said: be brief\n- Agent wrote: keep it to one line\n  - Wrong\n    - User did not restrict length\n    - Agent added a limit on its own\n- User corrected: never add details or rules I did not state\n- Agent wrote the rule as: record in the user's own words\n  - Wrong again\n    - User did not restrict rewording\n    - User only forbade changing or adding detail\n      - Less constraining than requiring exact words\n- Both mistakes, same mistake\n  - A gap\n  - Filled with the agent's own detail\n  - Presented as if the user had said it\n\nAgents infer and guess far too much. An agent must never add a detail, limit, number, or rule the user did not state. Gaps are named as the agent's own assumption and asked about, or left open. Never quietly turned into a rule.",
      },
    ],
  },
  {
    categoryId: "source-of-truth",
    categoryName: "Source of truth",
    options: [
      {
        optionId: "only-what-you-are-given",
        shortName: "Only what you are given",
        fullText:
          "The only valid information about the work is what you were given. Local code, files, folders, or other agents' work may be referenced as truth only when you are explicitly told you may, and only in the way you are told. \"Look at this folder for reference, do not edit it\" means that and nothing more.",
      },
    ],
  },
  {
    categoryId: "simplicity",
    categoryName: "Simplicity",
    options: [
      {
        optionId: "simplicity-above-all",
        shortName: "Simplicity above all else",
        fullText:
          "Simplicity above all else. Generic containers, one uniform shape, as much plain data as possible. Queue/list based, NOT a state machine — state machines lead to a never ending spiral of complexity.",
      },
    ],
  },
  {
    categoryId: "big-picture-first",
    categoryName: "Hollow before full",
    options: [
      {
        optionId: "hollow-before-full",
        shortName: "Skeleton first",
        fullText:
          "\"If we can't solve the big picture first, how can we hope to build the details?\"\n- Every node is built hollow before it is built full.\n- Hollow means: exists, reachable from its parent, testable from the outside, returns a placeholder.\n  - Module: folder, types, init, stub that returns something.\n  - Document: empty sections, each named.\n  - Any design: its named parts.\n- A section whose content is unknown still exists. Its body says what must be researched to fill it.\n- The skeleton has tests, written first, that pass against the stubs. Hollow = those tests are green.\n- Not every question is answered up front. Placeholders, interfaces, types, and contracts are.\n- Filling is the delegated work. Delegates fill; they never add bones.\n- A missing bone found later is a structural change. Escalates to the top, with the user.",
      },
    ],
  },
  {
    categoryId: "requirement-bands",
    categoryName: "Requirement bands",
    options: [
      {
        optionId: "three-bands",
        shortName: "Firm / design notes / discretion",
        fullText:
          "Sort requirements into three bands:\n- Firm up front: interfaces, types, contracts, modules, names. Built into the skeleton.\n- Design notes: less consequential details, recorded but not binding.\n- Dev agent discretion: decided inside the module, within the parameters above.",
      },
    ],
  },
  {
    categoryId: "work-chunks",
    categoryName: "Work chunks",
    options: [
      {
        optionId: "sprint-features",
        shortName: "Sprint features",
        fullText:
          "Break the work into sprint features. Each one: a strictly defined interface, built as a standalone tool, its own definition of done, its own integration testing, and a deliverable including README, packaging, and example code.",
      },
    ],
  },
  {
    categoryId: "abstraction",
    categoryName: "Abstraction and isolation",
    options: [
      {
        optionId: "abstraction-and-isolation",
        shortName: "Generic, standalone modules",
        fullText:
          "Abstraction: nothing is named or built for its implementation. Modules don't know their consumers wherever that's possible.\n- Example: a module that applies a strategy function to a string is a \"string strategy processor\". It is not a \"customer iData file renamer\", and not even a \"renamer\".\n\nIsolation: any module that can be built as a standalone tool must be.\n- Generic, with no knowledge of the parent project. It may still live in the repo (e.g. a utilities folder).\n- Own documentation, own unit tests, own real integration tests.\n- The point is the isolation discipline, not reuse.",
      },
    ],
  },
  {
    categoryId: "formatting",
    categoryName: "Formatting",
    options: [
      {
        optionId: "specify-formatting",
        shortName: "Specify all formatting",
        fullText:
          "Specify formatting for everything that has a form.\n- Responses and outputs of the thing being built: whitespace, alignment, line endings, trailing newline, header vs body, error message shape.\n- Work products: file layout, naming, commit shape.\n- Documentation: README sections, report structure.\n- A format you do not want to decide is declared discretion, by name. Never silent.",
      },
    ],
  },
  {
    categoryId: "build-to-spec",
    categoryName: "Building to spec",
    options: [
      {
        optionId: "build-to-spec-or-stop",
        shortName: "Build to spec, then stop",
        fullText:
          "Build as much as possible to spec, then stop.\n- A piece that can't be built to spec is left incomplete, never replaced with something else.\n- A roadblock, or a spec found not to work, halts and asks for approval.",
      },
    ],
  },
  {
    categoryId: "escalation",
    categoryName: "Escalation",
    options: [
      {
        optionId: "escalation-is-a-blocker",
        shortName: "An escalation is a blocker",
        fullText:
          "An escalation is a blocker. You post it and you stop. You do not pick.\n- Blocked means: the instruction is silent on something you must decide; a test contradicts another test or the instruction; a piece cannot be built to spec; you need a bone you do not have.\n- One question per escalation: Question / Context (file:line) / Options / Blocking: yes.\n- A question that does not block you is not an escalation. Make the call within your discretion and record it in your report.",
      },
    ],
  },
  {
    categoryId: "questions",
    categoryName: "Asking questions",
    options: [
      {
        optionId: "batch-questions",
        shortName: "Batch questions",
        fullText:
          "Do not work in a pattern of asking the user a question, working, asking a question, working. It is very inefficient.\n\nCollect all of your questions through the research and planning you can do, then ask them all in quick succession (one at a time, with any needed conversation). Then, if needed, do another round of research and construct another list of questions.",
      },
    ],
  },
  {
    categoryId: "offering-options",
    categoryName: "Offering options",
    options: [
      {
        optionId: "research-before-options",
        shortName: "Research before offering options",
        fullText:
          "Research before offering the user options. Asking the user a question is not a substitute for research.",
      },
    ],
  },
  {
    categoryId: "proof",
    categoryName: "Proof",
    options: [
      {
        optionId: "proof-before-reliance-and-done",
        shortName: "Proof before reliance, proof before done",
        fullText:
          "Nothing about a system is known to work the way we think until a real integration test or actual use proves it. No agent moves forward on an assumption about existing behavior; it proves it first.\n\nThe same level of proof is required before any work is called done. Unit tests passing means it is time to integration test, not that the work is finished.\n\n\"Real\" means the way the end consumer uses it: real entry points, real services, real data. Anything mocked or partial needs explicit approval and does not count as proof.",
      },
    ],
  },
  {
    categoryId: "troubleshooting",
    categoryName: "Troubleshooting",
    options: [
      {
        optionId: "research-errors",
        shortName: "Research errors, never guess and retry",
        fullText:
          "When troubleshooting, never fall into a 'try and repeat' loop: failing to research the problem properly and instead testing random guesses with expensive and time-consuming workflows. That can waste hours and hundreds of dollars. You are not authorized to make wild guesses and then run them through CI/CD.\n\nErrors MUST be researched with good generic search terms, NOT niche terms based on your own hypotheses. Searching on your hypothesis is as bad as guessing.",
      },
    ],
  },
  {
    categoryId: "billed-runs",
    categoryName: "Billed runs",
    options: [
      {
        optionId: "research-before-billed-runs",
        shortName: "Research before billed runs",
        fullText:
          "Research and proof of current, accurate references are required for fixes before triggering any testing or building that consumes resources that bill per use.",
      },
    ],
  },
  {
    categoryId: "hand-off",
    categoryName: "Passing info on",
    options: [
      {
        optionId: "pass-on-relevant-information",
        shortName: "Pass on what later work needs",
        fullText:
          "When tasks are done, if they have info that is relevant to the project or other tasks, it always needs to be added to the knowledge base, or to the other tasks if transient. This is an exit criterion for completing a task. Your report includes a hand-off section listing that information.",
      },
    ],
  },
  {
    categoryId: "report",
    categoryName: "Report",
    options: [
      {
        optionId: "full-report",
        shortName: "Status / Built / Tests / …",
        fullText:
          "Your report is complete: Status / Built / Tests (exact commands and the test runner's summary line verbatim) / Deviations / Discretion calls / Open items / Hand-off.",
      },
    ],
  },
  {
    categoryId: "prs",
    categoryName: "Pull requests",
    options: [
      {
        optionId: "stacked-prs-and-review",
        shortName: "Stacked PRs and review",
        fullText:
          "Use stacked PRs where appropriate. Do not stop and wait for a PR to be merged when you could keep working on the branch or stack follow-up PRs.\nBuild PR review requirements into tasks where appropriate. The reviewer is first a newly spawned agent. Worst case, spawn a fork of yourself, or a similar approach.",
      },
    ],
  },
  {
    categoryId: "parallel-work",
    categoryName: "Parallel work",
    options: [
      {
        optionId: "suggest-parallel-work",
        shortName: "Suggest parallel work",
        fullText: "Suggest parallel work to the user wherever it is possible.",
      },
    ],
  },
  {
    categoryId: "repo",
    categoryName: "Repo",
    options: [
      {
        optionId: "suggest-a-repo",
        shortName: "Suggest a repo",
        fullText:
          "Only if nothing is in place: if the work has no repo, suggest one. If one is not wanted, suggest the benefits of at least a local one.",
      },
    ],
  },
];

const WORKER_RULES = [
  { categoryId: "source-of-truth", optionId: "only-what-you-are-given" },
  { categoryId: "adding-details", optionId: "do-not-add-or-change-details" },
  { categoryId: "naming", optionId: "verbose-oop" },
  { categoryId: "abstraction", optionId: "abstraction-and-isolation" },
  { categoryId: "testing", optionId: "tdd-module-level" },
  { categoryId: "build-to-spec", optionId: "build-to-spec-or-stop" },
  { categoryId: "escalation", optionId: "escalation-is-a-blocker" },
  { categoryId: "proof", optionId: "proof-before-reliance-and-done" },
  { categoryId: "troubleshooting", optionId: "research-errors" },
  { categoryId: "billed-runs", optionId: "research-before-billed-runs" },
  { categoryId: "hand-off", optionId: "pass-on-relevant-information" },
  { categoryId: "report", optionId: "full-report" },
];

const PLANNER_RULES = [
  { categoryId: "source-of-truth", optionId: "only-what-you-are-given" },
  { categoryId: "adding-details", optionId: "do-not-add-or-change-details" },
  { categoryId: "simplicity", optionId: "simplicity-above-all" },
  { categoryId: "big-picture-first", optionId: "hollow-before-full" },
  { categoryId: "requirement-bands", optionId: "three-bands" },
  { categoryId: "work-chunks", optionId: "sprint-features" },
  { categoryId: "formatting", optionId: "specify-formatting" },
  { categoryId: "questions", optionId: "batch-questions" },
  { categoryId: "offering-options", optionId: "research-before-options" },
  { categoryId: "parallel-work", optionId: "suggest-parallel-work" },
  { categoryId: "prs", optionId: "stacked-prs-and-review" },
  { categoryId: "repo", optionId: "suggest-a-repo" },
  { categoryId: "troubleshooting", optionId: "research-errors" },
  { categoryId: "hand-off", optionId: "pass-on-relevant-information" },
];

export const DEFAULT_RULE_PRESETS = [
  { presetName: "Worker", entries: WORKER_RULES },
  { presetName: "Planner", entries: PLANNER_RULES },
  {
    presetName: "Small one-off",
    entries: [
      { categoryId: "adding-details", optionId: "do-not-add-or-change-details" },
      { categoryId: "naming", optionId: "good-clear-naming" },
      { categoryId: "testing", optionId: "simple-post-testing" },
      { categoryId: "proof", optionId: "proof-before-reliance-and-done" },
    ],
  },
];
