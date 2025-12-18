// SharedComponent/SelectionOverlay.js
import React from "react";

export default function SelectionOverlay({
  block,
  canvasRect,
  beginInteraction,
  onSelect = () => {},
  canResize = true,
  cornerHandles = [],
  sideHandles = [],
  getFit,
}) {
  if (!block || !canvasRect) return null;

  // const fit = getFit?.();
  // if (!fit) return null;

  // const { sx = 1, sy = 1 } = fit;

  /* -------------------------------------------------
     LOGICAL → CANVAS (single source of truth)
     position.x / y are LOGICAL coordinates
  ------------------------------------------------- */

  const fit = getFit?.();
  if (!fit) return null;

  const { sx = 1, sy = 1 } = fit;

  const width = (block.size?.width || 0) * sx;
  const height = (block.size?.height || 0) * sy;

  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;

  const cx = canvasRect.left + block.position.x * sx;
  const cy = canvasRect.top + block.position.y * sy;

  /* -------------------------------------------------
     Transform
  ------------------------------------------------- */
  const transform = `
    translate(-50%, -50%)
    ${block.rotation ? `rotate(${block.rotation}deg)` : ""}
    ${block.flipH ? "scaleX(-1)" : ""}
    ${block.flipV ? "scaleY(-1)" : ""}
  `;

  /* -------------------------------------------------
     Styles
  ------------------------------------------------- */
  const wrapperStyle = {
    position: "fixed",
    left: cx,
    top: cy,
    width: block.size.width * sx,
    height: block.size.height * sy,
    transform: `
    translate(-50%, -50%)
    ${block.rotation ? `rotate(${block.rotation}deg)` : ""}
  `,
    transformOrigin: "center",
    zIndex: 999999,
    outline: "1px solid #a855f7",
    background: "rgba(255,0,0,0.1)",
  };

  const borderStyle = {
    position: "absolute",
    inset: 0,
    border: "1px solid #a855f7",
    boxSizing: "border-box",
    pointerEvents: "none",
  };

  const handleCommon = {
    position: "absolute",
    width: 12,
    height: 12,
    background: "#fff",
    border: "2px solid #a855f7",
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

    e.target?.setPointerCapture?.(e.pointerId);

    beginInteraction?.(e, {
      type,
      blockId: block.id,
      handle,
      canvasRect,
    });
  };

  console.log("[SelectionOverlay]", {
    blockId: block.id,
    blockPos: block.position,
    blockSize: block.size,
    canvasRect,
    // fit,
    computed: { cx, cy, width, height },
  });

  /* -------------------------------------------------
     Render
  ------------------------------------------------- */
  return (
    <div style={wrapperStyle}>
      {/* Selection border */}
      <div style={borderStyle} />

      {/* ✅ MOVE BY GRABBING THE BLOCK */}
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
        cornerHandles.map(({ id, interaction }) => {
          const pos =
            id === "top-left"
              ? { left: -8, top: -8, cursor: "nwse-resize" }
              : id === "top-right"
              ? { right: -8, top: -8, cursor: "nesw-resize" }
              : id === "bottom-left"
              ? { left: -8, bottom: -8, cursor: "nesw-resize" }
              : { right: -8, bottom: -8, cursor: "nwse-resize" };

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
        sideHandles.map(({ id, interaction }) => {
          let style = { ...handleCommon };

          if (id === "left")
            style = {
              ...style,
              left: -8,
              top: "50%",
              transform: "translateY(-50%)",
            };
          if (id === "right")
            style = {
              ...style,
              right: -8,
              top: "50%",
              transform: "translateY(-50%)",
            };
          if (id === "top")
            style = {
              ...style,
              top: -8,
              left: "50%",
              transform: "translateX(-50%)",
            };
          if (id === "bottom")
            style = {
              ...style,
              bottom: -8,
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

      {/* -------------------------------------------------
         ✅ ACTION BUTTONS
         Move + Rotate
      ------------------------------------------------- */}
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
        {/* ROTATE — ONLY VIA BUTTON */}
        <button
          onPointerDown={(e) => startInteraction(e, "rotate")}
          style={{
            padding: "4px 6px",
            cursor: "grab",
            border: "1px solid #a855f7",
            background: "#fff",
            borderRadius: 4,
          }}
          title="Rotate"
        >
          ⟳
        </button>

        {/* MOVE — OPTIONAL BUTTON */}
        <button
          onPointerDown={(e) => startInteraction(e, "move")}
          style={{
            padding: "4px 6px",
            cursor: "move",
            border: "1px solid #a855f7",
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
