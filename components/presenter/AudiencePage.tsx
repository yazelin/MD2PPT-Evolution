/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { useMarkdownEditor } from '../../hooks/useMarkdownEditor';
import { useDarkMode } from '../../hooks/useDarkMode';
import { EditorProvider } from '../../contexts/EditorContext';
import { AudienceView } from './AudienceView';

export const AudiencePage: React.FC = () => {
  const editorState = useMarkdownEditor();
  const darkModeState = useDarkMode();

  return (
    <EditorProvider editorState={editorState} darkModeState={darkModeState}>
      <AudienceView slides={[]} currentIndex={0} />
    </EditorProvider>
  );
};
