/**
 * Drag-to-reorder for any list of elements, with mouse, touch and pen alike (pointer
 * events, so it works on phones where HTML drag-and-drop does not).
 *
 * makeListReorderableByDragging(listElement, {itemSelector, handleSelector, onMove})
 *   - an item is dragged by its handle;
 *   - while dragging, the item follows the pointer and the others make room;
 *   - on release, onMove(fromIndex, toIndex) is called. The caller changes its data and
 *     re-renders; this module does not keep the moved order itself.
 * Keyboard: a focused handle moves its item with ArrowUp / ArrowDown.
 */

export function makeListReorderableByDragging(listElement, { itemSelector, handleSelector, onMove }) {
  let drag = null;

  const items = () => [...listElement.querySelectorAll(itemSelector)];

  listElement.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest(handleSelector);
    if (!handle || !listElement.contains(handle) || event.button > 0) return;
    const item = handle.closest(itemSelector);
    const allItems = items();
    event.preventDefault();
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      // no live pointer to capture (a synthetic event); moves still arrive on the list
    }
    drag = {
      item,
      handle,
      pointerId: event.pointerId,
      fromIndex: allItems.indexOf(item),
      toIndex: allItems.indexOf(item),
      startY: event.clientY,
      itemRects: allItems.map((element) => element.getBoundingClientRect()),
    };
    item.classList.add("is-being-dragged");
    listElement.classList.add("is-reordering");
  });

  listElement.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const offsetY = event.clientY - drag.startY;
    drag.item.style.transform = `translateY(${offsetY}px)`;

    const draggedRect = drag.itemRects[drag.fromIndex];
    const draggedCentre = draggedRect.top + draggedRect.height / 2 + offsetY;
    let toIndex = drag.fromIndex;
    drag.itemRects.forEach((rect, index) => {
      const centre = rect.top + rect.height / 2;
      if (index < drag.fromIndex && draggedCentre < centre) toIndex = Math.min(toIndex, index);
      if (index > drag.fromIndex && draggedCentre > centre) toIndex = Math.max(toIndex, index);
    });
    drag.toIndex = toIndex;

    const gap = draggedRect.height + 10;
    items().forEach((element, index) => {
      if (element === drag.item) return;
      let shift = 0;
      if (index > drag.fromIndex && index <= toIndex) shift = -gap;
      if (index < drag.fromIndex && index >= toIndex) shift = gap;
      element.style.transform = shift ? `translateY(${shift}px)` : "";
    });
  });

  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const { fromIndex, toIndex } = drag;
    items().forEach((element) => {
      element.style.transform = "";
    });
    drag.item.classList.remove("is-being-dragged");
    listElement.classList.remove("is-reordering");
    drag = null;
    if (fromIndex !== toIndex) onMove(fromIndex, toIndex);
  };
  listElement.addEventListener("pointerup", endDrag);
  listElement.addEventListener("pointercancel", endDrag);

  listElement.addEventListener("keydown", (event) => {
    const handle = event.target.closest(handleSelector);
    if (!handle || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
    const allItems = items();
    const fromIndex = allItems.indexOf(handle.closest(itemSelector));
    const toIndex = fromIndex + (event.key === "ArrowUp" ? -1 : 1);
    if (toIndex < 0 || toIndex >= allItems.length) return;
    event.preventDefault();
    onMove(fromIndex, toIndex);
    items()[toIndex]?.querySelector(handleSelector)?.focus();
  });
}
