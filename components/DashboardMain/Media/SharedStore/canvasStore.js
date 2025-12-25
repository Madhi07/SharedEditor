import { makeAutoObservable } from "mobx";

/**
 * createCanvasStore
 * (updated: ensures project.id, exposes editor getter/setter,
 *  injects cmd.meta.pageId and cmd.meta.editor before executing commands)
 *
 * See previous comments for usage.
 */

function deepClone(v) {
  try {
    return JSON.parse(JSON.stringify(v));
  } catch {
    try {
      return structuredClone ? structuredClone(v) : Object.assign({}, v);
    } catch {
      // best-effort shallow fallback
      return typeof v === "object" && v !== null ? { ...v } : v;
    }
  }
}

function genId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function createCanvasStore(initial = {}) {
  // Normalize incoming initial: allow passing `{ project: { pages: [...] } }`
  const initialProject = initial.project ?? initial;

  //
  // Runtime stacks (non-observed)
  //
  // Global/project-level stack (single source of truth for Undo/Redo across pages)
  const globalStack = { undoStack: [], redoStack: [] };

  // Optional per-page stacks used as lightweight UI counters / views
  const pageStacks = {};
  function ensurePageStacks(pid) {
    const id = pid || store.activePageId;
    if (!id) return null;
    if (!pageStacks[id]) pageStacks[id] = { undoStack: [], redoStack: [] };
    return pageStacks[id];
  }

  // initialize per-page stacks for any pages passed at creation
  if (initialProject && Array.isArray(initialProject.pages)) {
    initialProject.pages.forEach((p) => {
      if (p && p.id)
        pageStacks[p.id] = pageStacks[p.id] || { undoStack: [], redoStack: [] };
    });
  }

  const store = {
    //
    // Observable model state
    //
    project:
      initialProject && Object.keys(initialProject).length
        ? deepClone(initialProject)
        : { pages: [] },

    // Ensure project has an id; keep immutability for safety
    // (we patch the cloned project above so this is safe)
    // If project.id exists keep it, otherwise generate.
    get projectId() {
      return store.project?.id ?? null;
    },

    activePageId:
      (initialProject && initialProject.activePageId) ||
      (initialProject?.pages?.[0]?.id ?? null),
    groups: initial.groups ? deepClone(initial.groups) : [],

    // runtime (non-observed) fields — declared here for backward compat but will be linked
    blockRefs: {}, // { [pageId]: { [blockId]: HTMLElement } }

    // For backward compatibility expose store.undoStack/store.redoStack as references to global arrays.
    // These will be excluded from MobX observability below.
    undoStack: globalStack.undoStack,
    redoStack: globalStack.redoStack,

    editingBlockId: null,
    selectionMode: null, // "canvas" | "text" | "image"
    activeRect: null,
    canvasRect: null,
    locked: false,
    isDragging: false,

    setEditingBlock(id) {
      this.editingBlockId = id;
    },

    clearEditingBlock() {
      this.editingBlockId = null;
    },

    setSelectionMode(mode) {
      this.selectionMode = mode;
    },

    setActiveRect(rect) {
      this.activeRect = rect;
    },

    setCanvasRect(rect) {
      this.canvasRect = rect;
    },

    // runtime only
    dragState: {
      x: 0,
      y: 0,
      w: null,
      h: null,
      active: false,
    },

    //
    // Editor convenience accessors
    //
    get editor() {
      // prefer explicit project.editor, fallback to initial.editor if present
      return store.project?.editor ?? null;
    },
    setEditor(editorName) {
      if (!store.project) store.project = {};
      store.project.editor = editorName;
    },

    //
    // -- Derived getters
    //
    get activePage() {
      return (
        store.project?.pages?.find((p) => p.id === store.activePageId) ?? null
      );
    },

    get blocks() {
      return store.activePage?.blocks ?? [];
    },

    //
    // -- Project / page helpers
    //
    replaceProject(newProject = { pages: [] }) {
      // ensure project.id
      const replaced = deepClone(newProject);
      if (!replaced.id) replaced.id = genId("project");
      store.project = replaced;

      store.activePageId =
        store.project.activePageId ??
        store.project.pages[0]?.id ??
        store.activePageId;
      // initialize pageStacks for new pages
      (store.project.pages || []).forEach((p) => {
        if (p && p.id)
          pageStacks[p.id] = pageStacks[p.id] || {
            undoStack: [],
            redoStack: [],
          };
      });
      // clear global history when project replaced
      globalStack.undoStack.length = 0;
      globalStack.redoStack.length = 0;
    },
    
    setActivePage(pageId) {
      if (!pageId) return;
      const found = store.project?.pages?.some((p) => p.id === pageId);
      if (!found) return;
      store.activePageId = pageId;
    },

    addPage(page = {}) {
      const p = {
        id: page.id ?? genId("page"),
        name: page.name ?? "Page",
        blocks: Array.isArray(page.blocks) ? deepClone(page.blocks) : [],
        meta: page.meta ? { ...page.meta } : {},
      };
      store.project.pages = [...(store.project.pages || []), p];
      pageStacks[p.id] = pageStacks[p.id] || { undoStack: [], redoStack: [] };
      if (!store.activePageId) store.activePageId = p.id;
      return p;
    },

    removePage(pageId) {
      store.project.pages = (store.project.pages || []).filter(
        (p) => p.id !== pageId
      );
      delete store.blockRefs[pageId];
      delete pageStacks[pageId];
      if (store.activePageId === pageId) {
        store.activePageId = store.project.pages[0]?.id ?? null;
      }
      // Note: project history still contains commands referring to the removed page.
      // You may want to filter those out on remove if desired.
    },

    setBlocksForPage(pageId, blocks = []) {
      const page = store.project.pages.find((p) => p.id === pageId);
      if (!page) return;
      page.blocks = deepClone(blocks);
    },
    safeGetPageId() {
      return store.activePageId ?? store.project.pages?.[0]?.id ?? null;
    },

    //
    // -- Block helpers (search/update across project)
    //
    getBlockById(blockId) {
      if (!blockId) return null;
      for (const p of store.project.pages || []) {
        if (!p.blocks) continue;
        const b = p.blocks.find((blk) => blk.id === blockId);
        if (b) return b;
      }
      return null;
    },

    getBlocksForPage(pageId) {
      return store.project.pages.find((p) => p.id === pageId)?.blocks ?? [];
    },

    findPageContainingBlock(blockId) {
      if (!blockId) return null;
      return (
        store.project.pages.find((p) =>
          p.blocks?.some((b) => b.id === blockId)
        ) ?? null
      );
    },

    updateBlock(blockId, patch = {}) {
      const page = store.findPageContainingBlock(blockId);
      if (!page) return;
      const idx = page.blocks.findIndex((b) => b.id === blockId);
      if (idx === -1) return;
      page.blocks[idx] = { ...page.blocks[idx], ...deepClone(patch) };
    },

    addTextBlock(
      pageId,
      { x = 20, y = 20, text = "Neww text", style = {} } = {}
    ) {
      return store.addBlockToPage(
        {
          type: "text",
          text,
          position: { x, y },
          size: { width: 220, height: 26 },
          style,
          opacity: 1,
          rotation: 0,
          zIndex: 0,
        },
        pageId
      );
    },

    addBlockToPage(block = {}, pageId = null) {
      const pid = pageId ?? store.activePageId ?? store.project.pages?.[0]?.id;
      if (!pid) {
        // If no page exists, create a page and use it
        const p = store.addPage({ name: "Page 1" });
        return store.addBlockToPage(block, p.id);
      }
      const page = store.project.pages.find((p) => p.id === pid);
      if (!page) return null;
      const b = deepClone(block);
      if (!b.id) b.id = genId("b");
      // normalize minimal fields
      b.type = b.type ?? "text";
      b.position = b.position ?? { x: 0, y: 0 };
      b.size =
        b.size ??
        (b.type === "text" ? { width: 200 } : { width: 100, height: 100 });
      b.rotation = typeof b.rotation === "number" ? b.rotation : 0;
      b.opacity = typeof b.opacity === "number" ? b.opacity : 1;
      b.zIndex = typeof b.zIndex === "number" ? b.zIndex : 0;
      b.startTime = typeof b.startTime === "number" ? b.startTime : 0;
      b.duration = typeof b.duration === "number" ? b.duration : Infinity;
      b.style = b.style ? deepClone(b.style) : {};
      page.blocks = [...(page.blocks || []), b];
      return b;
    },

    removeBlock(blockId) {
      const page = store.findPageContainingBlock(blockId);
      if (!page) return;
      page.blocks = (page.blocks || []).filter((b) => b.id !== blockId);
      // cleanup ref
      if (store.blockRefs[page.id]) {
        delete store.blockRefs[page.id][blockId];
        if (Object.keys(store.blockRefs[page.id]).length === 0)
          delete store.blockRefs[page.id];
      }
      // remove from groups if present
      store.ensureGroupRemovedForBlock(blockId);
    },

    getAllBlocks() {
      return store.project.pages.flatMap((p) =>
        p.blocks ? p.blocks.slice() : []
      );
    },

    //
    // -- Selection helpers
    //
    selectedIds: [],

    select(ids) {
      if (!ids) {
        store.selectedIds = [];
        return;
      }
      if (Array.isArray(ids)) store.selectedIds = ids.slice();
      else store.selectedIds = [ids];
    },

    clearSelection() {
      store.selectedIds = [];
    },

    toggleSelect(id) {
      if (!id) return;
      if (store.selectedIds.includes(id))
        store.selectedIds = store.selectedIds.filter((s) => s !== id);
      else store.selectedIds = [id, ...store.selectedIds];
    },

    primarySelectionId() {
      return store.selectedIds.length ? store.selectedIds[0] : null;
    },

    selectedBlocks() {
      return store.selectedIds
        .map((id) => store.getBlockById(id))
        .filter(Boolean);
    },

    //
    // -- Groups (ported behaviour)
    //
    addGroup(group = {}) {
      const g = {
        id: group.id ?? genId("group"),
        childIds: Array.isArray(group.childIds)
          ? [...group.childIds]
          : Array.isArray(group.blockIds)
          ? [...group.blockIds]
          : [],
        blockIds: Array.isArray(group.blockIds)
          ? [...group.blockIds]
          : Array.isArray(group.childIds)
          ? [...group.childIds]
          : [],
        position: group.position ? deepClone(group.position) : { x: 0, y: 0 },
        size: group.size ? deepClone(group.size) : { width: 0, height: 0 },
        rotation: typeof group.rotation === "number" ? group.rotation : 0,
        meta: group.meta ? deepClone(group.meta) : {},
        blockOffsets: group.blockOffsets ? deepClone(group.blockOffsets) : {},
      };
      store.groups = [...store.groups, g];
      // attach groupId to blocks
      (g.childIds || []).forEach((bid) => {
        const b = store.getBlockById(bid);
        if (b) b.groupId = g.id;
      });
      return g;
    },

    updateGroup(groupId, patch = {}) {
      const gi = store.groups.findIndex((g) => g.id === groupId);
      if (gi === -1) return;
      const g = store.groups[gi];
      // handle childIds <-> blockIds normalization
      if (patch.blockIds && !patch.childIds)
        patch.childIds = Array.isArray(patch.blockIds)
          ? patch.blockIds.slice()
          : [];
      if (patch.childIds) {
        const old = new Set(g.childIds || []);
        const neu = new Set(patch.childIds || []);
        // detach old
        for (const id of old)
          if (!neu.has(id)) {
            const b = store.getBlockById(id);
            if (b && b.groupId === groupId) delete b.groupId;
          }
        // attach new
        for (const id of neu)
          if (!old.has(id)) {
            const b = store.getBlockById(id);
            if (b) b.groupId = groupId;
          }
        g.childIds = Array.isArray(patch.childIds)
          ? patch.childIds.slice()
          : [];
        g.blockIds = g.childIds.slice();
      }
      const allowed = ["position", "size", "rotation", "meta", "blockOffsets"];
      for (const k of allowed) if (k in patch) g[k] = deepClone(patch[k]);
    },

    removeGroup(groupId) {
      store.groups = store.groups.filter((g) => g.id !== groupId);
    },

    getGroupById(id) {
      return store.groups.find((g) => g.id === id) ?? null;
    },

    ensureGroupRemovedForBlock(blockId) {
      store.groups.forEach((g) => {
        if (g.childIds?.includes(blockId))
          g.childIds = g.childIds.filter((id) => id !== blockId);
      });
    },

    //
    // -- blockRefs (DOM refs) management (non-observable)
    //
    // setBlockRef(pageId, blockId, el) - attach/detach a DOM ref
    setBlockRef(pageId, blockId, el) {
      if (!pageId || !blockId) return;
      if (!store.blockRefs[pageId]) store.blockRefs[pageId] = {};
      if (el == null) {
        if (store.blockRefs[pageId]) {
          delete store.blockRefs[pageId][blockId];
          if (Object.keys(store.blockRefs[pageId]).length === 0)
            delete store.blockRefs[pageId];
        }
      } else {
        store.blockRefs[pageId][blockId] = el;
      }
    },

    getBlockRef(pageId, blockId) {
      return (
        (store.blockRefs[pageId] && store.blockRefs[pageId][blockId]) || null
      );
    },

    hasBlockRef(pageId, blockId) {
      return !!(store.blockRefs[pageId] && store.blockRefs[pageId][blockId]);
    },

    //
    // -- Commands / undo-redo (project/global stack with optional per-page stacks)
    //
    applyCommand(cmd) {
      try {
        // Determine pageId for metadata/context (fall back to activePageId)
        const pageId =
          (cmd && cmd.meta && cmd.meta.pageId) || store.activePageId;

        // Determine project/editor and ensure project has id
        if (!store.project) store.project = { pages: [] };

        // Ensure cmd.meta exists and pageId/editor are set BEFORE executing the command,
        // so cmd.do/store logic can read cmd.meta.pageId or cmd.meta.editor if needed.
        if (!cmd)
          cmd = {
            do: () => {},
            undo: null,
            meta: { pageId, editor: store.editor },
          };
        if (!cmd.meta) cmd.meta = { pageId, editor: store.editor };
        if (!cmd.meta.pageId) cmd.meta.pageId = pageId;
        if (!cmd.meta.editor) cmd.meta.editor = store.editor;

        // Execute command
        if (cmd && typeof cmd.do === "function") {
          // allow the command to inspect cmd.meta (including pageId and editor) during execution
          cmd.do(store);
        } else if (typeof cmd === "function") {
          // legacy plain function command
          cmd(store);
        } else {
          // unknown shape -- nothing to do
        }

        // Normalize record stored in history: ensure it has { do, undo, meta }
        let record;
        if (
          cmd &&
          (typeof cmd.do === "function" || typeof cmd.undo === "function")
        ) {
          record = cmd;
          // cmd.meta/pageId already injected above, but keep safety checks
          if (!record.meta) record.meta = { pageId, editor: store.editor };
          else {
            if (!record.meta.pageId) record.meta.pageId = pageId;
            if (!record.meta.editor) record.meta.editor = store.editor;
          }
        } else if (typeof cmd === "function") {
          record = {
            do: (s) => cmd(s),
            undo: null,
            meta: { pageId, editor: store.editor },
          };
        } else {
          // push a non-undoable placeholder
          record = {
            do: () => {},
            undo: null,
            meta: { pageId, editor: store.editor },
          };
        }

        // push to global stack
        globalStack.undoStack.push(record);
        globalStack.redoStack.length = 0;

        // also update per-page stack (for UI counts) if desired
        const ps = ensurePageStacks(pageId);
        if (ps) {
          ps.undoStack.push(record);
          ps.redoStack.length = 0;
        }
      } catch (err) {
        // keep fail-safe: log error
        // console.error("applyCommand failed:", err);
      }
    },

    // alias for compatibility
    pushCommand(cmd) {
      return store.applyCommand(cmd);
    },

    undo() {
      if (!globalStack.undoStack.length) return;
      const cmd = globalStack.undoStack.pop();
      if (!cmd) return;
      const pageId = (cmd.meta && cmd.meta.pageId) || store.activePageId;

      try {
        // Switch active page so the user sees the undone change in context
        if (pageId && typeof store.setActivePage === "function") {
          try {
            store.setActivePage(pageId);
          } catch (e) {}
        }

        if (cmd && typeof cmd.undo === "function") {
          cmd.undo(store);
        } else {
          // non-undoable — nothing to revert
        }

        // push into redo
        globalStack.redoStack.push(cmd);

        // keep per-page stacks in sync (best-effort: remove last matching instance)
        try {
          const ps = pageStacks[pageId];
          if (ps) {
            for (let i = ps.undoStack.length - 1; i >= 0; i--) {
              if (ps.undoStack[i] === cmd) {
                ps.undoStack.splice(i, 1);
                break;
              }
            }
            ps.redoStack.push(cmd);
          }
        } catch (e) {}
      } catch (err) {
        // console.error("undo failed:", err);
      }
    },

    redo() {
      if (!globalStack.redoStack.length) return;
      const cmd = globalStack.redoStack.pop();
      if (!cmd) return;
      const pageId = (cmd.meta && cmd.meta.pageId) || store.activePageId;

      try {
        // Switch active page to the command's pageId
        if (pageId && typeof store.setActivePage === "function") {
          try {
            store.setActivePage(pageId);
          } catch (e) {}
        }

        if (cmd && typeof cmd.do === "function") {
          cmd.do(store);
        } else {
          // non-redoable
        }

        // push back to undo
        globalStack.undoStack.push(cmd);

        // keep per-page stacks in sync
        try {
          const ps = pageStacks[pageId];
          if (ps) {
            for (let i = ps.redoStack.length - 1; i >= 0; i--) {
              if (ps.redoStack[i] === cmd) {
                ps.redoStack.splice(i, 1);
                break;
              }
            }
            ps.undoStack.push(cmd);
          }
        } catch (e) {}
      } catch (err) {
        // console.error("redo failed:", err);
      }
    },

    // convenience: undo/redo for a single page only (isolated)
    undoFor(pageId) {
      const pid = pageId || store.activePageId;
      const ps = ensurePageStacks(pid);
      if (!ps || !ps.undoStack.length) return;
      const cmd = ps.undoStack.pop();
      if (!cmd) return;
      try {
        if (cmd && typeof cmd.undo === "function") cmd.undo(store);
        ps.redoStack.push(cmd);

        // Also attempt to remove the instance from globalStack.undoStack (best-effort)
        for (let i = globalStack.undoStack.length - 1; i >= 0; i--) {
          if (globalStack.undoStack[i] === cmd) {
            globalStack.undoStack.splice(i, 1);
            break;
          }
        }
        globalStack.redoStack.push(cmd);
      } catch (e) {}
    },

    redoFor(pageId) {
      const pid = pageId || store.activePageId;
      const ps = ensurePageStacks(pid);
      if (!ps || !ps.redoStack.length) return;
      const cmd = ps.redoStack.pop();
      if (!cmd) return;
      try {
        if (cmd && typeof cmd.do === "function") cmd.do(store);
        ps.undoStack.push(cmd);

        // Also try to remove from global redo stack and push to global undo
        for (let i = globalStack.redoStack.length - 1; i >= 0; i--) {
          if (globalStack.redoStack[i] === cmd) {
            globalStack.redoStack.splice(i, 1);
            break;
          }
        }
        globalStack.undoStack.push(cmd);
      } catch (e) {}
    },

    // Inspectors (project-level and per-page)
    getProjectUndoStack() {
      return globalStack.undoStack;
    },
    getProjectRedoStack() {
      return globalStack.redoStack;
    },
    getUndoStack(pageId) {
      return (pageStacks[pageId || store.activePageId] || { undoStack: [] })
        .undoStack;
    },
    getRedoStack(pageId) {
      return (pageStacks[pageId || store.activePageId] || { redoStack: [] })
        .redoStack;
    },

    get canUndo() {
      return globalStack.undoStack.length > 0;
    },

    get canRedo() {
      return globalStack.redoStack.length > 0;
    },

    clearHistory() {
      globalStack.undoStack.length = 0;
      globalStack.redoStack.length = 0;
      Object.keys(pageStacks).forEach((k) => {
        pageStacks[k].undoStack.length = 0;
        pageStacks[k].redoStack.length = 0;
      });
    },

    //
    // -- Utilities
    //
    applyMultiplePatch(patches = {}) {
      Object.keys(patches).forEach((id) => {
        const patch = patches[id];
        const page = store.findPageContainingBlock(id);
        if (!page) return;
        const idx = page.blocks.findIndex((b) => b.id === id);
        if (idx !== -1)
          page.blocks[idx] = { ...page.blocks[idx], ...deepClone(patch) };
      });
    },

    toSerializable() {
      return deepClone({
        project: store.project,
        activePageId: store.activePageId,
        groups: store.groups,
      });
    },

    hydrate(obj = {}) {
      if (obj.project) store.project = deepClone(obj.project);
      if (obj.activePageId) store.activePageId = obj.activePageId;
      if (obj.groups) store.groups = deepClone(obj.groups);
      // ensure stacks for hydrated pages
      (store.project.pages || []).forEach((p) => {
        if (p && p.id)
          pageStacks[p.id] = pageStacks[p.id] || {
            undoStack: [],
            redoStack: [],
          };
      });
    },

    // return logical size for page (if stored under page.meta.logicalSize,
    // or derived from page.meta.aspect + baseLogicalHeight)
    // returns { width, height } or null
    getPageLogicalSize(pageId) {
      const pid = pageId ?? store.activePageId;
      const page = store.project?.pages?.find((p) => p.id === pid);
      if (!page) return null;

      // 1) explicit logical size (highest priority)
      if (
        page.meta &&
        page.meta.logicalSize &&
        page.meta.logicalSize.width &&
        page.meta.logicalSize.height
      ) {
        return {
          width: Number(page.meta.logicalSize.width),
          height: Number(page.meta.logicalSize.height),
        };
      }

      // 2) derive from aspect if provided
      if (page.meta && page.meta.aspect) {
        const aspect = page.meta.aspect;
        const baseLogicalHeight = page.meta.baseLogicalHeight || 1000;
        // aspect can be number (ratio) or object {w,h}
        if (typeof aspect === "number") {
          const ratio = Number(aspect);
          return {
            width: Math.round(ratio * baseLogicalHeight),
            height: baseLogicalHeight,
          };
        }
        if (typeof aspect === "object" && aspect.w && aspect.h) {
          const ratio = Number(aspect.w) / Number(aspect.h);
          return {
            width: Math.round(ratio * baseLogicalHeight),
            height: baseLogicalHeight,
          };
        }
      }

      // 3) backward compat: page.meta.size
      if (
        page.meta &&
        page.meta.size &&
        page.meta.size.width &&
        page.meta.size.height
      ) {
        return {
          width: Number(page.meta.size.width),
          height: Number(page.meta.size.height),
        };
      }

      return null;
    },
  };

  // make observable — exclude runtime, non-observed keys
  makeAutoObservable(
    store,
    {
      blockRefs: false,
      undoStack: false,
      redoStack: false,
      setBlockRef: false,
      getBlockRef: false,
      hasBlockRef: false,
    },
    { autoBind: true }
  );

  return store;
}

export default createCanvasStore;
