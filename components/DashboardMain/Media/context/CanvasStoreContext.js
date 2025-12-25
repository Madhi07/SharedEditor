import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import createCanvasStore from "../SharedStore/canvasStore";

const CanvasStoreContext = createContext(null);
const CanvasStoreNotifyContext = createContext(null);

/**
 * CanvasStoreProvider
 *
 * Props:
 * - initialProject: optional full project object { id, editor, pages, activePageId, ... }
 * - projectId: optional project id (legacy)
 * - editor: optional editor string ("video" | "infographics")
 * - pageId: optional single page id (legacy convenience)
 * - storeInstance: optional pre-created store instance
 *
 * IMPORTANT: This provider does NOT auto-generate a project.id. If you need a persistent id,
 * pass it via initialProject.id or projectId.
 */
export function CanvasStoreProvider({
  children,
  initialProject = null,
  projectId = null,
  editor = null,
  pageId = null, // legacy convenience
  storeInstance = null,
}) {
  const [version, setVersion] = useState(0);

  const store = useMemo(() => {
    if (storeInstance) {
      // use provided store instance as-is
      const s = storeInstance;

      // ensure subscribe API exists
      if (!s._listeners) s._listeners = new Set();
      if (!s.subscribe) {
        s.subscribe = (cb) => {
          s._listeners.add(cb);
          return () => s._listeners.delete(cb);
        };
      }

      wrapMutators(s);
      // ensure uiZoom exists on instance
      if (typeof s.uiZoom === "undefined") {
        s.uiZoom = 1;
        s.setUiZoom = (z) => {
          s.uiZoom = z;
          try {
            s._listeners.forEach((cb) => cb());
          } catch (e) {}
        };
      }

      return s;
    }

    // Defaults per editor: change here to tune logical canvas sizes
    const defaultLogicalForEditor = (() => {
      if (editor === "video") {
        return { width: 720, height: 358 }; // FIXED size
      }
      if (editor === "Reels") {
        return { width: 1080, height: 1920 };
      }
      if (editor === "infographics") {
        // portrait infographic default logical size
        return { width: 800, height: 2000 };
      }
      // generic fallback square canvas
      return { width: 1000, height: 1000 };
    })();

    function normalizeProject(project, editor, pageId) {
      const defaultLogical =
        editor === "video"
          ? { width: 720, height: 358 }
          : editor === "Reels"
          ? { width: 1080, height: 1920 }
          : { width: 1000, height: 1000 };

      // CASE 1: null / undefined / empty object
      if (!project || Object.keys(project).length === 0) {
        return {
          editor,
          pages: [
            {
              id: pageId || "video-page",
              name: "Page",
              blocks: [],
              meta: {
                logicalSize: defaultLogical,
                aspect: {
                  w: defaultLogical.width,
                  h: defaultLogical.height,
                },
              },
            },
          ],
          activePageId: pageId || "video-page",
        };
      }

      // ✅ CASE 2: project exists (with or without pages)
      const pages =
        project.pages?.length > 0
          ? project.pages.map((p) => ({
              ...p,
              blocks: p.blocks || [],
              meta: {
                ...p.meta,
                logicalSize: p.meta?.logicalSize ?? defaultLogical,
                aspect: p.meta?.aspect ?? {
                  w: defaultLogical.width,
                  h: defaultLogical.height,
                },
              },
            }))
          : [
              {
                id: pageId || "video-page",
                name: "Page",
                blocks: [],
                meta: {
                  logicalSize: defaultLogical,
                  aspect: {
                    w: defaultLogical.width,
                    h: defaultLogical.height,
                  },
                },
              },
            ];

      return {
        ...project,
        editor: project.editor || editor,
        pages,
        activePageId:
          project.activePageId ?? pages[0]?.id ?? pageId ?? "video-page",
      };
    }

    console.log("InitialProject", initialProject);
    // Priority: initialProject > constructed object from projectId/pageId/editor
    const project = normalizeProject(initialProject, editor, pageId);

    console.log("project", project)

    // create the store with the exact project object provided (no id injection here)
    const s = createCanvasStore({ project });

    // lightweight notification API
    s._listeners = new Set();
    s.subscribe = (cb) => {
      s._listeners.add(cb);
      return () => s._listeners.delete(cb);
    };

    // add uiZoom (default 1) + setter that notifies subscribers
    s.uiZoom = 1;
    s.setUiZoom = (z) => {
      s.uiZoom = z;
      try {
        s._listeners.forEach((cb) => cb());
      } catch (e) {
        // ignore listener errors
      }
    };

    // wrap common mutators to call notifications after they run
    wrapMutators(s);

    return s;
    // note: include deps that if changed should rebuild the store
  }, [initialProject, projectId, editor, pageId, storeInstance]);

  function wrapMutators(s) {
    const mutators = [
      "updateBlock",
      "applyCommand",
      "pushCommand",
      "addTextBlock",
      "addBlockToPage",
      "removeBlock",
      "removeGroup",
      "addPage",
      "setActivePage",
      "addGroup",
      "updateGroup",
      "undo",
      "redo",
      "clearHistory",
    ];

    mutators.forEach((name) => {
      if (typeof s[name] === "function" && !s[name]._wrapped) {
        // bind the original so `this` inside original still points to store
        const orig = s[name].bind(s);
        s[name] = (...args) => {
          const res = orig(...args);
          try {
            s._listeners.forEach((cb) => cb());
          } catch (e) {
            // swallow listener errors to avoid crashing the app
          }
          return res;
        };
        // mark wrapped to avoid double-wrapping on subsequent mounts
        s[name]._wrapped = true;
      }
    });
  }

  return (
    <CanvasStoreContext.Provider value={store}>
      <CanvasStoreNotifyContext.Provider
        value={{ version, bump: () => setVersion((v) => v + 1) }}
      >
        {children}
      </CanvasStoreNotifyContext.Provider>
    </CanvasStoreContext.Provider>
  );
}

export function useCanvasStore() {
  const store = useContext(CanvasStoreContext);
  if (!store)
    throw new Error("useCanvasStore must be used inside CanvasStoreProvider");
  return store;
}

// use this hook in components that need reactive re-rendering on store changes
export function useCanvasStoreReactive() {
  const store = useCanvasStore();
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!store || typeof store.subscribe !== "function") return;
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, [store]);
  return store;
}

export default CanvasStoreContext;
