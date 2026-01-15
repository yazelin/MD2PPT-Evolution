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
import { EditorActionService } from '../services/editorActionService';
import { ACTION_TEMPLATES } from '../constants/templates';

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
    if (!textareaRef.current) return;
    
    const service = new EditorActionService(textareaRef.current);
    
    switch (action.type) {
        // Structure & Layouts
        case 'INSERT_SLIDE':
            service.insertText(ACTION_TEMPLATES.INSERT_SLIDE, setContent);
            break;
        case 'LAYOUT_GRID':
            service.insertText(ACTION_TEMPLATES.LAYOUT_GRID, setContent);
            break;
        case 'LAYOUT_QUOTE':
            service.insertText(ACTION_TEMPLATES.LAYOUT_QUOTE, setContent);
            break;
        case 'LAYOUT_ALERT':
            service.insertText(ACTION_TEMPLATES.LAYOUT_ALERT, setContent);
            break;
            
        // Components
        case 'INSERT_TABLE':
            service.insertText(ACTION_TEMPLATES.INSERT_TABLE, setContent);
            break;
        case 'INSERT_IMAGE':
            service.insertText(ACTION_TEMPLATES.INSERT_IMAGE, setContent);
            break;
        case 'INSERT_NOTE':
            service.insertText(ACTION_TEMPLATES.INSERT_NOTE, setContent);
            break;
            
        // Formatting
        case 'FORMAT_BOLD':
            service.wrapText('**', '**', setContent);
            break;
        case 'FORMAT_ITALIC':
            service.wrapText('*', '*', setContent);
            break;
        case 'FORMAT_CODE':
            service.wrapText('`', '`', setContent);
            break;
            
        default:
            console.warn(`Unknown action: ${action.type}`);
    }
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