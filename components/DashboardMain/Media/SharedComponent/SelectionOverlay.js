import React from "react";
import { useCanvasStore } from "../context/CanvasStoreContext";
import { observer } from "mobx-react-lite";

function SelectionOverlay({
  block,
  beginInteraction,
  onSelect = () => {},
  canResize = true,
  cornerHandles = [],
  sideHandles = [],
}) {
  const store = useCanvasStore();

  // We REQUIRE a DOM rect (Infographics-style)
  const rect = store.activeRect;
  if (!rect) return null;

  const ds = store.dragState;
  const isActive = ds.active;

  const width = isActive && ds.w != null ? ds.w : rect.width;
  const height = isActive && ds.h != null ? ds.h : rect.height;

  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const rotation =
    store.dragState.active && store.dragState.rotation != null
      ? store.dragState.rotation
      : block.rotation ?? 0;

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

    if (block.type === "text" && type === "resize") {
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
      blockId: block.id,
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
        onPointerDown={(e) => startInteraction(e, "move")}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(block.id);
        }}
      />

      {/* Corner resize handles */}
      {canResize &&
        cornerHandles
          .filter(({ id }) => {
            // TEXT → only top-left
            if (block.type === "text") {
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
        sideHandles
          .filter(({ id }) => {
            // TEXT → only right
            if (block.type === "text") {
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
          onPointerDown={(e) => startInteraction(e, "rotate")}
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
          onPointerDown={(e) => startInteraction(e, "move")}
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
