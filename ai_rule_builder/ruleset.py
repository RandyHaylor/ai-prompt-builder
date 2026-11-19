"""A ruleset: one filled-in selection of rules. Presets and working instances are both
rulesets and share one file shape:

{
  "format": "ai-rule-builder/ruleset@1",
  "name": "...",
  "entries": [                                    # in order
    {"categoryId": "...", "optionId": "...", "enabled": true, "editedText": null}
  ],
  "customText": {"text": "...", "placement": "end" | "start", "enabled": true}
}

Every category is always present: a ruleset made from a preset lists the preset's rules
first, then every other category switched off. editedText, when not null, replaces the
option's text. The composed text is identical to what the web page produces.
"""

from __future__ import annotations

from .rule_catalog import RULESET_FORMAT, RuleCatalog


def new_ruleset(catalog: RuleCatalog, preset: "dict | None" = None, name: "str | None" = None) -> dict:
    source = preset or {"entries": [], "customText": {"text": "", "placement": "end", "enabled": True}}
    ruleset = {
        "format": RULESET_FORMAT,
        "name": name or (preset["name"] if preset else "Untitled"),
        "entries": [],
        "customText": dict({"text": "", "placement": "end", "enabled": True}, **(source.get("customText") or {})),
    }
    for entry in source.get("entries", []):
        if catalog.find_option(entry["categoryId"], entry["optionId"]):
            ruleset["entries"].append({
                "categoryId": entry["categoryId"], "optionId": entry["optionId"],
                "enabled": entry.get("enabled", True) is not False,
                "editedText": entry.get("editedText"),
            })
    include_every_category(catalog, ruleset)
    return ruleset


def include_every_category(catalog: RuleCatalog, ruleset: dict) -> None:
    present = {entry["categoryId"] for entry in ruleset["entries"]}
    for category in catalog.list_categories():
        if category["categoryId"] in present or not category["options"]:
            continue
        ruleset["entries"].append({
            "categoryId": category["categoryId"], "optionId": category["options"][0]["optionId"],
            "enabled": False, "editedText": None,
        })


def find_entry(ruleset: dict, category_id: str) -> dict:
    for entry in ruleset["entries"]:
        if entry["categoryId"] == category_id:
            return entry
    raise KeyError(f"the ruleset has no '{category_id}' rule")


def text_of_entry(catalog: RuleCatalog, entry: dict) -> "str | None":
    if entry.get("editedText") is not None:
        return entry["editedText"]
    option = catalog.find_option(entry["categoryId"], entry["optionId"])
    return option["fullText"] if option else None


def compose_rules_text(catalog: RuleCatalog, ruleset: dict) -> str:
    blocks = []
    for entry in ruleset["entries"]:
        if entry.get("enabled") is False:
            continue
        category = catalog.find_category(entry["categoryId"])
        text = text_of_entry(catalog, entry)
        if category is None or text is None:
            continue
        blocks.append(f"## {category['categoryName']}\n\n{text}")
    return "\n\n".join(blocks)


def compose_prompt_text(catalog: RuleCatalog, ruleset: dict) -> str:
    """The text to paste: each rule that is on, under its category heading, with the
    custom text (when on and not empty) at the beginning or the end."""
    rules_text = compose_rules_text(catalog, ruleset)
    custom = ruleset.get("customText") or {}
    custom_text = (custom.get("text") or "").strip() if custom.get("enabled", True) else ""
    if not custom_text:
        return rules_text
    if not rules_text:
        return custom_text
    if custom.get("placement") == "start":
        return f"{custom_text}\n\n{rules_text}"
    return f"{rules_text}\n\n{custom_text}"
