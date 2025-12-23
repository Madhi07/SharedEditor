import React from "react";
import { useCanvasStore } from "../context/CanvasStoreContext";
import { observer } from "mobx-react-lite";

function SelectionOverlay({
  block,
  beginInteraction,
  onSelect = () => {},
  onDoubleClick,
  canResize = true,
  cornerHandles = [],
  sideHandles = [],
}) {
  const store = useCanvasStore();

  // FIX: Resolve live block from store to avoid stale props from parent
  const liveBlock = store.getBlockById?.(block.id) || block;
  const currentBlock = liveBlock;
  const isLocked = !!currentBlock.locked;

  // We REQUIRE a DOM rect (Infographics-style)
  const rect = store.activeRect;
  if (!rect) return null;

  const ds = store.dragState;
  const isActive = ds.active;
  const isEditing = store.editingBlockId === currentBlock.id;

  if (isEditing) return null;

  const width =
    store.dragState.active && store.dragState.w != null
      ? store.dragState.w
      : currentBlock.size.width;

  const height =
    store.dragState.active && store.dragState.h != null
      ? store.dragState.h
      : currentBlock.size.height;

  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const rotation =
    store.dragState.active && store.dragState.rotation != null
      ? store.dragState.rotation
      : currentBlock.rotation ?? 0;

  const wrapperStyle = {
    position: "fixed",
    left: centerX,
    top: centerY,
    width,
    height,
    transform: `
      translate(-50%, -50%)
      rotate(${rotation}deg)
    `,
    transformOrigin: "center",
    zIndex: 9999,
    pointerEvents: isActive ? "none" : "auto",
    outline: "1px solid rgba(168, 85, 247, 0.9)",
  };

  const borderStyle = {
    position: "absolute",
    inset: 0,
    border: "1px solid rgba(168, 85, 247, 0.9)",
    boxSizing: "border-box",
    pointerEvents: "none",
  };

  const handleCommon = {
    position: "absolute",
    width: 12,
    height: 12,
    background: "#fff",
    border: "2px solid rgba(168, 85, 247, 0.9)",
    borderRadius: 4,
    pointerEvents: "auto",
    boxSizing: "border-box",
  };

  /* -------------------------------------------------
     Interaction helper
  ------------------------------------------------- */
  const startInteraction = (e, type, handle = null) => {
    e.preventDefault();
    e.stopPropagation();

    let textResizeMode = "normal";

    if (currentBlock.type === "text" && type === "resize") {
      if (
        handle === "left" ||
        handle === "top-left" ||
        handle === "bottom-left"
      ) {
        textResizeMode = "scale"; // font + box scale
      } else if (handle === "right") {
        textResizeMode = "width"; // width only
      }
    }

    beginInteraction?.(e, {
      type,
      blockId: currentBlock.id,
      handle,
      textResizeMode,
    });
  };

  /* -------------------------------------------------
     Render
  ------------------------------------------------- */
  return (
    <div style={wrapperStyle}>
      {/* Selection border */}
      <div style={borderStyle} />

      {/* MOVE by dragging body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          cursor: "move",
          background: "transparent",
        }}
        onPointerDown={(e) => {
          if (isLocked) return;
          startInteraction(e, "move");
        }}
        onDoubleClick={onDoubleClick}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(currentBlock.id);
        }}
      />

      {/* Corner resize handles */}
      {canResize &&
        !isLocked &&
        cornerHandles
          .filter(({ id }) => {
            // TEXT → only top-left
            if (currentBlock.type === "text") {
              return id === "top-left";
            }
            // NON-TEXT → all
            return true;
          })
          .map(({ id, interaction }) => {
            const pos =
              id === "top-left"
                ? { left: -6, top: -6, cursor: "nwse-resize" }
                : id === "top-right"
                ? { right: -6, top: -6, cursor: "nesw-resize" }
                : id === "bottom-left"
                ? { left: -6, bottom: -6, cursor: "nesw-resize" }
                : { right: -6, bottom: -6, cursor: "nwse-resize" };

            return (
              <div
                key={id}
                style={{ ...handleCommon, ...pos }}
                onPointerDown={(e) => startInteraction(e, interaction, id)}
              />
            );
          })}

      {/* Side resize handles */}
      {canResize &&
        !isLocked &&
        sideHandles
          .filter(({ id }) => {
            // TEXT → only right
            if (currentBlock.type === "text") {
              return id === "right";
            }
            // NON-TEXT → all
            return true;
          })
          .map(({ id, interaction }) => {
            let style = { ...handleCommon };

            if (id === "left")
              style = {
                ...style,
                left: -6,
                top: "50%",
                transform: "translateY(-50%)",
              };
            if (id === "right")
              style = {
                ...style,
                right: -6,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "ew-resize", // ✅ arrow cursor
              };
            if (id === "top")
              style = {
                ...style,
                top: -6,
                left: "50%",
                transform: "translateX(-50%)",
              };
            if (id === "bottom")
              style = {
                ...style,
                bottom: -6,
                left: "50%",
                transform: "translateX(-50%)",
              };

            return (
              <div
                key={id}
                style={style}
                onPointerDown={(e) => startInteraction(e, interaction, id)}
              />
            );
          })}

      {/* Action buttons */}
      <div
        style={{
          position: "absolute",
          top: "115%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          pointerEvents: "auto",
        }}
      >
        {/* ROTATE */}
        <button
          onPointerDown={(e) => {
            if (isLocked) return;
            startInteraction(e, "rotate");
          }}
          style={{
            padding: "4px 6px",
            cursor: "grab",
            border: "1px solid rgba(168, 85, 247, 0.9)",
            background: "#fff",
            borderRadius: 4,
            transform: `rotate(${-rotation}deg)`,
          }}
          title="Rotate"
        >
          <span
            style={{
              display: "inline-block",
              transform: `rotate(${rotation}deg)`,
            }}
          >
            ⟳
          </span>
        </button>

        {/* MOVE */}
        <button
          onPointerDown={(e) => {if (isLocked) return;startInteraction(e, "move")}}
          style={{
            padding: "4px 6px",
            cursor: "move",
            border: "1px solid rgba(168, 85, 247, 0.9)",
            background: "#fff",
            borderRadius: 4,
          }}
          title="Move"
        >
          ⤢
        </button>
      </div>
    </div>
  );
}

export default observer(SelectionOverlay);
