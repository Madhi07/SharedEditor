// SharedComponent/SelectionOverlay.js
import React from "react";

export default function SelectionOverlay({
  block,
  beginInteraction,
  onSelect = () => {},
  canResize = true,
  cornerHandles = [],
  sideHandles = [],
  getFit,
}) {
  if (!block) return null;

  const fit = getFit?.();
  if (!fit) return null;

  const { sx, sy } = fit;

  const width = block.size.width * sx;
  const height = block.size.height * sy;

  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;

  // block.position is already CENTER-based logical space
  const centerX = block.position.x * sx;
  const centerY = block.position.y * sy;

  const wrapperStyle = {
    position: "absolute",
    left: centerX,
    top: centerY,
    width,
    height,
    transform: `
    translate(-50%, -50%)
    ${block.rotation ? `rotate(${block.rotation}deg)` : ""}
    ${block.flipH ? " scaleX(-1)" : ""}
    ${block.flipV ? " scaleY(-1)" : ""}
  `,
    transformOrigin: "center",
    zIndex: 9999,
    outline: "1px solid rgba(168, 85, 247, 0.9)",
    pointerEvents: "auto",
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

    beginInteraction?.(e, {
      type,
      blockId: block.id,
      handle,
    });
  };

  console.log("SELECTION OVERLAY POS", {
    centerX,
    centerY,
    fit,
  });

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
        cornerHandles.map(({ id, interaction }) => {
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
        sideHandles.map(({ id, interaction }) => {
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
          }}
          title="Rotate"
        >
          ⟳
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
