/**
 * The page: draws the rule selection state and turns the user's actions into changes
 * of that state. All data lives in RuleSelectionState; this module only renders it.
 */

import { DEFAULT_RULE_CATEGORIES, DEFAULT_RULE_PRESETS } from "./default-rule-catalog.js";
import { CurrentSessionPreferenceStore } from "./preference-stores/current-session-preference-store.js";
import { RuleSelectionState } from "./rule-selection-state.js";
import { makeListReorderableByDragging } from "./drag-to-reorder-list.js";

const NEW_OPTION_MENU_VALUE = "__new-option__";
const NEW_CATEGORY_MENU_VALUE = "__new-category__";

const state = new RuleSelectionState({
  defaultCategories: DEFAULT_RULE_CATEGORIES,
  defaultPresets: DEFAULT_RULE_PRESETS,
  preferenceStore: new CurrentSessionPreferenceStore(),
});

const page = {
  presetMenu: document.getElementById("preset-menu"),
  savePresetButton: document.getElementById("save-preset-button"),
  clearRulesButton: document.getElementById("clear-rules-button"),
  ruleList: document.getElementById("rule-list"),
  emptyListNote: document.getElementById("empty-list-note"),
  addRuleMenu: document.getElementById("add-rule-menu"),
  suggestedTopics: document.getElementById("suggested-topics"),
  suggestedTopicChips: document.getElementById("suggested-topic-chips"),
  promptText: document.getElementById("prompt-text"),
  ruleCount: document.getElementById("rule-count"),
  copyButton: document.getElementById("copy-button"),
  storeDescription: document.getElementById("store-description"),
  savePresetDialog: document.getElementById("save-preset-dialog"),
  savePresetForm: document.getElementById("save-preset-form"),
  presetNameInput: document.getElementById("preset-name-input"),
  presetNameNote: document.getElementById("preset-name-note"),
  newCategoryDialog: document.getElementById("new-category-dialog"),
  newCategoryForm: document.getElementById("new-category-form"),
  newCategoryNameInput: document.getElementById("new-category-name-input"),
  toast: document.getElementById("toast"),
};

/** The entry whose "new option" form is open, if any (survives re-rendering). */
let entryIdWithNewOptionFormOpen = null;

/** Entries the user expanded to see and edit their text (all are collapsed by default). */
const expandedEntryIds = new Set();

const createElement = (tagName, properties = {}, children = []) => {
  const element = Object.assign(document.createElement(tagName), properties);
  element.append(...children);
  return element;
};

function showToast(message) {
  page.toast.textContent = message;
  page.toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => page.toast.classList.remove("is-visible"), 1800);
}

// --- rendering ----------------------------------------------------------------------

function renderPresetMenu() {
  const presets = state.listAllPresets();
  const option = (value, label) => createElement("option", { value, textContent: label });
  const shipped = createElement("optgroup", { label: "Presets" },
    presets.filter((preset) => !preset.isCustom).map((preset) => option(preset.presetName, preset.presetName)));
  const custom = presets.filter((preset) => preset.isCustom);
  page.presetMenu.replaceChildren(
    option("", "Preset…"),
    shipped,
    ...(custom.length
      ? [createElement("optgroup", { label: "Your presets" },
          custom.map((preset) => option(preset.presetName, preset.presetName)))]
      : []),
  );
  page.presetMenu.value = state.selectedPresetName ?? "";
}

function renderNewOptionForm(entry) {
  const shortNameInput = createElement("input", {
    className: "text-input", placeholder: "Short name, shown in the menu", required: true, maxLength: 60,
  });
  const fullTextInput = createElement("textarea", {
    className: "text-input", placeholder: "The full rule text, as it goes into the prompt", required: true, rows: 4,
  });
  const form = createElement("form", { className: "new-option-form" }, [
    createElement("label", { className: "field-label", textContent: "New option" }),
    shortNameInput,
    fullTextInput,
    createElement("div", { className: "form-actions" }, [
      createElement("button", { type: "button", className: "button button-quiet", textContent: "Cancel",
        onclick: () => { entryIdWithNewOptionFormOpen = null; render(); } }),
      createElement("button", { type: "submit", className: "button button-primary", textContent: "Add option" }),
    ]),
  ]);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const optionId = await state.addCustomOption(
      entry.categoryId, shortNameInput.value.trim(), fullTextInput.value.trim());
    entryIdWithNewOptionFormOpen = null;
    state.chooseOption(entry.entryId, optionId);
    showToast("Option added");
  });
  queueMicrotask(() => shortNameInput.focus());
  return form;
}

function renderEntry(entry, index) {
  const category = state.findCategory(entry.categoryId);
  const option = state.findOption(entry.categoryId, entry.optionId);

  const optionMenu = createElement("select", { className: "select", ariaLabel: `${category.categoryName} option` }, [
    ...category.options.map((candidate) =>
      createElement("option", { value: candidate.optionId,
        textContent: candidate.isCustom ? `${candidate.shortName} (yours)` : candidate.shortName })),
    createElement("option", { value: NEW_OPTION_MENU_VALUE, textContent: "＋ New option…" }),
  ]);
  optionMenu.value = entry.optionId ?? NEW_OPTION_MENU_VALUE;
  optionMenu.addEventListener("change", () => {
    if (optionMenu.value === NEW_OPTION_MENU_VALUE) {
      entryIdWithNewOptionFormOpen = entry.entryId;
      render();
    } else {
      entryIdWithNewOptionFormOpen = null;
      state.chooseOption(entry.entryId, optionMenu.value);
    }
  });

  const formIsOpen = entryIdWithNewOptionFormOpen === entry.entryId || !category.options.length;
  // Collapsed by default; an entry whose text was edited stays open so the edit is visible.
  const isExpanded = expandedEntryIds.has(entry.entryId) || state.entryTextIsEdited(entry);

  const isEnabled = entry.enabled !== false;
  const toggle = createElement("input", {
    type: "checkbox", className: "toggle-switch", checked: isEnabled,
    title: isEnabled ? "On — included in the text" : "Off — left out of the text",
    ariaLabel: `${category.categoryName} on or off`,
  });
  toggle.addEventListener("change", () => state.setEntryEnabled(entry.entryId, toggle.checked));

  return createElement("li", { className: isEnabled ? "rule-card" : "rule-card is-off" }, [
    createElement("div", { className: "rule-card-header" }, [
      createElement("button", {
        type: "button", className: "drag-handle", title: "Drag to reorder (or arrow keys)",
        ariaLabel: `Move rule ${index + 1}, ${category.categoryName}`, innerHTML: "<span></span><span></span><span></span>",
      }),
      toggle,
      createElement("span", { className: "rule-category", textContent: category.categoryName }),
      optionMenu,
      createElement("button", {
        type: "button", className: "icon-button expand-button",
        title: isExpanded ? "Hide the text" : "Show and edit the text",
        ariaLabel: isExpanded ? "Hide the text" : "Show and edit the text",
        ariaExpanded: String(isExpanded),
        textContent: isExpanded ? "▴" : "▾",
        onclick: () => {
          if (isExpanded) expandedEntryIds.delete(entry.entryId);
          else expandedEntryIds.add(entry.entryId);
          render();
        },
      }),
      createElement("button", {
        type: "button", className: "icon-button", title: "Remove this rule", ariaLabel: "Remove this rule",
        textContent: "✕", onclick: () => state.removeEntry(entry.entryId),
      }),
    ]),
    ...(formIsOpen ? [renderNewOptionForm(entry)] : isExpanded ? [renderEditableRuleText(entry)] : []),
  ]);
}

/** The rule's text in an editable field. Once changed: Reset, or save it as a new option. */
function renderEditableRuleText(entry) {
  const field = createElement("textarea", {
    className: "text-input rule-text-field", value: state.textOfEntry(entry) ?? "",
    ariaLabel: "Rule text (editable)", spellcheck: false,
  });
  const fitHeightToText = () => {
    field.style.height = "auto";
    field.style.height = `${field.scrollHeight + 2}px`;
  };
  queueMicrotask(fitHeightToText);

  const shortNameInput = createElement("input", {
    className: "text-input short-name-input", placeholder: "Name for the new option", maxLength: 60,
  });
  const actions = createElement("div", { className: "edited-text-actions" }, [
    createElement("span", { className: "edited-note", textContent: "Edited" }),
    createElement("button", { type: "button", className: "button button-small button-quiet",
      textContent: "Reset", onclick: () => state.resetEntryText(entry.entryId) }),
    shortNameInput,
    createElement("button", { type: "button", className: "button button-small",
      textContent: "Save as new option",
      onclick: async () => {
        const shortName = shortNameInput.value.trim();
        if (!shortName) { shortNameInput.focus(); return; }
        const optionId = await state.addCustomOption(entry.categoryId, shortName, field.value);
        state.chooseOption(entry.entryId, optionId);
        showToast(`Saved “${shortName}”`);
      } }),
  ]);
  const showActionsWhenEdited = () => { actions.hidden = !state.entryTextIsEdited(entry); };
  showActionsWhenEdited();

  field.addEventListener("input", () => {
    state.editEntryText(entry.entryId, field.value);
    fitHeightToText();
    showActionsWhenEdited();
  });
  return createElement("div", { className: "rule-text-block" }, [field, actions]);
}

function renderOutput() {
  const text = state.composePromptText();
  page.promptText.textContent = text || "Nothing yet.";
  page.promptText.classList.toggle("is-empty", !text);
  page.copyButton.disabled = !text;
}

function renderAddRuleMenu() {
  page.addRuleMenu.replaceChildren(
    createElement("option", { value: "", textContent: "＋ Add a rule" }),
    ...state.listAllCategories().map((category) =>
      createElement("option", { value: category.categoryId, textContent: category.categoryName })),
    createElement("option", { value: NEW_CATEGORY_MENU_VALUE, textContent: "＋ New category…" }),
  );
  page.addRuleMenu.value = "";
}

/** Topics not yet in the list, offered as one-tap chips. */
function renderSuggestedTopics() {
  const chosenCategoryIds = new Set(state.chosenEntries.map((entry) => entry.categoryId));
  const suggestions = state.listAllCategories()
    .filter((category) => !chosenCategoryIds.has(category.categoryId) && category.options.length);
  page.suggestedTopics.hidden = suggestions.length === 0;
  page.suggestedTopicChips.replaceChildren(...suggestions.map((category) =>
    createElement("button", {
      type: "button", className: "chip", textContent: `＋ ${category.categoryName}`,
      title: category.options[0].shortName,
      onclick: () => state.addEntry(category.categoryId),
    })));
}

function render() {
  renderPresetMenu();
  renderSuggestedTopics();
  page.ruleList.replaceChildren(...state.chosenEntries.map(renderEntry));
  page.emptyListNote.hidden = state.chosenEntries.length > 0;
  page.clearRulesButton.disabled = state.chosenEntries.length === 0;
  page.savePresetButton.disabled = state.chosenEntries.length === 0;
  renderAddRuleMenu();
  const text = state.composePromptText();
  page.promptText.textContent = text || "Nothing yet.";
  page.promptText.classList.toggle("is-empty", !text);
  page.copyButton.disabled = !text;
  const count = state.chosenEntries.length;
  const onCount = state.chosenEntries.filter((entry) => entry.enabled !== false).length;
  page.ruleCount.textContent = `${onCount} of ${count} rule${count === 1 ? "" : "s"} on`;
}

// --- actions ------------------------------------------------------------------------

page.presetMenu.addEventListener("change", () => {
  if (page.presetMenu.value) state.applyPreset(page.presetMenu.value);
});

page.clearRulesButton.addEventListener("click", () => state.clearEntries());

page.addRuleMenu.addEventListener("change", () => {
  const value = page.addRuleMenu.value;
  if (value === NEW_CATEGORY_MENU_VALUE) {
    page.newCategoryNameInput.value = "";
    page.newCategoryDialog.showModal();
  } else if (value) {
    state.addEntry(value);
  }
  page.addRuleMenu.value = "";
});

page.newCategoryForm.addEventListener("submit", async (event) => {
  if (event.submitter?.value !== "add") return;
  const categoryName = page.newCategoryNameInput.value.trim();
  if (!categoryName) return;
  const categoryId = await state.addCustomCategory(categoryName);
  state.addEntry(categoryId);
  entryIdWithNewOptionFormOpen = state.chosenEntries.at(-1).entryId;
  render();
});

page.savePresetButton.addEventListener("click", () => {
  page.presetNameInput.value = state.selectedPresetName && !state.presetNameIsShipped(state.selectedPresetName)
    ? state.selectedPresetName : "";
  page.presetNameNote.textContent = "";
  page.savePresetDialog.showModal();
});

page.presetNameInput.addEventListener("input", () => {
  const name = page.presetNameInput.value.trim();
  page.presetNameNote.textContent = state.presetNameIsShipped(name)
    ? "That name belongs to a built-in preset; choose another."
    : state.listAllPresets().some((preset) => preset.presetName === name)
      ? "This replaces your preset of the same name." : "";
});

page.savePresetForm.addEventListener("submit", async (event) => {
  if (event.submitter?.value !== "save") return;
  const presetName = page.presetNameInput.value.trim();
  if (!presetName || state.presetNameIsShipped(presetName)) {
    event.preventDefault();
    return;
  }
  await state.saveChosenEntriesAsPreset(presetName);
  showToast(`Saved “${presetName}”`);
});

page.copyButton.addEventListener("click", async () => {
  const text = state.composePromptText();
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(page.promptText);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    document.execCommand("copy");
  }
  showToast("Copied to clipboard");
});

makeListReorderableByDragging(page.ruleList, {
  itemSelector: ".rule-card",
  handleSelector: ".drag-handle",
  onMove: (fromIndex, toIndex) => state.moveEntry(fromIndex, toIndex),
});

page.storeDescription.textContent = state.preferenceStore.storeDescription;
state.onChange(render);
state.onEntryTextEdit(renderOutput);
await state.loadSavedCustomizations();
state.applyPreset(DEFAULT_RULE_PRESETS[0].presetName);
