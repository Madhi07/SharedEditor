import { useMemo, useCallback } from "react";

export default function useCanvasSelection({
  store,
  isGroupId,
}) {
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
      if (!id || !store) return;

      store.select(id);

      // 🔥 FIX: derive mode safely
      const block = store.getBlockById?.(id);
      if (block?.type) {
        store.setSelectionMode(block.type); // "text" | "image"
      } else {
        store.setSelectionMode("block");
      }
    },
    [store]
  );

  /* -------------------------------------------
     Public API
  ------------------------------------------- */
  return {
    activeBlock,
    selectedIds,
    selectBlock,
  };
}
