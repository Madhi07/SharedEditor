import { useRef, useCallback, useEffect } from "react";

export default function useCanvasInteraction({ store, pageId }) {
  const interactionRef = useRef(null);
  const rafRef = useRef(null);

  const getAngle = (cx, cy, px, py) =>
    Math.atan2(py - cy, px - cx) * (180 / Math.PI);

  /* ================= POINTER MOVE ================= */
  const onPointerMove = useCallback(
    (e) => {
      const i = interactionRef.current;
      if (!i) return;

      const dx = e.clientX - i.startPointer.x;
      const dy = e.clientY - i.startPointer.y;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = store.blockRefs?.[pageId]?.[i.blockId];
        if (!el) return;

        /* ================= MOVE (SCREEN SPACE) ================= */
        if (i.type === "move") {
          el.style.setProperty("--drag-x", `${dx}px`);
          el.style.setProperty("--drag-y", `${dy}px`);

          store.dragState.active = true;
          store.dragState.x = dx;
          store.dragState.y = dy;
          store.dragState.w = null;
          store.dragState.h = null;
          return;
        }

        /* ================= RESIZE ================= */
        if (i.type === "resize") {
          const isText = i.blockType === "text";

          // TEXT — width only (right handle)
          if (isText && i.textResizeMode === "width") {
            const w = Math.max(50, i.startSize.width + dx);

            el.style.setProperty("--resize-w", `${w}px`);
            el.style.setProperty("--drag-x", `0px`);
            el.style.setProperty("--drag-y", `0px`);

            store.dragState.active = true;
            store.dragState.x = 0;
            store.dragState.y = 0;
            store.dragState.w = w;
            store.dragState.h = null;
            return;
          }

          // TEXT — scale (left / corner)
          if (isText && i.textResizeMode === "scale") {
            const scale = Math.max(0.5, 1 + -dx / i.startSize.width);

            const w = i.startSize.width * scale;
            const h = i.startSize.height * scale;
            const deltaW = w - i.startSize.width;

            el.style.setProperty("--resize-w", `${w}px`);
            el.style.setProperty("--resize-h", `${h}px`);
            el.style.setProperty("--font-scale", scale);

            store.dragState.active = true;
            store.dragState.x = -deltaW / 2;
            store.dragState.y = 0;
            store.dragState.w = w;
            store.dragState.h = h;
            return;
          }

          // NON-TEXT resize
          let w = i.startSize.width;
          let h = i.startSize.height;
          let ox = 0;
          let oy = 0;

          if (i.handle.includes("right")) w += dx;
          if (i.handle.includes("left")) {
            w -= dx;
            ox = dx / 2;
          }
          if (i.handle.includes("bottom")) h += dy;
          if (i.handle.includes("top")) {
            h -= dy;
            oy = dy / 2;
          }

          w = Math.max(10, w);
          h = Math.max(10, h);

          el.style.setProperty("--resize-w", `${w}px`);
          el.style.setProperty("--resize-h", `${h}px`);
          el.style.setProperty("--drag-x", `${ox}px`);
          el.style.setProperty("--drag-y", `${oy}px`);

          store.dragState.active = true;
          store.dragState.x = ox;
          store.dragState.y = oy;
          store.dragState.w = w;
          store.dragState.h = h;
          return;
        }

        /* ================= ROTATE ================= */
        if (i.type === "rotate") {
          const angle = getAngle(i.center.x, i.center.y, e.clientX, e.clientY);
          const delta = angle - i.startAngle;
          const rot = i.startRotation + delta;

          el.style.setProperty("--rotate", `${rot}deg`);

          store.dragState.active = true;
          store.dragState.rotation = rot;
          store.dragState.x = 0;
          store.dragState.y = 0;
          store.dragState.w = null;
          store.dragState.h = null;
        }
      });
    },
    [store, pageId]
  );

  /* ================= END ================= */
  const endInteraction = useCallback(
    (e) => {
      const i = interactionRef.current;
      if (!i) return;

      cancelAnimationFrame(rafRef.current);

      const dx = e.clientX - i.startPointer.x;
      const dy = e.clientY - i.startPointer.y;

      const el = store.blockRefs?.[pageId]?.[i.blockId];
      if (el) {
        el.style.removeProperty("--drag-x");
        el.style.removeProperty("--drag-y");
        el.style.removeProperty("--resize-w");
        el.style.removeProperty("--resize-h");
        el.style.removeProperty("--font-scale");
      }

      /* ---------- COMMIT MOVE ---------- */
      if (i.type === "move") {
        store.updateBlock(i.blockId, {
          position: {
            x: i.startCenter.x + dx,
            y: i.startCenter.y + dy,
          },
        });
      }

      /* ---------- COMMIT RESIZE ---------- */
      if (i.type === "resize") {
        const isText = i.blockType === "text";

        if (isText && i.textResizeMode === "width") {
          const w = Math.max(50, i.startSize.width + dx);
          store.updateBlock(i.blockId, {
            size: { width: w, height: i.startSize.height },
          });
        } else if (isText && i.textResizeMode === "scale") {
          const scale = Math.max(0.5, 1 - dx / 200);
          store.updateBlock(i.blockId, {
            size: {
              width: i.startSize.width * scale,
              height: i.startSize.height * scale,
            },
            style: {
              ...i.startStyle,
              fontSize: i.startFontSize * scale,
            },
          });
        } else {
          let w = i.startSize.width;
          let h = i.startSize.height;
          let cx = i.startCenter.x;
          let cy = i.startCenter.y;

          if (i.handle.includes("right")) w += dx;
          if (i.handle.includes("left")) {
            w -= dx;
            cx += dx / 2;
          }
          if (i.handle.includes("bottom")) h += dy;
          if (i.handle.includes("top")) {
            h -= dy;
            cy += dy / 2;
          }

          store.updateBlock(i.blockId, {
            size: { width: Math.max(10, w), height: Math.max(10, h) },
            position: { x: cx, y: cy },
          });
        }
      }

      /* ---------- COMMIT ROTATE ---------- */
      if (i.type === "rotate") {
        const angle = getAngle(i.center.x, i.center.y, e.clientX, e.clientY);
        const delta = angle - i.startAngle;
        store.updateBlock(i.blockId, {
          rotation: i.startRotation + delta,
        });
      }
      
      store.dragState.active = false;
      store.dragState.rotation = null;
      store.dragState.x = 0;
      store.dragState.y = 0;
      store.dragState.w = null;
      store.dragState.h = null;
      store.isDragging = false;

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", endInteraction);
      interactionRef.current = null;
    },
    [store, pageId, onPointerMove]
  );

  /* ================= START ================= */
  const beginInteraction = useCallback(
    (e, { type, blockId, handle, textResizeMode }) => {
      e.preventDefault();
      e.stopPropagation();

      const block = store.getBlockById(blockId);
      if (!block) return;

      store.isDragging = true;

      const interaction = {
        type,
        blockId,
        handle,
        textResizeMode,
        blockType: block.type,
        startPointer: { x: e.clientX, y: e.clientY },
        startCenter: { ...block.position },
        startSize: { ...block.size },
        startFontSize: block.style?.fontSize ?? 18,
        startStyle: { ...block.style },
      };

      if (type === "rotate") {
        const rect = store.activeRect;
        if (!rect) return;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        interaction.startRotation = block.rotation ?? 0;
        interaction.center = { x: cx, y: cy };
        interaction.startAngle = getAngle(cx, cy, e.clientX, e.clientY);
      }

      interactionRef.current = interaction;

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", endInteraction);
    },
    [store, onPointerMove, endInteraction]
  );

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", endInteraction);
    };
  }, [onPointerMove, endInteraction]);

  return { beginInteraction };
}
