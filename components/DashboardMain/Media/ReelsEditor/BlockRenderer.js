import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import { observer } from "mobx-react-lite";
import { buildBlockStyle } from "../utils/canvasUtils/canvasConfig";
import { useCanvasStore } from "../context/CanvasStoreContext";

function BlockRenderer({ block, pageId, onSelect }) {
  const store = useCanvasStore();
  const blockRef = useRef(null);
  const textBeforeEditRef = useRef("");
  const textRef = useRef(null);
  const isSelected = store.selectedIds?.[0] === block.id;
  const isEditing = store.editingBlockId === block.id;

  /* --------------------------------------------------
     Register DOM ref (geometry reference only)
  -------------------------------------------------- */
  useEffect(() => {
    if (!store?.setBlockRef) return;
    store.setBlockRef(pageId, block.id, blockRef.current);
    return () => store.setBlockRef(pageId, block.id, null);
  }, [store, pageId, block.id]);

  /* --------------------------------------------------
     Pointer down → selection only
  -------------------------------------------------- */
  const onPointerDown = useCallback(
    (e) => {
      if (e.detail > 1) return;
      if (isEditing) return;

      e.stopPropagation();
      onSelect?.(block.id);
    },
    [block.id, block.type, isEditing, onSelect]
  );

  const isScalingText =
    store.isDragging && block.type === "text" && store.dragState?.w != null;

  /* --------------------------------------------------
     Double click → enter text edit
  -------------------------------------------------- */
  const onDoubleClick = useCallback(
    (e) => {
      if (block.type !== "text") return;
      if (store.editingBlockId === block.id) return;

      e.preventDefault();
      e.stopPropagation();

      textBeforeEditRef.current = store.getBlockById(block.id)?.text ?? "";

      store.setEditingBlock(block.id);
      store.setSelectionMode("text");
    },
    [block.id, block.type, store]
  );

  useEffect(() => {
    if (!isEditing) return;
    if (!textRef.current) return;

    // ✅ Seed existing text into the DOM ONCE
    textRef.current.innerText = block.text || "";
  }, [isEditing, block.text]);

  useEffect(() => {
    if (!isEditing) return;

    // Ensure we have the "before" value if we entered edit mode externally (e.g. overlay dblclick)
    if (!textBeforeEditRef.current) {
      textBeforeEditRef.current = block.text || "";
    }

    if (!textRef.current) return;

    // Focus AFTER React commits contentEditable=true
    requestAnimationFrame(() => {
      textRef.current.focus();

      // Optional: select all text
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      sel.removeAllRanges();
      sel.addRange(range);
    });
  }, [isEditing]);

  /* --------------------------------------------------
     Text input (live update only)
  -------------------------------------------------- */
  const handleTextInput =
    useCallback();
    // (e) => {
    //   store.updateBlock(block.id, {
    //     text: e.target.innerText,
    //   });
    // },
    // [block.id, store]

  /* --------------------------------------------------
     Text blur → commit + measure ONCE
  -------------------------------------------------- */
  const handleTextBlur = useCallback(
    (e) => {
      const el = e.target;
      const newText = el.innerText;
      const beforeText = textBeforeEditRef.current;

      if (beforeText !== newText) {
        store.applyCommand({
          name: "EditText",
          do: (s) => s.updateBlock(block.id, { text: newText }),
          undo: (s) => s.updateBlock(block.id, { text: beforeText }),
        });
      }

      const rect = el.scrollHeight;
      if (rect > 0) {
        store.updateBlock(block.id, {
          size: {
            width: block.size.width,
            height: rect,
          },
        });
      }

      textBeforeEditRef.current = "";
      store.setEditingBlock(null);
    },
    [block.id, store, block.size.width]
  );

  /* --------------------------------------------------
     Text styles (pure visual)
  -------------------------------------------------- */
  const style = block.style || {};

  const textStyle = useMemo(
    () => ({
      fontFamily: style.fontFamily || "Roboto",
      fontSize: `calc(${style.fontSize || 18}px * var(--font-scale, 1))`,
      color: style.color || "#000",
      fontWeight: style.bold ? "700" : "400",
      fontStyle: style.italic ? "italic" : "normal",
      textDecoration: [
        style.underline && "underline",
        style.strike && "line-through",
      ]
        .filter(Boolean)
        .join(" "),
      textAlign: block.textAlign || "center",
      lineHeight: style.lineHeight || "1.3",
      width: "100%",
      height: "100%",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      overflowWrap: "break-word",
      overflow: "hidden",
      minWidth: 0,
    }),
    [
      style.fontFamily,
      style.fontSize,
      style.color,
      style.bold,
      style.italic,
      style.underline,
      style.strike,
      style.lineHeight,
      block.textAlign,
    ]
  );
  useLayoutEffect(() => {
    if (block.type !== "text") return;

    // DO NOT measure while dragging or scaling
    if (store.isDragging || isScalingText) return;

    const el = blockRef.current?.querySelector("[contenteditable]");
    if (!el) return;

    el.style.height = "auto";
    el.style.minHeight = "5px";

    const nextHeight = Math.ceil(el.scrollHeight);

    if (
      typeof nextHeight === "number" &&
      nextHeight > 0 &&
      nextHeight !== block.size.height
    ) {
      store.updateBlock(block.id, {
        size: {
          width: block.size.width,
          height: nextHeight,
        },
      });
    }
  }, [
    block.text,
    block.style?.fontSize,
    block.style?.fontFamily,
    block.style?.lineHeight,
    block.style?.bold,
    block.style?.italic,
    block.style?.underline,
    block.textAlign,
    store.isDragging,
    isScalingText,
  ]);

  /* --------------------------------------------------
     Wrapper style (PURE canvas space)
  -------------------------------------------------- */
  const wrapperStyle = useMemo(() => {
    const x = block.position?.x ?? 0;
    const y = block.position?.y ?? 0;
    const w = block.size?.width ?? 0;
    const h = block.size?.height ?? 0;

    return {
      position: "absolute",
      left: x,
      top: y,
      // width: w,
      // height: h,
      opacity: block.opacity ?? 1,

      transform: `
        translate(-50%, -50%)
        translate3d(var(--drag-x, 0px), var(--drag-y, 0px), 0)
        rotate(var(--rotate, ${block.rotation ?? 0}deg))
      `,
      transformOrigin: "center",
      width: "var(--resize-w, " + w + "px)",
      height: "var(--resize-h, " + h + "px)",

      ...buildBlockStyle(block),
    };
  }, [
    block.position?.x,
    block.position?.y,
    block.size?.width,
    block.size?.height,
    block.rotation,
    block.opacity,
  ]);

  useLayoutEffect(() => {
    if (!isSelected || !blockRef.current) return;

    // Always track DOM position — even during drag
    const update = () => {
      const rect = blockRef.current.getBoundingClientRect();
      store.setActiveRect(rect);
    };

    update();

    //  during drag, poll per frame
    if (store.isDragging) {
      let raf;
      const loop = () => {
        update();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }

    console.log("block.position?.x", block.position?.x);
    console.log("block.position?.y", block.position?.y);
    console.log("block.size?.width", block.size?.width);
    console.log("block.size?.height", block.size?.height);
    console.log("block.rotation", block.rotation);
  }, [
    isSelected,
    store.isDragging,
    block.position?.x,
    block.position?.y,
    block.size?.width,
    block.size?.height,
    block.rotation,
  ]);

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */
  return (
    <div
      ref={blockRef}
      data-block-id={block.id}
      style={wrapperStyle}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      {block.type === "text" && (
        <div
          ref={textRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onInput={handleTextInput}
          onBlur={handleTextBlur}
          style={textStyle}
        >
          {!isEditing ? block.text : null}
        </div>
      )}

      {block.type === "image" && (
        <img
          src={block.src || block.url}
          draggable={false}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

export default observer(BlockRenderer);
