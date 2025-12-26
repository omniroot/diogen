import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
// src/Tiptap.tsx
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { type FC, useEffect } from "react";
import "./TextEditor.css";

interface Props {
	initialContent?: string; // Initial Markdown content
	onChange?: (markdown: string) => void; // Callback for Markdown output
}

export const TextEditor: FC<Props> = ({ initialContent, onChange }) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure(),
			Heading.configure({}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			// Markdown.configure({
			// 	html: false, // Output pure Markdown
			// }),
		],

		editorProps: { attributes: { style: "width: 100%; outline:none;" } },
		content: initialContent,
		onUpdate: ({ editor }) => {
			if (onChange) {
				onChange(editor.getHTML());
			}
		},
	});

	// const state = useEditorState({ editor });

	// Load initial content if provided
	useEffect(() => {
		if (editor && initialContent) {
			editor.commands.setContent(initialContent);
		}
	}, [editor, initialContent]);

	if (!editor) {
		return null;
	}

	return (
		<div className="text-editor-container" style={{ width: "100%" }}>
			<EditorContent editor={editor} className="text-editor" />

			{/* <Separator w={"100%"} size={"lg"} my={4} /> */}
			{/* <pre>{JSON.stringify(editor.getJSON(), null, 2)}</pre> */}
		</div>
	);
};
