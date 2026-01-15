/**
 * BookPublisher MD2Docx
 * Copyright (c) 2025 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { useMarkdownEditor } from '../hooks/useMarkdownEditor';
import { useDarkMode } from '../hooks/useDarkMode';
import { EditorProvider } from '../contexts/EditorContext';

// Components
import { EditorHeader } from './editor/EditorHeader';
import { EditorPane } from './editor/EditorPane';
import { PreviewPane } from './editor/PreviewPane';
import { QuickActionSidebar, ActionType } from './editor/QuickActionSidebar';

const MarkdownEditor: React.FC = () => {
  const darkModeState = useDarkMode();
  const editorState = useMarkdownEditor();
  
  const {
    content,
    setContent,
    parsedBlocks,
    wordCount,
    textareaRef,
    previewRef,
    handleScroll,
  } = editorState;

  const handleAction = (action: { type: ActionType }) => {
    console.log("Action triggered:", action.type);
    // TODO: Implement action logic in Phase 2
  };

  return (
    <EditorProvider editorState={editorState} darkModeState={darkModeState}>
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
        <EditorHeader />

        <main className="flex flex-1 overflow-hidden">
          <QuickActionSidebar onAction={handleAction} />
          
          <div className="flex flex-1 overflow-hidden">
            <EditorPane 
              content={content}
              setContent={setContent}
              wordCount={wordCount}
              textareaRef={textareaRef}
              onScroll={handleScroll}
            />

            <PreviewPane 
              parsedBlocks={parsedBlocks}
              previewRef={previewRef}
              />
          </div>
        </main>
      </div>
    </EditorProvider>
  );
};

export default MarkdownEditor;