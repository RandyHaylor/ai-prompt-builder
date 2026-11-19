# AI Rule Builder

A small web page for assembling the rules you give an AI agent, in the order you want,
and copying them into a prompt.

**Live:** https://randyhaylor.github.io/ai-rule-builder/

## What it does

- Each rule belongs to a **category** (Naming convention, Testing, When blocked, …) and
  is one **option** within it. The menu shows the option's short name; the page and the
  copied text use its full text.
- **Presets** load a named, ordered set of rules. Several ship with the page.
- **Drag to reorder** by the handle (mouse or touch), or focus the handle and use the
  arrow keys.
- **Add your own** option to any category ("＋ New option…"), your own category, and
  save the current list as your own preset.
- **Suggested topics** offers the categories not yet in your list.
- **Copy** puts the composed text on the clipboard: each rule under its category heading.

Your own additions currently last only until the tab is closed. Saving them to your
account (Google sign-in, stored in your Google Drive) is planned.

## How it is built

Plain HTML, CSS and JavaScript modules. No build step, no dependencies.

| File | What it is |
|---|---|
| `js/default-rule-catalog.js` | The shipped categories, options and presets. Pure data. |
| `js/rule-selection-state.js` | The chosen rules, the available catalog (shipped + your additions) and the presets. Knows nothing about the page. |
| `js/preference-stores/current-session-preference-store.js` | Where your additions are kept. Defines the store interface. |
| `js/drag-to-reorder-list.js` | Pointer-based drag reordering for any list. Generic. |
| `js/rule-builder-page.js` | Draws the state and turns clicks into state changes. |

### Where saved preferences will come from

The page talks to its preference store only through three members:

```js
storeDescription                      // shown to the user
async loadCustomizations()            // -> {customCategories, customOptions, customPresets}
async saveCustomizations(customizations)
```

Google sign-in adds a second store with the same three members (for example, one that
reads and writes a single JSON file in the app's folder of the user's Drive), and the
page picks that store once the user is signed in. Nothing else changes.

## Running it locally

Any static file server, from this folder:

```
python3 -m http.server 8000
```

then open http://localhost:8000.
