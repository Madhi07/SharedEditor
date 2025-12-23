// src/utils/editorActions.js
// Shared editor actions for canvas editors (infographics, video editor, etc.)
import {
  DuplicateCommand,
  DeleteBlockCommand,
  GroupCommand,
  UngroupCommand,
} from "../../SharedStore/Commands";
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

function makeCompoundCommand(oldMap, newMap, name = "Compound", meta = {}) {
  return {
    do(store) {
      Object.entries(newMap).forEach(([id, patch]) =>
        store.updateBlock(id, deepClone(patch))
      );
    },
    undo(store) {
      Object.entries(oldMap).forEach(([id, patch]) =>
        store.updateBlock(id, deepClone(patch))
      );
    },
    meta: {
      name,
      ...meta,
    },
  };
}

/* --------------------------------------------------
   Selection helpers
-------------------------------------------------- */

export function expandSelectionToTargetIds(store, selection = {}) {
  const { selectedIds, activeId } = selection || {};
  let sel = selectedIds?.length
    ? selectedIds.slice()
    : activeId
    ? [activeId]
    : store.primarySelectionId
    ? [store.primarySelectionId()]
    : [];

  if (
    sel.length === 1 &&
    typeof sel[0] === "string" &&
    sel[0].startsWith("g-")
  ) {
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
  Object.entries(newMap).forEach(([id, patch]) => store.updateBlock(id, patch));

  const cmd = makeCompoundCommand(
    oldMap,
    newMap,
    opts.name || "ApplyTextStyle",
    { pageId: store.activePageId }
  );
  store.applyCommand(cmd);
  return cmd;
}

/* --------------------------------------------------
   TEXT STYLE ACTIONS (ALL go into block.style)
-------------------------------------------------- */

export function changeFontFamily(store, selection, fontFamily) {
  if (!fontFamily) return null;
  return applyToSelection(store, selection, () => ({ fontFamily }), {
    name: "ChangeFontFamily",
  });
}

export function changeFontSize(store, selection, fontSize) {
  if (fontSize == null) return null;
  return applyToSelection(store, selection, () => ({ fontSize }), {
    name: "ChangeFontSize",
  });
}

export function changeTextColor(store, selection, color) {
  if (!color) return null;
  return applyToSelection(store, selection, () => ({ color }), {
    name: "ChangeTextColor",
  });
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
  const cmd = makeCompoundCommand(oldMap, newMap, "SetTextAlign", {
    pageId: store.activePageId,
  });
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
  const cmd = makeCompoundCommand(oldMap, newMap, "SetListType", {
    pageId: store.activePageId,
  });
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
  const cmd = makeCompoundCommand(oldMap, newMap, "SetOpacity", {
    pageId: store.activePageId,
  });
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
  const cmd = makeCompoundCommand(oldMap, newMap, `Flip:${direction}`, {
    pageId: store.activePageId,
  });
  store.applyCommand(cmd);
  return cmd;
}

/* --------------------------------------------------
   HelperToolbar actions
-------------------------------------------------- */

export function toggleLockSelection(store) {
  const blocks = store.selectedBlocks?.() || [];
  if (!blocks.length) return;

  const shouldLock = !blocks.every((b) => b.locked);

  const oldMap = {};
  const newMap = {};

  blocks.forEach((b) => {
    oldMap[b.id] = { locked: !!b.locked };
    newMap[b.id] = { locked: shouldLock };
  });

  store.applyCommand(
    makeCompoundCommand(oldMap, newMap, "ToggleLock", {
      pageId: store.activePageId,
    })
  );
}

export function duplicateSelection(store) {
  const blocks = store.selectedBlocks?.() || [];
  if (!blocks.length) return;

  const createdIds = [];

  blocks.forEach((b) => {
    const cmd = DuplicateCommand({
      pageId: store.activePageId,
      originalBlock: b,
    });

    // capture created id AFTER execution
    const originalDo = cmd.do;
    cmd.do = (s) => {
      originalDo(s);
      if (cmd.meta?.afterSnapshot?.createdId) {
        createdIds.push(cmd.meta.afterSnapshot.createdId);
      }
    };

    store.applyCommand(cmd);
  });

  // ✅ select all duplicated blocks at once
  if (createdIds.length) {
    store.select(createdIds);
  }
}

export function deleteSelection(store) {
  const blocks = store.selectedBlocks?.() || [];
  if (!blocks.length) return;

  blocks.forEach((b) => {
    store.applyCommand(DeleteBlockCommand(b.id));
  });
}

export function groupSelection(store) {
  const blocks = store.selectedBlocks?.() || [];
  if (blocks.length < 2) return;

  const groupId = `g-${Date.now()}`;
  store.applyCommand(
    GroupCommand(
      groupId,
      blocks.map((b) => b.id)
    )
  );
}

export function ungroupSelection(store) {
  const blocks = store.selectedBlocks?.() || [];

  blocks.forEach((b) => {
    if (b.groupId) {
      store.applyCommand(UngroupCommand(b.groupId, [b.id]));
    }
  });
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
  toggleLockSelection,
  duplicateSelection,
  deleteSelection,
  groupSelection,
  ungroupSelection,
};
