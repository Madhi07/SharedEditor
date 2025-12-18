import { useLayoutEffect, useMemo, useState, useCallback, useRef } from "react";

export default function useCanvasSelection({
  store,
  canvasRef,
  isGroupId,
}) {
  const [canvasRect, setCanvasRect] = useState(null);
  const lastRectRef = useRef(null);

  /* -------------------------------------------
     Resolve active entity
  ------------------------------------------- */
  const selectedIds = store?.selectedIds || [];
  const activeId = selectedIds[0] || null;

  const activeBlock = useMemo(() => {
    if (!activeId) return null;
    if (isGroupId?.(activeId)) {
      return store.getGroupById?.(activeId) || null;
    }
    return store.getBlockById?.(activeId) || null;
  }, [activeId, store, isGroupId]);

  /* -------------------------------------------
     Selection helper
  ------------------------------------------- */
  const selectBlock = useCallback(
    (id) => {
      if (!id) return;
      store.select?.(id);
      store.setSelectionMode?.("block");
    },
    [store]
  );

  /* -------------------------------------------
     Measure canvas rect (SAFE, NO LOOP)
  ------------------------------------------- */
  useLayoutEffect(() => {
    const el = canvasRef?.current;
    if (!el) return;

    const update = () => {
      const next = el.getBoundingClientRect();
      const prev = lastRectRef.current;

      // ⛔ Prevent infinite update loop
      if (
        prev &&
        prev.left === next.left &&
        prev.top === next.top &&
        prev.width === next.width &&
        prev.height === next.height
      ) {
        return;
      }

      lastRectRef.current = next;
      setCanvasRect(next);
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [canvasRef.current]); // ✅ ONLY depend on DOM node

  /* -------------------------------------------
     Public API
  ------------------------------------------- */
  return {
    activeBlock,
    canvasRect,
    selectBlock,
  };
}
