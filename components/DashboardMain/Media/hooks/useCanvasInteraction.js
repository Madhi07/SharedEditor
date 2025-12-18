// hooks/useCanvasInteraction.js
import { useRef, useCallback, useEffect } from "react";

/**
 * useCanvasInteraction
 *
 * VIDEO-SAFE MODEL
 *
 * Coordinate system:
 * - block.position = CENTER (canvas space)
 * - overlay already converted canvas → client
 *
 * Responsibilities:
 * - this hook converts client deltas → canvas deltas
 * - NO DOM rect access
 */
export default function useCanvasInteraction({
  store,
  pageId,
  getFit, // ✅ scale only
  commit = () => {},
} = {}) {
  const interactionRef = useRef(null);

  /* ----------------------------------------
     POINTER MOVE
  ---------------------------------------- */
  const onPointerMove = useCallback(
    (e) => {
      const i = interactionRef.current;
      if (!i) return;

      e.preventDefault();

      const fit = getFit?.();
      const scale = fit?.sx || 1;

      /* ---------- MOVE ---------- */
      /* ---------- MOVE Logic ---------- */
      if (i.type === "move") {
        // 1. Get the current scale from your computeMediaFit logic
        const fit = getFit?.();
        const scale = fit?.sx || 1; // This is the 'sx' you set in setFit

        // 2. Calculate mouse delta in physical screen pixels
        const dxClient = e.clientX - i.lastClient.x;
        const dyClient = e.clientY - i.lastClient.y;

        // 3. Update the tracker for the next move event
        i.lastClient.x = e.clientX;
        i.lastClient.y = e.clientY;

        // 4. TRANSFORM: Convert Screen Pixels -> Logical Pixels
        // We DIVIDE by the scale.
        // If scale is 0.5 (canvas is half size), moving 1px on screen
        // must move the block 2px in the 1080x1920 logical space.
        const dxLogical = dxClient / scale;
        const dyLogical = dyClient / scale;

        // 5. Apply the logical movement to the store
        const block = store.getBlockById(i.blockId);
        if (block) {
          store.updateBlock(i.blockId, {
            position: {
              x: block.position.x + dxLogical,
              y: block.position.y + dyLogical,
            },
          });
        }
        console.log("move",dxLogical,dyLogical)
      }

      /* ---------- ROTATE ---------- */
      if (i.type === "rotate") {
        if (!i.centerClient) {
          i.centerClient = { x: e.clientX, y: e.clientY };
          i.startAngle = Math.atan2(
            e.clientY - i.centerClient.y,
            e.clientX - i.centerClient.x
          );
          return;
        }

        const angle = Math.atan2(
          e.clientY - i.centerClient.y,
          e.clientX - i.centerClient.x
        );

        const delta = angle - i.startAngle;

        store.updateBlock(i.blockId, {
          rotation: (i.startRotation || 0) + (delta * 180) / Math.PI,
        });
      }
    },
    [store, getFit]
  );

  /* ----------------------------------------
     END INTERACTION
  ---------------------------------------- */
  const endInteraction = useCallback(() => {
    const i = interactionRef.current;
    if (!i) return;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", endInteraction);

    interactionRef.current = null;

    commit?.({
      name: "CanvasInteraction",
      blockId: i.blockId,
      pageId,
    });
  }, [commit, pageId, onPointerMove]);

  /* ----------------------------------------
     BEGIN INTERACTION
  ---------------------------------------- */
  const beginInteraction = useCallback(
    (e, { type, blockId, handle }) => {
      e.preventDefault();
      e.stopPropagation();
      e.target?.setPointerCapture?.(e.pointerId);

      const block = store.getBlockById(blockId);
      if (!block) return;

      interactionRef.current = {
        type,
        handle,
        blockId,

        lastClient: {
          x: e.clientX,
          y: e.clientY,
        },

        startRotation: block.rotation || 0,
        centerClient: null,
        startAngle: null,
      };

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", endInteraction);
    },
    [store, onPointerMove, endInteraction]
  );

  /* ----------------------------------------
     CLEANUP
  ---------------------------------------- */
  useEffect(() => {
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", endInteraction);
    };
  }, [onPointerMove, endInteraction]);

  return { beginInteraction };
}
