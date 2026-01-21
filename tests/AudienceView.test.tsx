import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AudienceView } from '../components/presenter/AudienceView';
import { ParsedBlock, BlockType } from '../services/types';

// Mock dependencies
vi.mock('../components/editor/PreviewPane', () => ({
  SlideContent: ({ slide }: any) => <div data-testid="slide-content">Slide {slide.index} Content</div>
}));

// Mock PresentationSyncService to avoid side effects during render
const vi_mockData = {
  handler: null as any
};

vi.mock('../services/PresentationSyncService', () => ({
  PresentationSyncService: vi.fn(function() {
    return {
      onMessage: vi.fn((handler) => { 
        (global as any).lastMessageHandler = handler; 
      }),
      offMessage: vi.fn(),
      close: vi.fn(),
      sendMessage: vi.fn()
    };
  }),
  SyncAction: {
    GOTO_SLIDE: 'GOTO_SLIDE',
    BLACK_SCREEN: 'BLACK_SCREEN',
    REQUEST_SYNC: 'REQUEST_SYNC',
    SYNC_STATE: 'SYNC_STATE'
  }
}));

const mockSlides: any[] = [
  { index: 0, blocks: [{ type: BlockType.HEADING_1, content: 'Slide 1' }] },
  { index: 1, blocks: [{ type: BlockType.HEADING_1, content: 'Slide 2' }] }
];

describe('AudienceView', () => {
  it('renders "Waiting for presenter..." when no content is available', () => {
    render(<AudienceView slides={[]} currentIndex={0} />);
    expect(screen.getByText(/Waiting for presenter/i)).toBeInTheDocument();
  });

  it('updates slide index when receiving GOTO_SLIDE message', async () => {
    render(<AudienceView slides={mockSlides} currentIndex={0} />);
    
    // Simulate sync message
    act(() => {
      (global as any).lastMessageHandler({ type: 'GOTO_SLIDE', payload: { index: 1 } });
    });

    expect(screen.getByText('Slide 1 Content')).toBeInTheDocument();
  });

  it('toggles blackout mode when receiving BLACK_SCREEN message', () => {
    render(<AudienceView slides={mockSlides} currentIndex={0} />);
    
    // Default: visible
    expect(screen.queryByTestId('blackout-overlay')).not.toBeInTheDocument();

    // Blackout ON
    act(() => {
      (global as any).lastMessageHandler({ type: 'BLACK_SCREEN', payload: { enabled: true } });
    });
    expect(screen.getByTestId('blackout-overlay')).toBeInTheDocument();

    // Blackout OFF
    act(() => {
      (global as any).lastMessageHandler({ type: 'BLACK_SCREEN', payload: { enabled: false } });
    });
    expect(screen.queryByTestId('blackout-overlay')).not.toBeInTheDocument();
  });
});
