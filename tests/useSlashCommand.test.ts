import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSlashCommand } from '../hooks/useSlashCommand';

// Mock the utility to control coordinates
vi.mock('../utils/caretPosition', () => ({
  getCaretCoordinates: vi.fn(() => ({ top: 100, left: 100, lineHeight: 20 }))
}));

import { getCaretCoordinates } from '../utils/caretPosition';

describe('useSlashCommand', () => {
  let textarea: HTMLTextAreaElement;
  let onInsert: any;

  beforeEach(() => {
    textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    onInsert = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(textarea);
  });

  it('should trigger menu when / is typed at start', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1);
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should filter commands based on query', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1); // open
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      textarea.value = '/h';
      textarea.selectionStart = 2;
      result.current.handleInputChange('/h', 2); // query 'h'
    });

    expect(result.current.query).toBe('h');
    expect(result.current.filteredCommands.every(c => c.label.toLowerCase().includes('h') || c.category.toLowerCase().includes('h'))).toBe(true);
  });

  it('should select command and call onInsert', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1);
    });

    const command = result.current.filteredCommands[0];
    act(() => {
      result.current.selectCommand(command);
    });

    expect(onInsert).toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
  });

  it('should position cursor correctly at $cursor marker', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    // Select Heading 1 which has template '# $cursor'
    const h1Command = { id: 'h1', label: 'H1', icon: vi.fn(), category: 'B', template: '# $cursor' };
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1);
    });

    act(() => {
      result.current.selectCommand(h1Command as any);
    });

    // Mock the textarea behavior when onInsert is called by the parent
    textarea.value = '# ';
    
    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(textarea.selectionStart).toBe(2); // After '# '
    vi.useRealTimers();
  });

  it('should handle keyboard navigation', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1); // open
    });

    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: vi.fn() } as any);
    });
    expect(result.current.selectedIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: vi.fn() } as any);
    });
    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown({ key: 'Enter', preventDefault: vi.fn() } as any);
    });
    expect(onInsert).toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
  });

  it('should close menu on Escape', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1); // open
    });

    act(() => {
      result.current.handleKeyDown({ key: 'Escape', preventDefault: vi.fn() } as any);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should return empty list when no commands match', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1); // open
    });

    act(() => {
      textarea.value = '/xyznonexistent';
      textarea.selectionStart = 15;
      result.current.handleInputChange('/xyznonexistent', 15);
    });

    expect(result.current.filteredCommands.length).toBe(0);
  });

  it('should flip to top placement when close to bottom edge', () => {
    // Mock window height to 500px
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 500 });
    
    // Mock caret position near bottom (400px top + 20px line = 420px. Space below = 80px < 320px menu)
    (getCaretCoordinates as any).mockReturnValue({ top: 400, left: 100, lineHeight: 20 });
    
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1);
    });

    expect(result.current.position.placement).toBe('top');
    // Expect top to be coords.top - 5
    expect(result.current.position.top).toBe(395);
  });

  it('should stay at bottom placement when space is sufficient', () => {
    // Mock window height to 1000px
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1000 });
    
    // Mock caret position at top (100px)
    (getCaretCoordinates as any).mockReturnValue({ top: 100, left: 100, lineHeight: 20 });
    
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1);
    });

    expect(result.current.position.placement).toBe('bottom');
    // Expect top to be coords.top + line + 5
    expect(result.current.position.top).toBe(125);
  });
});