// src/utils/editorActions.js
// Shared editor actions for canvas editors (infographics, video editor, etc.)

/* --------------------------------------------------
   Utils
-------------------------------------------------- */

function deepClone(v) {
  try {
    return JSON.parse(JSON.stringify(v));
  } catch {
    try {
      return structuredClone
        ? structuredClone(v)
        : Array.isArray(v)
        ? v.slice()
        : { ...v };
    } catch {
      return v;
    }
  }
}

function makeCompoundCommand(oldMap, newMap, name = "Compound") {
  return {
    name,
    do(s) {
      Object.entries(newMap).forEach(([id, patch]) =>
        s.updateBlock(id, deepClone(patch))
      );
    },
    undo(s) {
      Object.entries(oldMap).forEach(([id, patch]) =>
        s.updateBlock(id, deepClone(patch))
      );
    },
  };
}

/* --------------------------------------------------
   Selection helpers
-------------------------------------------------- */

export function expandSelectionToTargetIds(store, selection = {}) {
  const { selectedIds, activeId } = selection || {};
  let sel =
    selectedIds && selectedIds.length
      ? selectedIds.slice()
      : activeId
      ? [activeId]
      : [];

  if (sel.length === 1 && typeof sel[0] === "string" && sel[0].startsWith("g-")) {
    const g = store.getGroupById?.(sel[0]);
    if (g) {
      return Array.isArray(g.childIds) && g.childIds.length
        ? g.childIds.slice()
        : Array.isArray(g.blockIds)
        ? g.blockIds.slice()
        : [];
    }
  }
  return sel;
}

export function filterTextBlocks(store, ids = []) {
  return ids.filter((id) => {
    const b = store.getBlockById?.(id);
    return b && b.type === "text";
  });
}

/* --------------------------------------------------
   Core apply helper (STYLE AWARE)
-------------------------------------------------- */

export function applyToSelection(store, selection = {}, patchFn, opts = {}) {
  if (typeof patchFn !== "function") return null;

  const selIds = expandSelectionToTargetIds(store, selection);
  if (!selIds.length) return null;

  const textIds = filterTextBlocks(store, selIds);
  if (!textIds.length) return null;

  const oldMap = {};
  const newMap = {};

  textIds.forEach((id) => {
    const block = store.getBlockById?.(id);
    if (!block) return;

    const before = deepClone(block);
    const beforeStyle = deepClone(before.style || {});

    const stylePatch = patchFn(deepClone(beforeStyle)) || {};
    if (!Object.keys(stylePatch).length) return;

    oldMap[id] = { style: beforeStyle };
    newMap[id] = {
      style: {
        ...beforeStyle,
        ...stylePatch,
      },
    };
  });

  if (!Object.keys(newMap).length) return null;

  // live update
  Object.entries(newMap).forEach(([id, patch]) =>
    store.updateBlock(id, patch)
  );

  const cmd = makeCompoundCommand(
    oldMap,
    newMap,
    opts.name || "ApplyTextStyle"
  );
  store.applyCommand(cmd);
  return cmd;
}

/* --------------------------------------------------
   TEXT STYLE ACTIONS (ALL go into block.style)
-------------------------------------------------- */

export function changeFontFamily(store, selection, fontFamily) {
  if (!fontFamily) return null;
  return applyToSelection(
    store,
    selection,
    () => ({ fontFamily }),
    { name: "ChangeFontFamily" }
  );
}

export function changeFontSize(store, selection, fontSize) {
  if (fontSize == null) return null;
  return applyToSelection(
    store,
    selection,
    () => ({ fontSize }),
    { name: "ChangeFontSize" }
  );
}

export function changeTextColor(store, selection, color) {
  if (!color) return null;
  return applyToSelection(
    store,
    selection,
    () => ({ color }),
    { name: "ChangeTextColor" }
  );
}

export function toggleTextStyle(store, selection, key) {
  if (!key) return null;
  return applyToSelection(
    store,
    selection,
    (style) => ({ [key]: !style[key] }),
    { name: `ToggleText:${key}` }
  );
}

/* --------------------------------------------------
   Text layout (NOT style object)
-------------------------------------------------- */

export function setTextAlign(store, selection, align = "center") {
  const selIds = expandSelectionToTargetIds(store, selection);
  if (!selIds.length) return null;

  const oldMap = {};
  const newMap = {};

  selIds.forEach((id) => {
    const b = store.getBlockById?.(id);
    if (!b || b.type !== "text") return;
    oldMap[id] = { textAlign: b.textAlign || "center" };
    newMap[id] = { textAlign: align };
  });

  Object.entries(newMap).forEach(([id, p]) => store.updateBlock(id, p));
  const cmd = makeCompoundCommand(oldMap, newMap, "SetTextAlign");
  store.applyCommand(cmd);
  return cmd;
}

export function setListType(store, selection, listType = "normal") {
  const selIds = expandSelectionToTargetIds(store, selection);
  if (!selIds.length) return null;

  const oldMap = {};
  const newMap = {};

  selIds.forEach((id) => {
    const b = store.getBlockById?.(id);
    if (!b || b.type !== "text") return;
    oldMap[id] = { listType: b.listType || "normal" };
    newMap[id] = { listType };
  });

  Object.entries(newMap).forEach(([id, p]) => store.updateBlock(id, p));
  const cmd = makeCompoundCommand(oldMap, newMap, "SetListType");
  store.applyCommand(cmd);
  return cmd;
}

/* --------------------------------------------------
   Non-text shared actions
-------------------------------------------------- */

export function setOpacity(store, selection, value = 1) {
  const selIds = expandSelectionToTargetIds(store, selection);
  if (!selIds.length) return null;

  const oldMap = {};
  const newMap = {};

  selIds.forEach((id) => {
    const b = store.getBlockById?.(id);
    if (!b) return;
    oldMap[id] = { opacity: b.opacity ?? 1 };
    newMap[id] = { opacity: value };
  });

  Object.entries(newMap).forEach(([id, p]) => store.updateBlock(id, p));
  const cmd = makeCompoundCommand(oldMap, newMap, "SetOpacity");
  store.applyCommand(cmd);
  return cmd;
}

export function flipBlock(store, selection, direction = "horizontal") {
  const selIds = expandSelectionToTargetIds(store, selection);
  if (!selIds.length) return null;

  const oldMap = {};
  const newMap = {};

  selIds.forEach((id) => {
    const b = store.getBlockById?.(id);
    if (!b) return;

    if (direction === "horizontal") {
      oldMap[id] = { flipH: !!b.flipH };
      newMap[id] = { flipH: !b.flipH };
    } else {
      oldMap[id] = { flipV: !!b.flipV };
      newMap[id] = { flipV: !b.flipV };
    }
  });

  Object.entries(newMap).forEach(([id, p]) => store.updateBlock(id, p));
  const cmd = makeCompoundCommand(oldMap, newMap, `Flip:${direction}`);
  store.applyCommand(cmd);
  return cmd;
}

/* --------------------------------------------------
   Export
-------------------------------------------------- */

export default {
  expandSelectionToTargetIds,
  filterTextBlocks,
  applyToSelection,
  changeFontFamily,
  changeFontSize,
  changeTextColor,
  toggleTextStyle,
  setTextAlign,
  setListType,
  setOpacity,
  flipBlock,
};
