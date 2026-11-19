/**
 * The state of one rule selection: which categories and options are available (the
 * shipped catalog plus the user's own additions), the ordered list of chosen rules, and
 * the presets. Holds no knowledge of the page; the page subscribes to changes.
 *
 * A chosen rule ("entry") is {entryId, categoryId, optionId, enabled, editedText}. A rule
 * that is not enabled stays in the list, in its place, but is left out of the text. editedText is
 * null until the user changes the rule's text on the page; then that text is used in
 * place of the option's.
 */

let lastEntryNumber = 0;
const newEntryId = () => `entry-${++lastEntryNumber}`;

const slugFromText = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";

export class RuleSelectionState {
  constructor({ defaultCategories, defaultPresets, preferenceStore }) {
    this.defaultCategories = defaultCategories;
    this.defaultPresets = defaultPresets;
    this.preferenceStore = preferenceStore;
    this.customizations = { customCategories: [], customOptions: [], customPresets: [] };
    this.chosenEntries = [];
    /** Optional free text that turns the ruleset into a specific prompt. */
    this.customText = { text: "", placement: "end", enabled: true };
    this.selectedPresetName = null;
    this.changeListeners = new Set();
    this.textEditListeners = new Set();
  }

  async loadSavedCustomizations() {
    this.customizations = await this.preferenceStore.loadCustomizations();
    this.notifyChange();
  }

  onChange(listener) {
    this.changeListeners.add(listener);
    return () => this.changeListeners.delete(listener);
  }

  notifyChange() {
    for (const listener of this.changeListeners) listener(this);
  }

  async saveCustomizations() {
    await this.preferenceStore.saveCustomizations(this.customizations);
  }

  // --- reading -----------------------------------------------------------------------

  /** Every category, shipped and custom, each with its shipped and custom options. */
  listAllCategories() {
    const categories = [
      ...this.defaultCategories.map((category) => ({ ...category, isCustom: false })),
      ...this.customizations.customCategories.map((category) => ({ ...category, isCustom: true })),
    ];
    return categories.map((category) => ({
      ...category,
      options: [
        ...category.options.map((option) => ({ ...option, isCustom: category.isCustom })),
        ...this.customizations.customOptions
          .filter((option) => option.categoryId === category.categoryId)
          .map((option) => ({ ...option, isCustom: true })),
      ],
    }));
  }

  findCategory(categoryId) {
    return this.listAllCategories().find((category) => category.categoryId === categoryId);
  }

  findOption(categoryId, optionId) {
    return this.findCategory(categoryId)?.options.find((option) => option.optionId === optionId);
  }

  listAllPresets() {
    return [
      ...this.defaultPresets.map((preset) => ({ ...preset, isCustom: false })),
      ...this.customizations.customPresets.map((preset) => ({ ...preset, isCustom: true })),
    ];
  }

  /** The text to put into a prompt: each chosen rule under its category heading, with the
   * custom text (when on and not empty) at the beginning or the end. */
  composePromptText() {
    const rulesText = this.composeRulesText();
    const customText = this.customText.enabled ? this.customText.text.trim() : "";
    if (!customText) return rulesText;
    if (!rulesText) return customText;
    return this.customText.placement === "start"
      ? `${customText}\n\n${rulesText}`
      : `${rulesText}\n\n${customText}`;
  }

  /** Change the custom text. Text edits do not redraw the page (the field keeps focus);
   * placement and on/off do. */
  changeCustomText(changes) {
    Object.assign(this.customText, changes);
    if ("text" in changes) {
      for (const listener of this.textEditListeners) listener(null);
    } else {
      this.notifyChange();
    }
  }

  composeRulesText() {
    return this.chosenEntries
      .filter((entry) => entry.enabled !== false)
      .map((entry) => {
        const category = this.findCategory(entry.categoryId);
        const text = this.textOfEntry(entry);
        if (!category || text === null) return null;
        return `## ${category.categoryName}\n\n${text}`;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  /** The text an entry contributes: the user's edit, else its option's text. */
  textOfEntry(entry) {
    if (entry.editedText !== null && entry.editedText !== undefined) return entry.editedText;
    return this.findOption(entry.categoryId, entry.optionId)?.fullText ?? null;
  }

  entryTextIsEdited(entry) {
    const option = this.findOption(entry.categoryId, entry.optionId);
    return entry.editedText !== null && entry.editedText !== undefined
      && entry.editedText !== option?.fullText;
  }

  // --- changing the chosen rules -----------------------------------------------------

  /** Change an entry's text while the user types. Listeners are told with the entry id so
   * the page can update the output without redrawing the field being typed in. */
  editEntryText(entryId, text) {
    const entry = this.chosenEntries.find((candidate) => candidate.entryId === entryId);
    if (!entry) return;
    entry.editedText = text;
    for (const listener of this.textEditListeners) listener(entry);
  }

  onEntryTextEdit(listener) {
    this.textEditListeners.add(listener);
  }

  setEntryEnabled(entryId, enabled) {
    const entry = this.chosenEntries.find((candidate) => candidate.entryId === entryId);
    if (!entry) return;
    entry.enabled = enabled;
    this.selectedPresetName = null;
    this.notifyChange();
  }

  setAllEntriesEnabled(enabled) {
    for (const entry of this.chosenEntries) entry.enabled = enabled;
    this.selectedPresetName = null;
    this.notifyChange();
  }

  resetAllEntryTexts() {
    for (const entry of this.chosenEntries) entry.editedText = null;
    this.notifyChange();
  }

  resetEntryText(entryId) {
    const entry = this.chosenEntries.find((candidate) => candidate.entryId === entryId);
    if (!entry) return;
    entry.editedText = null;
    this.notifyChange();
  }

  addEntry(categoryId) {
    const category = this.findCategory(categoryId);
    if (!category) return;
    this.chosenEntries.push({
      entryId: newEntryId(),
      categoryId,
      optionId: category.options[0]?.optionId ?? null,
      enabled: true,
      editedText: null,
    });
    this.selectedPresetName = null;
    this.notifyChange();
  }

  removeEntry(entryId) {
    this.chosenEntries = this.chosenEntries.filter((entry) => entry.entryId !== entryId);
    this.selectedPresetName = null;
    this.notifyChange();
  }

  chooseOption(entryId, optionId) {
    const entry = this.chosenEntries.find((candidate) => candidate.entryId === entryId);
    if (!entry) return;
    entry.optionId = optionId;
    entry.editedText = null;
    this.selectedPresetName = null;
    this.notifyChange();
  }

  moveEntry(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    const [moved] = this.chosenEntries.splice(fromIndex, 1);
    this.chosenEntries.splice(toIndex, 0, moved);
    this.selectedPresetName = null;
    this.notifyChange();
  }

  clearEntries() {
    this.chosenEntries = [];
    this.selectedPresetName = null;
    this.notifyChange();
  }

  applyPreset(presetName) {
    const preset = this.listAllPresets().find((candidate) => candidate.presetName === presetName);
    if (!preset) return;
    this.chosenEntries = preset.entries
      .filter((entry) => this.findOption(entry.categoryId, entry.optionId))
      .map((entry) => ({ entryId: newEntryId(), enabled: true, editedText: null, ...entry }));
    // Every category is always shown: those the preset does not use follow it, switched off.
    const categoryIdsInPreset = new Set(this.chosenEntries.map((entry) => entry.categoryId));
    for (const category of this.listAllCategories()) {
      if (categoryIdsInPreset.has(category.categoryId) || !category.options.length) continue;
      this.chosenEntries.push({
        entryId: newEntryId(), categoryId: category.categoryId,
        optionId: category.options[0].optionId, enabled: false, editedText: null,
      });
    }
    this.customText = {
      text: preset.customText?.text ?? "",
      placement: preset.customText?.placement ?? "end",
      enabled: preset.customText?.enabled ?? true,
    };
    this.selectedPresetName = presetName;
    this.notifyChange();
  }

  // --- the user's own additions ------------------------------------------------------

  async addCustomOption(categoryId, shortName, fullText) {
    const category = this.findCategory(categoryId);
    const existingIds = new Set(category.options.map((option) => option.optionId));
    let optionId = `custom-${slugFromText(shortName)}`;
    for (let number = 2; existingIds.has(optionId); number++) {
      optionId = `custom-${slugFromText(shortName)}-${number}`;
    }
    this.customizations.customOptions.push({ categoryId, optionId, shortName, fullText });
    await this.saveCustomizations();
    this.notifyChange();
    return optionId;
  }

  async addCustomCategory(categoryName) {
    const existingIds = new Set(this.listAllCategories().map((category) => category.categoryId));
    let categoryId = `custom-${slugFromText(categoryName)}`;
    for (let number = 2; existingIds.has(categoryId); number++) {
      categoryId = `custom-${slugFromText(categoryName)}-${number}`;
    }
    this.customizations.customCategories.push({ categoryId, categoryName, options: [] });
    await this.saveCustomizations();
    this.notifyChange();
    return categoryId;
  }

  /** Save the chosen rules, in order, as a preset. A custom preset of the same name is replaced. */
  async saveChosenEntriesAsPreset(presetName) {
    const entries = this.chosenEntries
      .filter((entry) => entry.optionId)
      .map((entry) => ({
        categoryId: entry.categoryId,
        optionId: entry.optionId,
        enabled: entry.enabled !== false,
        editedText: this.entryTextIsEdited(entry) ? entry.editedText : null,
      }));
    this.customizations.customPresets = [
      ...this.customizations.customPresets.filter((preset) => preset.presetName !== presetName),
      { presetName, entries, customText: { ...this.customText } },
    ];
    this.selectedPresetName = presetName;
    await this.saveCustomizations();
    this.notifyChange();
  }

  presetNameIsShipped(presetName) {
    return this.defaultPresets.some((preset) => preset.presetName === presetName);
  }
}
