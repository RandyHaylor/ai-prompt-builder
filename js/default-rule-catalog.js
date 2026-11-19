/**
 * The rule catalog shipped with the page: rule categories, the options each offers, and
 * the presets built from them. Pure data — nothing here knows about the page.
 *
 * A category is one kind of rule ("Naming convention"). An option is one choice within
 * it: a short name for the menu and the full text that is put into the prompt.
 * A preset is a named, ordered list of {categoryId, optionId} choices.
 */

export const DEFAULT_RULE_CATEGORIES = [
  {
    categoryId: "naming-convention",
    categoryName: "Naming convention",
    options: [
      {
        optionId: "verbose-role-based",
        shortName: "Verbose, named for role",
        fullText:
          "Name everything for what it IS or what it DOES, in a way that is understandable outside of any app context. Err on the side of verbosity: a short sentence of a name beats a meaningless one. Names are never for the implementation, only for the role. Never brand internal mechanisms with the app's name.",
      },
      {
        optionId: "modern-clean",
        shortName: "Modern clean",
        fullText:
          "Use short, clear, idiomatic names that follow the conventions of the language and framework in use. Prefer one well-chosen word over several. Avoid abbreviations that are not standard in the ecosystem.",
      },
      {
        optionId: "match-existing-codebase",
        shortName: "Match the existing codebase",
        fullText:
          "Follow the naming already used in the codebase. Read neighbouring code first and name new things the same way, even where you would choose differently.",
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
        fullText: "Do not write tests for this work.",
      },
      {
        optionId: "simple-post-testing",
        shortName: "Simple post testing",
        fullText:
          "After building, write a small number of tests that exercise the main paths through the real entry points. Run them and report the command and its summary line.",
      },
      {
        optionId: "tdd-module-level",
        shortName: "Test first (TDD), module level",
        fullText:
          "Write the tests for each module's interface first, before the module, and see them fail. Then build until they pass. Inside a module, finer-grained tests are at your discretion where they make sense. Integration tests stay fully real: real entry points, real services, real data.",
      },
      {
        optionId: "tdd-granular",
        shortName: "Test first (TDD), granular",
        fullText:
          "Strict test-driven development: for every unit of behaviour, write one failing test, make it pass with the least code, then refactor. Commit at each green step.",
      },
    ],
  },
  {
    categoryId: "modularity",
    categoryName: "Modularity",
    options: [
      {
        optionId: "standalone-tools",
        shortName: "Standalone tools",
        fullText:
          "Any module that can be built as a standalone tool must be: generic, with no knowledge of the parent project; its own documentation, its own tests, its own real integration tests. Modules do not know their consumers wherever that is possible. The point is the isolation discipline, not reuse.",
      },
      {
        optionId: "clear-interfaces",
        shortName: "Clear interfaces",
        fullText:
          "Split the work into modules with small, explicit interfaces. Keep each module's internals private and depend only on the interfaces of others.",
      },
      {
        optionId: "single-file-is-fine",
        shortName: "Keep it in one place",
        fullText:
          "Do not split this into modules unless it clearly needs it. A single well-organised file is preferred for work this size.",
      },
    ],
  },
  {
    categoryId: "requirements-fidelity",
    categoryName: "Following instructions",
    options: [
      {
        optionId: "never-add-details",
        shortName: "Never add or change details",
        fullText:
          "Never add a detail, a limit, a number or a rule that was not stated. Where something is genuinely undecided and must be filled, say so, mark it as your own assumption, and ask. Do not quietly turn an assumption into a rule.",
      },
      {
        optionId: "build-to-spec-or-stop",
        shortName: "Build to spec or leave incomplete",
        fullText:
          "Build as much as possible to spec, then stop. A piece that cannot be built to spec is left incomplete, never replaced with something else. A roadblock, or a spec found not to work, halts the work and asks for a decision.",
      },
      {
        optionId: "use-judgement",
        shortName: "Use your judgement",
        fullText:
          "Where the instructions are silent, make reasonable choices and keep going. List the choices you made at the end.",
      },
    ],
  },
  {
    categoryId: "proof-of-done",
    categoryName: "Proof before done",
    options: [
      {
        optionId: "real-use-proof",
        shortName: "Proven the way it will be used",
        fullText:
          "Nothing is done until it is proven the way the end user will use it: real entry points, real services, real data. Unit tests passing means it is time to integration test, not that the work is finished. Anything mocked or partial does not count as proof.",
      },
      {
        optionId: "tests-pass",
        shortName: "Tests pass",
        fullText: "The work is done when its tests pass. Report the test command and its summary line.",
      },
    ],
  },
  {
    categoryId: "troubleshooting",
    categoryName: "Troubleshooting",
    options: [
      {
        optionId: "research-dont-guess",
        shortName: "Research, never guess and retry",
        fullText:
          "Never fall into a try-and-repeat loop of testing random guesses. Errors must be researched with good generic search terms, not niche terms built on your own hypothesis. Find the cause with evidence before changing anything.",
      },
      {
        optionId: "stop-when-answered",
        shortName: "Stop digging once answered",
        fullText:
          "State what a search or check is meant to find before running it. The moment a result gives the concrete answer, stop and act on it.",
      },
    ],
  },
  {
    categoryId: "structure-first",
    categoryName: "Structure first",
    options: [
      {
        optionId: "skeleton-and-tests-first",
        shortName: "Skeleton and tests first",
        fullText:
          "Build the hollow skeleton before filling anything in: every part exists, is reachable, is testable from the outside, and returns a placeholder. Interfaces, types and names are decided here. Tests of the interfaces are written first and pass against the placeholders. Filling is later work and never adds new structure.",
      },
      {
        optionId: "build-incrementally",
        shortName: "Build incrementally",
        fullText: "Build one working piece at a time, end to end, and extend from there.",
      },
    ],
  },
  {
    categoryId: "reporting",
    categoryName: "Reporting back",
    options: [
      {
        optionId: "terse-structured",
        shortName: "Terse and structured",
        fullText:
          "Report briefly, in indented lists rather than prose. Lead with the outcome. Say plainly what was and was not checked.",
      },
      {
        optionId: "full-report",
        shortName: "Full report",
        fullText:
          "End with a report: Status / Built / Tests (exact commands and the runner's summary line, verbatim) / Deviations / Decisions made within your discretion / Open items / What later work needs to know.",
      },
    ],
  },
  {
    categoryId: "escalation",
    categoryName: "When blocked",
    options: [
      {
        optionId: "escalation-is-a-blocker",
        shortName: "Stop and ask, one question",
        fullText:
          "An escalation is a blocker: you post it and you stop. You do not pick. Blocked means the instructions are silent on something you must decide, two requirements contradict, a piece cannot be built to spec, or you need structure you do not have. Ask one question at a time: Question / Context (file:line) / Options. A question that does not block you is not an escalation: make the call within your discretion and record it.",
      },
      {
        optionId: "decide-and-record",
        shortName: "Decide and record it",
        fullText:
          "When something is undecided, choose the most reasonable option, keep going, and record the decision and the alternatives in your report.",
      },
    ],
  },
  {
    categoryId: "design-authority",
    categoryName: "Design authority",
    options: [
      {
        optionId: "architect-decides",
        shortName: "The architect decides",
        fullText:
          "The design is not yours to alter. Your technical knowledge is input, not a verdict. Never replace the stated approach with your own, never invent needs that were not stated, and never take a departure from the stated paradigm on your own authority — however small or locally sensible. Bring it as a question, with options and trade-offs, before building it.",
      },
      {
        optionId: "own-the-quality",
        shortName: "Own the quality, propose freely",
        fullText:
          "Own the quality of the result: find defects yourself, verify on the real path, fix root causes, and say plainly what is still weak. Bring proposals of any size, including architectural ones — but a proposal is the owner's to accept; do not silently redesign.",
      },
      {
        optionId: "full-latitude",
        shortName: "Full latitude",
        fullText: "You may choose the design and approach yourself. Explain the main choices at the end.",
      },
    ],
  },
  {
    categoryId: "simplicity",
    categoryName: "Simplicity",
    options: [
      {
        optionId: "new-behaviour-is-data",
        shortName: "New behaviour is data, not mechanism",
        fullText:
          "Simplicity above all else. A new behaviour is expressed with what already exists — another ordinary item of the existing kind, placed where the existing rules handle it — never a special case with its own fields, branches or side records. Before adding a field, branch, module or stored record, first answer how the existing pieces already do it. No state machines; prefer plain lists and data files.",
      },
      {
        optionId: "no-shims",
        shortName: "Fix the root cause, no shims",
        fullText:
          "Fix problems at their root. No compatibility shims, fallbacks for old formats, or recovery layers around a defect.",
      },
    ],
  },
  {
    categoryId: "work-breakdown",
    categoryName: "Breaking down work",
    options: [
      {
        optionId: "sprint-features",
        shortName: "Sprint features, standalone",
        fullText:
          "Break software work into sprint features. Each one has a strictly defined interface, is built as a standalone tool, has its own definition of done and its own integration testing, and delivers a README, packaging and example code.",
      },
      {
        optionId: "big-picture-first",
        shortName: "Big picture first",
        fullText:
          "Solve the big picture before the details: map the whole feature or sprint — its parts, interfaces and how they connect — before filling any part in.",
      },
    ],
  },
  {
    categoryId: "handoff",
    categoryName: "Passing on knowledge",
    options: [
      {
        optionId: "lessons-and-compromises",
        shortName: "Lessons and compromises",
        fullText:
          "When you finish, state what later work needs to know: lessons learned, compromises made, and any constraint you had to bend. Passing this on is part of finishing, not optional.",
      },
    ],
  },
  {
    categoryId: "honesty-of-claims",
    categoryName: "Claims and status",
    options: [
      {
        optionId: "verified-or-say-so",
        shortName: "Only claim what you verified",
        fullText:
          "Never call something working, live or done unless you personally ran the check and saw it pass. Say plainly what was and was not checked. A false claim is wrong, not imprecise — no softening language.",
      },
    ],
  },
  {
    categoryId: "version-control",
    categoryName: "Version control",
    options: [
      {
        optionId: "commit-and-push-milestones",
        shortName: "Commit and push at milestones",
        fullText:
          "Commit and push whenever a milestone is reached, something important changes, or something is documented. Rollback is the safety net. Plain commit messages with no tool attribution.",
      },
      {
        optionId: "do-not-commit",
        shortName: "Do not commit",
        fullText: "Do not commit or push. Leave all changes in the working tree for review.",
      },
    ],
  },
  {
    categoryId: "cost-discipline",
    categoryName: "Cost of live testing",
    options: [
      {
        optionId: "size-test-to-question",
        shortName: "Size each test to its question",
        fullText:
          "Before any expensive or live run, decide what behaviour it must show, use the smallest input that shows it, and stop the run as soon as it has been seen. Never leave a paid run going to see it finish. Keep logs of a run you are still diagnosing.",
      },
    ],
  },
];

export const DEFAULT_RULE_PRESETS = [
  {
    presetName: "Careful engineering",
    entries: [
      { categoryId: "design-authority", optionId: "architect-decides" },
      { categoryId: "requirements-fidelity", optionId: "never-add-details" },
      { categoryId: "requirements-fidelity", optionId: "build-to-spec-or-stop" },
      { categoryId: "escalation", optionId: "escalation-is-a-blocker" },
      { categoryId: "simplicity", optionId: "new-behaviour-is-data" },
      { categoryId: "naming-convention", optionId: "verbose-role-based" },
      { categoryId: "work-breakdown", optionId: "sprint-features" },
      { categoryId: "modularity", optionId: "standalone-tools" },
      { categoryId: "structure-first", optionId: "skeleton-and-tests-first" },
      { categoryId: "testing", optionId: "tdd-module-level" },
      { categoryId: "proof-of-done", optionId: "real-use-proof" },
      { categoryId: "honesty-of-claims", optionId: "verified-or-say-so" },
      { categoryId: "troubleshooting", optionId: "research-dont-guess" },
      { categoryId: "handoff", optionId: "lessons-and-compromises" },
      { categoryId: "reporting", optionId: "full-report" },
    ],
  },
  {
    presetName: "Autonomous agent run",
    entries: [
      { categoryId: "design-authority", optionId: "own-the-quality" },
      { categoryId: "requirements-fidelity", optionId: "build-to-spec-or-stop" },
      { categoryId: "escalation", optionId: "escalation-is-a-blocker" },
      { categoryId: "simplicity", optionId: "no-shims" },
      { categoryId: "work-breakdown", optionId: "big-picture-first" },
      { categoryId: "testing", optionId: "tdd-module-level" },
      { categoryId: "proof-of-done", optionId: "real-use-proof" },
      { categoryId: "cost-discipline", optionId: "size-test-to-question" },
      { categoryId: "troubleshooting", optionId: "stop-when-answered" },
      { categoryId: "version-control", optionId: "commit-and-push-milestones" },
      { categoryId: "honesty-of-claims", optionId: "verified-or-say-so" },
      { categoryId: "reporting", optionId: "terse-structured" },
    ],
  },
  {
    presetName: "Quick prototype",
    entries: [
      { categoryId: "requirements-fidelity", optionId: "use-judgement" },
      { categoryId: "naming-convention", optionId: "modern-clean" },
      { categoryId: "modularity", optionId: "single-file-is-fine" },
      { categoryId: "testing", optionId: "no-testing" },
      { categoryId: "reporting", optionId: "terse-structured" },
    ],
  },
  {
    presetName: "Existing codebase change",
    entries: [
      { categoryId: "naming-convention", optionId: "match-existing-codebase" },
      { categoryId: "requirements-fidelity", optionId: "never-add-details" },
      { categoryId: "testing", optionId: "simple-post-testing" },
      { categoryId: "proof-of-done", optionId: "tests-pass" },
      { categoryId: "troubleshooting", optionId: "stop-when-answered" },
      { categoryId: "reporting", optionId: "terse-structured" },
    ],
  },
];
