"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import dynamic from "next/dynamic";
import { useEffect, useImperativeHandle, forwardRef } from "react";

// Wrap component with forwardRef
const MyEditor = forwardRef(({ content, editing }, ref) => {
  const editor = useCreateBlockNote({
    initialContent: undefined,
  });

  // Load markdown content when it changes
  useEffect(() => {
    if (!editor || !content) return;

    let cancelled = false;

    async function loadContent() {
      try {
        const blocks = await editor.tryParseMarkdownToBlocks(content);

        if (!cancelled && blocks) {
          editor.replaceBlocks(editor.document, blocks);
        }
      } catch (error) {
        console.error("Failed to parse markdown:", error);
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, [editor, content]);

  // Update editable state when it changes
  useEffect(() => {
    if (editor) {
      editor.isEditable = editing;
    }
  }, [editor, editing]);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    editor, // expose the editor instance

    resetContent: async () => {
      if (!editor || !content) return;
      try {
        const blocks = await editor.tryParseMarkdownToBlocks(content);
        editor.replaceBlocks(editor.document, blocks);
      } catch (error) {
        console.error("Failed to reset content:", error);
      }
    },

    getMarkdown: async () => {
      if (!editor) return "";
      try {
        return await editor.blocksToMarkdownLossy(editor.document);
      } catch (error) {
        console.error("Failed to get markdown:", error);
        return "";
      }
    }
  }), [editor, content]); // Add dependencies

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      formattingToolbar={editing}
      slashMenu={editing}
      sideMenu={editing}
    />
  );
});

// Add display name for better debugging
MyEditor.displayName = "MyEditor";

export default MyEditor;

export const Editor = dynamic(
  () => import("@/components/DashboardMain/Media/Blog/editor"), 
  { ssr: false }
);