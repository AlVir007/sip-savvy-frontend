// src/components/publishing/editor/ArticleEditor.tsx
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, Italic, Link as LinkIcon, Image as ImageIcon, 
  List, ListOrdered, Heading1, Heading2, Undo, Redo
} from 'lucide-react';

interface ArticleEditorProps {
  initialContent?: string;
  initialTitle?: string;
  initialExcerpt?: string;
  onSave: (data: { title: string; content: string; excerpt: string }) => void;
  saving?: boolean;
}

export function ArticleEditor({
  initialContent = '',
  initialTitle = '',
  initialExcerpt = '',
  onSave,
  saving = false
}: ArticleEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your article here...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none p-4 min-h-[400px]',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent && !editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const handleSave = () => {
    if (!editor) return;
    onSave({
      title,
      content: editor.getHTML(),
      excerpt,
    });
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="text-xl font-bold"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="text-sm font-medium">
          Excerpt
        </label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt or summary (optional)"
          rows={2}
        />
      </div>

      <div className="border rounded-md">
        <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'bg-gray-200' : ''}
          >
            <Bold size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive('italic') ? 'bg-gray-200' : ''}
          >
            <Italic size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          >
            <Heading1 size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          >
            <Heading2 size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor?.isActive('bulletList') ? 'bg-gray-200' : ''}
          >
            <List size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={editor?.isActive('orderedList') ? 'bg-gray-200' : ''}
          >
            <ListOrdered size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={addLink}
            className={editor?.isActive('link') ? 'bg-gray-200' : ''}
          >
            <LinkIcon size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={addImage}
          >
            <ImageIcon size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <Undo size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <Redo size={16} />
          </Button>
        </div>
        <EditorContent editor={editor} className="min-h-[400px]" />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Article'}
        </Button>
      </div>
    </div>
  );
}