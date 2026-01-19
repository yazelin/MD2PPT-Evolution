
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BackgroundTweaker } from '../components/tweaker/BackgroundTweaker';
import { VisualTweakerProvider, useVisualTweaker } from '../contexts/VisualTweakerContext';
import { BlockType } from '../services/types';
import React from 'react';

describe('BackgroundTweaker', () => {
  it('should render and handle re-roll', () => {
    const onUpdateContent = vi.fn();
    const mockMarkdown = '---\nbg: mesh\n---';
    
    const TestWrapper = () => {
      const { openTweaker } = useVisualTweaker();
      React.useEffect(() => {
        const mockElement = document.createElement('div');
        openTweaker(mockElement, 'BACKGROUND' as any, 0);
      }, [openTweaker]);
      
      return <BackgroundTweaker />; 
    };

    render(
      <VisualTweakerProvider onUpdateContent={onUpdateContent} onGetLineContent={() => mockMarkdown}>
        <TestWrapper />
      </VisualTweakerProvider>
    );

    const rerollButton = screen.getByText(/Re-roll/i);
    fireEvent.click(rerollButton);

    // Should trigger update with new seed
    expect(onUpdateContent).toHaveBeenCalled();
  });
});
