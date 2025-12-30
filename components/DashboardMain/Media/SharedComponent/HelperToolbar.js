import React from "react";
import { observer } from "mobx-react-lite";
import { useCanvasStore } from "../context/CanvasStoreContext";
import * as editorActions from "../utils/canvasUtils/editorActions";

function HelperToolbar() {
  const store = useCanvasStore();

  const rect = store.activeRect;
  const isDragging = store.dragState?.active;
  const isEditing = !!store.editingBlockId;

  if (!rect || isDragging || isEditing) return null;
  if (!store.selectedIds?.length) return null;

  const blocks = store.selectedBlocks();
  if (!blocks.length) return null;

  const locked = blocks.every((b) => b.locked);
  const canGroup = blocks.length > 1 && !blocks.some((b) => b.groupId);
  const canUngroup = blocks.some((b) => b.groupId);

  const centerX = rect.left + rect.width / 2;
  const topY = rect.top;

  return (
    <div
      className="fixed z-[9999] flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-xl border border-slate-200"
      style={{
        left: centerX,
        top: topY - 12,
        transform: "translate(-50%, -100%)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Lock */}
      <button onClick={() => editorActions.toggleLockSelection(store)}>
        <img
          src={locked ? "/icons/lock.png" : "/icons/unlock.png"}
          className="h-4 w-4"
        />
      </button>

      {!locked && (
        <>
          {/* <button onClick={() => editorActions.duplicateSelection(store)}>
            <img src="/icons/duplicate.png" className="h-4 w-4" />
          </button> */}

          <button onClick={() => editorActions.deleteSelection(store)}>
            <img src="/icons/bin.png" className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-slate-200" />

          {canGroup && (
            <button onClick={() => editorActions.groupSelection(store)}>
              Group
            </button>
          )}

          {canUngroup && (
            <button onClick={() => editorActions.ungroupSelection(store)}>
              Ungroup
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default observer(HelperToolbar);
