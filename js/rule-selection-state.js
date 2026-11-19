/**
 * The state of one rule selection: which categories and options are available (the
 * shipped catalog plus the user's own additions), the ordered list of chosen rules, and
 * the presets. Holds no knowledge of the page; the page subscribes to changes.
 *
 * A chosen rule ("entry") is {entryId, categoryId, optionId}. The same category may be
 * chosen more than once.
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
    this.selectedPresetName = null;
    this.changeListeners = new Set();
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

  /** The text to put into a prompt: each chosen rule under its category heading. */
  composePromptText() {
    return this.chosenEntries
      .map((entry) => {
        const category = this.findCategory(entry.categoryId);
        const option = this.findOption(entry.categoryId, entry.optionId);
        if (!category || !option) return null;
        return `## ${category.categoryName}\n\n${option.fullText}`;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  // --- changing the chosen rules -----------------------------------------------------

  addEntry(categoryId) {
    const category = this.findCategory(categoryId);
    if (!category) return;
    this.chosenEntries.push({
      entryId: newEntryId(),
      categoryId,
      optionId: category.options[0]?.optionId ?? null,
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
      .map((entry) => ({ entryId: newEntryId(), ...entry }));
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
      .map(({ categoryId, optionId }) => ({ categoryId, optionId }));
    this.customizations.customPresets = [
      ...this.customizations.customPresets.filter((preset) => preset.presetName !== presetName),
      { presetName, entries },
    ];
    this.selectedPresetName = presetName;
    await this.saveCustomizations();
    this.notifyChange();
  }

  presetNameIsShipped(presetName) {
    return this.defaultPresets.some((preset) => preset.presetName === presetName);
  }
}
